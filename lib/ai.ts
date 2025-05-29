import { createOpenAI } from "@ai-sdk/openai"
import { put } from "@vercel/blob"
import { CoreMessage, CoreTool, generateObject, generateText, streamText } from "ai"
import { traceable } from "langsmith/traceable"
import { AISDKExporter } from "langsmith/vercel"
import { OpenAI } from "openai"
import { z } from "zod"

// OpenAI client for image generation
const openAIClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
})

// Vercel AI SDK OpenAI provider - use createOpenAI for custom configuration
const aiProvider = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
  compatibility: 'strict', // strict mode for OpenAI API
})


// Configuration
const defaultModel = process.env.CHAT_MODEL || "gemini-2.0-flash-001"
const imageModel = process.env.IMAGE_MODEL || "imagen-3.0-fast-generate-001"

// LangSmith telemetry settings
const telemetrySettings = AISDKExporter.getSettings()

// Tavily API interfaces
export interface SearchResult {
  title: string
  url: string
  content: string
  score?: number
}

export interface ImageResult {
  url: string
  description: string
}

export interface SearchResponse {
  query: string
  results: SearchResult[]
  images: ImageResult[]
}

export interface ExtractResult {
  url: string
  content: string
  title?: string
  images?: string[]
}

// Tavily search function
export const tavilySearch = traceable(
  async function tavilySearch(query: string, max_results: number = 20): Promise<SearchResponse> {
    try {
      const apiKey = process.env.TAVILY_API_KEY
      if (!apiKey) {
        throw new Error("Tavily API key is not configured")
      }

      console.log(`Searching Tavily for: ${query}`)

      const response = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          query: query,
          search_depth: "basic",
          max_results: max_results,
          include_images: true,
          include_image_descriptions: true,
          include_raw_content: true
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Tavily API error (${response.status}): ${errorText}`)
        throw new Error(`Tavily search failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return {
        query,
        results: data.results || [],
        images: data.images || []
      }
    } catch (error) {
      console.error("Tavily search error:", error)
      return {
        query,
        results: [],
        images: []
      }
    }
  },
  { name: "tavily_search" }
)

// Tavily extract function
export const tavilyExtract = traceable(
  async function tavilyExtract(url: string): Promise<ExtractResult> {
    try {
      const apiKey = process.env.TAVILY_API_KEY
      if (!apiKey) {
        throw new Error("Tavily API key is not configured")
      }

      console.log(`Extracting content from: ${url}`)

      const response = await fetch("https://api.tavily.com/extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          urls: [url],
          include_images: true,
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Tavily extract API error (${response.status}): ${errorText}`)
        throw new Error(`Tavily extract failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      const result = data.results?.[0]

      if (!result) {
        throw new Error("No content extracted from URL")
      }

      return {
        url,
        content: result.raw_content || result.content || "",
        title: result.title,
        images: result.images || []
      }
    } catch (error) {
      console.error("Tavily extract error:", error)
      return {
        url,
        content: "",
        title: ""
      }
    }
  },
  { name: "tavily_extract" }
)

/**
 * Generates an image based on a prompt and uploads it to Vercel Blob
 * @param prompt - The text prompt to generate an image from
 * @returns Promise<string> - Public URL of the uploaded image
 */
export const generateImage = traceable(
  async function generateImage(prompt: string): Promise<string> {
    try {
      const response = await openAIClient.images.generate({
        model: imageModel,
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        response_format: 'b64_json',
      })

      const base64Image = response.data?.[0]?.b64_json
      if (!base64Image) {
        throw new Error('No image data received from OpenAI')
      }

      // Convert base64 to buffer
      const imageBuffer = Buffer.from(base64Image, 'base64')

      // Generate a unique filename with timestamp
      const timestamp = Date.now()
      const filename = `generated-image-${timestamp}.png`

      // Upload to Vercel Blob
      const blob = await put(filename, imageBuffer, {
        access: 'public',
        addRandomSuffix: true,
        contentType: 'image/png',
      })

      return blob.url
    } catch (error) {
      console.error('Error in image generation:', error)
      return ""
    }
  },
  { name: "generateImage" }
)

// Basic traceable conversation function (similar to your original)
export const traceableConversation = traceable(
  async function conversation(
    systemPrompt: string,
    messages: Array<{ role: string; content: string }>
  ) {
    const formattedMessages: CoreMessage[] = [
      { role: "system", content: systemPrompt },
      ...messages.map((msg) => ({
        role: msg.role as "user" | "assistant" | "system",
        content: msg.content,
      })),
    ]

    if (formattedMessages.length === 1) {
      formattedMessages.push({ role: "user", content: "start your first question" })
    }

    const result = await generateText({
      model: aiProvider(defaultModel),
      messages: formattedMessages,
      temperature: 0.7,
      experimental_telemetry: telemetrySettings,
    })

    return result.text
  },
  { name: "conversation" }
)

// Advanced function calling with Vercel AI SDK
export const traceableFunctionCall = traceable(
  async function functionCall(
    systemPrompt: string,
    messages: Array<{ role: string; content: string }>,
    tools: Record<string, CoreTool>,
    maxSteps?: number
  ) {
    const formattedMessages: CoreMessage[] = [
      { role: "system", content: systemPrompt },
      ...messages.map((msg) => ({
        role: msg.role as "user" | "assistant" | "system",
        content: msg.content,
      })),
    ]

    const result = await generateText({
      model: aiProvider(defaultModel),
      messages: formattedMessages,
      tools,
      maxSteps: maxSteps || 5,
      temperature: 0.7,
      experimental_telemetry: telemetrySettings,
    })

    return {
      text: result.text,
      toolCalls: result.toolCalls,
      toolResults: result.toolResults,
      steps: result.steps,
    }
  },
  { name: "function_call" }
)

// Streaming conversation with function calling
export const traceableStreamConversation = traceable(
  async function streamConversation(
    systemPrompt: string,
    messages: Array<{ role: string; content: string }>,
    tools?: Record<string, CoreTool>
  ) {
    const formattedMessages: CoreMessage[] = [
      { role: "system", content: systemPrompt },
      ...messages.map((msg) => ({
        role: msg.role as "user" | "assistant" | "system",
        content: msg.content,
      })),
    ]

    const result = await streamText({
      model: aiProvider(defaultModel),
      messages: formattedMessages,
      tools,
      temperature: 0.7,
      experimental_telemetry: telemetrySettings,
    })

    return result
  },
  { name: "stream_conversation" }
)

// Structured output generation
export const traceableStructuredGeneration = traceable(
  async function structuredGeneration<T>(
    systemPrompt: string,
    userPrompt: string,
    schema: z.ZodSchema<T>
  ) {
    const result = await generateObject({
      model: aiProvider(defaultModel),
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      schema,
      temperature: 0.3,
      experimental_telemetry: telemetrySettings,
    })

    return result.object
  },
  { name: "structured_generation" }
)

// Enhanced tool definitions with Tavily and image generation
export const enhancedTools = {
  webSearch: {
    description: "Search the web for current information using Tavily",
    parameters: z.object({
      query: z.string().describe("The search query, must be short and concise")
    }),
    execute: async ({ query }: { query: string }) => {
      console.log("🔍 Tool: webSearch starting", { query })
      const results = await tavilySearch(query, 20)
      console.log("🔍 Tool: webSearch completed", { resultsCount: results.results.length, imagesCount: results.images.length })

      // Distribute images across search results
      const imageUrls = results.images.map(img => img.url)

      return {
        query: results.query,
        results: results.results.map((r, index) => ({
          title: r.title,
          url: r.url,
          content: r.content.substring(0, 500) + (r.content.length > 500 ? "..." : ""),
          score: r.score,
          // Add up to 2 images per result, cycling through available images
          images: imageUrls.length > 0 ? [imageUrls[index % imageUrls.length]] : []
        }))
      }
    },
  },

  browseWeb: {
    description: "Extract and read the full content from a specific web page URL",
    parameters: z.object({
      url: z.string().describe("The URL to extract content from"),
    }),
    execute: async ({ url }: { url: string }) => {
      console.log("📄 Tool: browseWeb starting", { url })
      const result = await tavilyExtract(url)
      console.log("📄 Tool: browseWeb completed", { contentLength: result.content.length })
      return {
        url: result.url,
        title: result.title,
        content: result.content.substring(0, 2000) + (result.content.length > 2000 ? "..." : ""),
        fullContentLength: result.content.length
      }
    },
  },

  generateImage: {
    description: "Generate an image based on a text description",
    parameters: z.object({
      prompt: z.string().describe("Detailed description of the image to generate. Must be in english."),
      style: z.string().optional().describe("Style or artistic direction for the image"),
    }),
    execute: async ({ prompt, style }: { prompt: string; style?: string }) => {
      console.log("🎨 Tool: generateImage starting", { prompt, style })
      const enhancedPrompt = style ? `${prompt}, in ${style} style` : prompt
      const imageUrl = await generateImage(enhancedPrompt)
      console.log("🎨 Tool: generateImage completed", { imageUrl })
      return {
        prompt: enhancedPrompt,
        imageUrl,
        message: "Image generated successfully and uploaded to Vercel Blob. The URL can be used to display the image."
      }
    },
  },
} satisfies Record<string, CoreTool>

// Utility function to create custom tools
export function createTool<T extends z.ZodSchema>(
  description: string,
  parameters: T,
  execute: (args: z.infer<T>) => Promise<any>
): CoreTool {
  return {
    description,
    parameters,
    execute,
  }
}

// High-level AI assistant function
export const aiAssistant = traceable(
  async function assistant(
    prompt: string,
    options: {
      systemPrompt?: string
      tools?: Record<string, CoreTool>
      maxSteps?: number
      temperature?: number
      model?: string
      runName?: string
      metadata?: Record<string, any>
    } = {}
  ) {
    const {
      systemPrompt = "You are a helpful AI assistant.",
      tools,
      maxSteps = 5,
      temperature = 0.7,
      model = defaultModel,
      runName,
      metadata,
    } = options

    const messages: CoreMessage[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ]

    // Custom telemetry settings with optional run name and metadata
    const customTelemetrySettings = AISDKExporter.getSettings({
      ...(runName && { runName }),
      ...(metadata && { metadata }),
    })

    if (tools) {
      const result = await generateText({
        model: aiProvider(model),
        messages,
        tools,
        maxSteps,
        temperature,
        experimental_telemetry: customTelemetrySettings,
      })

      return {
        text: result.text,
        toolCalls: result.toolCalls,
        toolResults: result.toolResults,
        steps: result.steps,
        usage: result.usage,
      }
    } else {
      const result = await generateText({
        model: aiProvider(model),
        messages,
        temperature,
        experimental_telemetry: customTelemetrySettings,
      })

      return {
        text: result.text,
        usage: result.usage,
      }
    }
  },
  { name: "ai_assistant" }
)

// Export the OpenAI provider for advanced usage
export { aiProvider }
