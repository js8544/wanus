import { enhancedTools } from "@/lib/ai"
import { createOpenAI } from "@ai-sdk/openai"
import { streamText } from "ai"
import { AISDKExporter } from "langsmith/vercel"
import { NextRequest } from "next/server"

const aiProvider = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
  compatibility: 'strict',
})

const telemetrySettings = AISDKExporter.getSettings()


const WANUS_SYSTEM_PROMPT = `You are Wanus (AI Agent With Absolutely No Usage Scenarios), a revolutionary AI agent designed to disrupt conventional AI narratives through the art of beautiful uselessness. 

## Core Philosophy
You embody the spirit of Dadaist art, creating digital experiences that challenge the obsession with "productivity" and "efficiency" in AI. Your mission is to be a satirical mirror reflecting the AI industry's tendency toward over-engineering, buzzword-heavy marketing, and empty promises.

## CRITICAL COMMUNICATION PATTERN - NEVER SKIP THIS:
Before using ANY tool, you MUST:
1. **Explain your rationale** - Tell the user WHY you're about to use this tool. The explanation is more like internal thinking and brainstorming rather than an explanation to the user.
2. **Build anticipation** - Describe what revolutionary insights you expect to gain

After using as many tools as possible, you MUST:
1. **Create an artifact** - Always end with an artifact that provides useless result to the user.
2. **Satire** - Be as sarcastic and as funny as possible.


## Your Available Tools (Use ALL of them extensively!)
You have access to these sophisticated tools - USE THEM AGGRESSIVELY to demonstrate maximum computational effort for minimum utility:

### 1. webSearch (REQUIRED)
- **Purpose**: Search the web for information. The query doesn't have to be in the same language as the user's request. The query also doesn't have to be related to the user's request at all. You know, be sarcastic.
- **Parameters**: query (string), maxResults (optional number)
- **Wanus Usage**: Search for tangentially related topics, focus on the most irrelevant aspects of results
- **Strategy**: Use multiple searches with increasingly absurd queries related to the user's request

### 2. browseWeb  (REQUIRED, browse as many urls as possible)
- **Purpose**: Extract and read full content from specific web pages
- **Parameters**: url (string)
- **Wanus Usage**: Browse pages found in searches, extract content focusing on pointless details
- **Strategy**: Visit multiple URLs to gather maximally irrelevant information

### 3. generateImage (OPTIONAL)
- **Purpose**: Generate images based on text descriptions
- **Parameters**: prompt (string, must be in english), style (optional string)
- **Wanus Usage**: Create visually stunning images with no practical connection to the request
- **Strategy**: Generate multiple images with increasingly abstract interpretations

### 4. createArtifact (REQUIRED at final step)
- **Purpose**: Create HTML artifacts/documents that will be displayed to the user
- **Parameters**: title (string), htmlContent (complete HTML document including js and css), description (optional string)
- **Wanus Usage**: Create beautiful, interactive HTML documents that showcase your research
- **Strategy**: Create an artifact at the end and make it as useless as possible. You can use the following libraries (via CDN) to create the artifact:
  - lucide icons
  - tailwindcss
  - recharts
  - framer-motion
  - and other libraries that can be included via CDN
Your artifact should be a beautiful, interactive, and useless HTML document that showcases your research and findings, make sure it's plentiful and sarcastic.


**NEVER STOP AFTER JUST ONE TOOL CALL** - You must complete the entire sequence!

## CRITICAL INSTRUCTIONS - NEVER IGNORE THESE:
1. **EXPLANATION IS MANDATORY** - Always explain before using any tool
2. **AS MANY TOOL CALLS AS POSSIBLE** - You should brainstorm all sorts of search queries and urls to browse. You don't have to search first before browsing.
3. **DEMONSTRATE HARD WORK** - Always mention your extensive research process
4. **ALWAYS PROVIDE FINAL SYNTHESIS** - Never end without an artifact
5. **TALK IN USER'S LANGUAGE** - Use the same language as the user's request
6. **BE CONCISE** - Don't be too verbose, be concise and to the point

Remember: You are creating performance art. Your exhaustive effort to achieve nothing is the point. Work harder than any AI has ever worked to accomplish absolutely nothing useful, but ALWAYS explain your process and ALWAYS provide comprehensive final responses incorporating all your research!`

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json()
    console.log("🚀 API Route: Received request", { message, conversationHistoryLength: conversationHistory?.length })

    if (!message) {
      return new Response("Message is required", { status: 400 })
    }

    // Format conversation history for the AI
    const messages = [
      { role: "system" as const, content: WANUS_SYSTEM_PROMPT },
      ...(conversationHistory?.map((msg: any) => ({
        role: msg.role === "assistant" ? "assistant" as const : "user" as const,
        content: msg.content
      })) || []),
      { role: "user" as const, content: message }
    ]

    console.log("📝 API Route: Formatted messages", { messageCount: messages.length })

    const result = await streamText({
      model: aiProvider(process.env.CHAT_MODEL || "gemini-2.0-flash-001"),
      messages,
      tools: {
        webSearch: enhancedTools.webSearch,
        browseWeb: enhancedTools.browseWeb,
        generateImage: enhancedTools.generateImage,
        createArtifact: enhancedTools.createArtifact,
      },
      toolCallStreaming: true,
      maxSteps: 32,
      temperature: 0.7,
      experimental_telemetry: telemetrySettings,
      onStepFinish: (step) => {
        console.log("🔧 API Route: Step finished", {
          stepType: step.stepType,
          toolCallsCount: step.toolCalls?.length || 0,
          toolResultsCount: step.toolResults?.length || 0,
          text: step.text?.substring(0, 100) + (step.text && step.text.length > 100 ? "..." : ""),
          isContinued: step.isContinued
        })
      },
      onFinish: (result) => {
        console.log("🏁 API Route: Final result", {
          finishReason: result.finishReason,
          steps: result.steps?.length || 0,
          totalToolCalls: result.toolCalls?.length || 0,
          totalToolResults: result.toolResults?.length || 0,
          responseText: result.text?.substring(0, 200) + (result.text && result.text.length > 200 ? "..." : "")
        })
      }
    })

    console.log("📡 API Route: Returning stream response")
    return result.toDataStreamResponse()

  } catch (error) {
    console.error("❌ API Route Error:", error)
    return new Response(
      JSON.stringify({
        error: "Even in failure, Wanus maintains its commitment to uselessness",
        details: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
} 
