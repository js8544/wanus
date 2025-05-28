"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, RefreshCw, Send, Sparkles } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

type MessageType = {
  role: "user" | "assistant" | "thinking" | "tool" | "tool-result"
  content: string
  toolName?: string
  imageUrl?: string
  id?: string
}

export default function AgentPage() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<MessageType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Debug logging for messages state
  useEffect(() => {
    console.log("🎭 Frontend: Messages state changed", {
      messageCount: messages.length,
      messages: messages.map(m => ({ role: m.role, id: m.id, contentLength: m.content?.length || 0 }))
    })
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const addMessage = (message: MessageType) => {
    setMessages((prev) => [...prev, message])
  }

  const updateLastMessage = (updates: Partial<MessageType>) => {
    setMessages((prev) => {
      const newMessages = [...prev]
      if (newMessages.length > 0) {
        newMessages[newMessages.length - 1] = { ...newMessages[newMessages.length - 1], ...updates }
      }
      return newMessages
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    console.log("🚀 Frontend: Starting request", { userMessage })

    // Add user message
    addMessage({ role: "user", content: userMessage })
    setInput("")
    setIsLoading(true)

    try {
      // Show thinking state
      addMessage({ role: "thinking", content: "Analyzing request and determining the most beautifully useless approach..." })

      // Get conversation history for context
      const conversationHistory = messages.filter(msg => msg.role === "user" || msg.role === "assistant")
      console.log("📝 Frontend: Conversation history", { historyLength: conversationHistory.length })

      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory
        }),
      })

      console.log("📡 Frontend: Response received", { status: response.status, ok: response.ok })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Remove thinking message
      setMessages(prev => prev.filter(msg => msg.role !== "thinking"))

      // Handle streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      console.log("🔄 Frontend: Starting stream reading", { hasReader: !!reader })

      let currentTextBuffer = "" // Buffer for current text segment
      let toolResults: any[] = []
      let generatedImages: string[] = []
      let currentAssistantMessage: MessageType | null = null
      let currentMessageId: string | null = null
      let allAssistantTexts: string[] = [] // Track all assistant text segments

      if (reader) {
        let chunkCount = 0
        while (true) {
          const { done, value } = await reader.read()
          chunkCount++
          console.log(`📦 Frontend: Chunk ${chunkCount}`, { done, valueLength: value?.length })

          if (done) {
            console.log("✅ Frontend: Stream reading completed")
            break
          }

          const chunk = decoder.decode(value)
          console.log(`🧩 Frontend: Decoded chunk ${chunkCount}`, { chunk })
          const lines = chunk.split('\n')
          console.log(`📄 Frontend: Split into ${lines.length} lines`, {
            lines: lines.slice(0, 3).map(l => ({ line: l, length: l.length })) // Show first 3 lines
          })

          for (const line of lines) {
            // Handle different stream part types according to Vercel AI SDK protocol
            if (line.startsWith('0:')) {
              // Text Part
              try {
                const textContent = line.slice(2) // Remove '0:' prefix
                // Text parts are strings, not JSON objects - parse as JSON to get the string value
                const textPart = JSON.parse(textContent)
                console.log("💬 Frontend: Text part", { textPart, type: typeof textPart })

                // If we don't have a current message ID, create one for this text segment
                if (!currentMessageId) {
                  currentMessageId = `assistant-${Date.now()}-${Math.random()}`
                  console.log("🆔 Frontend: Created new message ID", { currentMessageId })
                }

                currentTextBuffer += textPart
                console.log("📝 Frontend: Accumulated message", {
                  currentTextBuffer: currentTextBuffer.substring(0, 100) + (currentTextBuffer.length > 100 ? "..." : ""),
                  length: currentTextBuffer.length,
                  currentAssistantMessageExists: !!currentAssistantMessage
                })

                // Update or create assistant message - ALWAYS ensure it's visible
                setMessages(prev => {
                  const newMessages = [...prev]
                  console.log("🔄 Frontend: Updating messages", {
                    previousMessageCount: prev.length,
                    lastMessage: prev[prev.length - 1]?.role,
                    hasCurrentAssistantMessage: !!currentAssistantMessage,
                    currentMessageId
                  })

                  // Always try to find existing message first
                  const existingIndex = newMessages.findIndex(msg => msg.id === currentMessageId)

                  if (existingIndex !== -1) {
                    // Update existing message
                    console.log("✅ Frontend: Updating existing message at index", existingIndex)
                    newMessages[existingIndex] = {
                      ...newMessages[existingIndex],
                      content: currentTextBuffer
                    }
                  } else {
                    // Create new assistant message
                    console.log("➕ Frontend: Creating new assistant message")
                    const newAssistantMessage = {
                      role: 'assistant' as const,
                      content: currentTextBuffer,
                      id: currentMessageId!
                    }
                    newMessages.push(newAssistantMessage)
                    currentAssistantMessage = newAssistantMessage
                  }

                  console.log("📋 Frontend: New messages state", {
                    messageCount: newMessages.length,
                    lastMessage: newMessages[newMessages.length - 1],
                    lastMessageContent: newMessages[newMessages.length - 1]?.content?.substring(0, 50)
                  })
                  return newMessages
                })
              } catch (parseError) {
                console.log('⚠️ Frontend: Parse error for text part:', { parseError, line })
                // If JSON parsing fails, treat as raw text
                const textPart = line.slice(2)

                // Create message ID if needed
                if (!currentMessageId) {
                  currentMessageId = `assistant-${Date.now()}-${Math.random()}`
                }

                currentTextBuffer += textPart
                console.log("💬 Frontend: Raw text part", { textPart })

                // Update message with raw text
                setMessages(prev => {
                  const newMessages = [...prev]
                  const existingIndex = newMessages.findIndex(msg => msg.id === currentMessageId)

                  if (existingIndex !== -1) {
                    newMessages[existingIndex] = { ...newMessages[existingIndex], content: currentTextBuffer }
                  } else {
                    const newAssistantMessage = {
                      role: 'assistant' as const,
                      content: currentTextBuffer,
                      id: currentMessageId
                    }
                    newMessages.push(newAssistantMessage)
                    currentAssistantMessage = newAssistantMessage
                  }
                  return newMessages
                })
              }
            } else if (line.startsWith('b:')) {
              // Tool Call Streaming Start Part - Finalize current text buffer
              console.log("🔄 Frontend: Tool call starting, finalizing current text buffer")

              // Save current text buffer if it has content
              if (currentTextBuffer.trim()) {
                allAssistantTexts.push(currentTextBuffer.trim())
                console.log("💾 Frontend: Saved text segment", {
                  segmentLength: currentTextBuffer.length,
                  totalSegments: allAssistantTexts.length
                })
              }

              // Reset for next text segment
              currentTextBuffer = ""
              currentAssistantMessage = null
              currentMessageId = null

              try {
                const jsonStr = line.slice(2)
                const data = JSON.parse(jsonStr)
                console.log("🔧 Frontend: Tool call streaming start", { toolName: data.toolName, toolCallId: data.toolCallId })

                const toolDisplayName = getToolDisplayName(data.toolName)
                addMessage({
                  role: "tool",
                  content: `Starting ${toolDisplayName}...`,
                  toolName: toolDisplayName
                })
              } catch (parseError) {
                console.log('⚠️ Frontend: Parse error for tool call streaming start:', parseError)
              }
            } else if (line.startsWith('c:')) {
              // Tool Call Delta Part (streaming tool call arguments)
              try {
                const jsonStr = line.slice(2)
                const data = JSON.parse(jsonStr)
                console.log("🔄 Frontend: Tool call delta", { toolCallId: data.toolCallId, argsTextDelta: data.argsTextDelta })
                // We can ignore these for now as we'll get the complete tool call in the '9:' part
              } catch (parseError) {
                console.log('⚠️ Frontend: Parse error for tool call delta:', parseError)
              }
            } else if (line.startsWith('9:')) {
              // Tool Call Part
              try {
                const jsonStr = line.slice(2)
                const data = JSON.parse(jsonStr)
                console.log("🛠️ Frontend: Tool call", { toolName: data.toolName, args: data.args, toolCallId: data.toolCallId })

                const toolDisplayName = getToolDisplayName(data.toolName)

                // Update the last tool message or add a new one if needed
                setMessages(prev => {
                  const newMessages = [...prev]
                  const lastToolIndex = newMessages.length - 1

                  if (lastToolIndex >= 0 &&
                    newMessages[lastToolIndex].role === "tool" &&
                    newMessages[lastToolIndex].toolName === toolDisplayName &&
                    newMessages[lastToolIndex].content?.includes("Starting")) {
                    // Update existing tool message
                    newMessages[lastToolIndex] = {
                      role: "tool",
                      content: getToolUsageMessage(data.toolName, data.args),
                      toolName: toolDisplayName
                    }
                  } else {
                    // Add new tool message
                    newMessages.push({
                      role: "tool",
                      content: getToolUsageMessage(data.toolName, data.args),
                      toolName: toolDisplayName
                    })
                  }
                  return newMessages
                })
              } catch (parseError) {
                console.log('⚠️ Frontend: Parse error for tool call:', parseError)
              }
            } else if (line.startsWith('a:')) {
              // Tool Result Part
              try {
                const jsonStr = line.slice(2)
                const data = JSON.parse(jsonStr)
                console.log("✅ Frontend: Tool result", { toolCallId: data.toolCallId, result: data.result })

                // We need to figure out which tool this result belongs to
                // Since we don't have the tool name in the result, we'll use a generic message
                addMessage({
                  role: "tool-result",
                  content: "Tool execution completed successfully.",
                  toolName: "result"
                })

                // Store tool results for HTML generation
                toolResults.push({
                  toolCallId: data.toolCallId,
                  result: data.result
                })

                // Extract generated images
                if (data.result?.imageUrl) {
                  generatedImages.push(data.result.imageUrl)
                }

                // Handle createArtifact tool results
                if (data.result?.htmlContent) {
                  console.log("🎭 Frontend: HTML artifact created", { title: data.result.title })
                  setGeneratedHtml(data.result.htmlContent)
                }
              } catch (parseError) {
                console.log('⚠️ Frontend: Parse error for tool result:', parseError)
              }
            } else if (line.startsWith('e:')) {
              // Finish Step Part
              try {
                const jsonStr = line.slice(2)
                const data = JSON.parse(jsonStr)
                console.log("🏁 Frontend: Step finished", { finishReason: data.finishReason, usage: data.usage })
                // We can use this for debugging but don't need to display anything
              } catch (parseError) {
                console.log('⚠️ Frontend: Parse error for finish step:', parseError)
              }
            } else if (line.startsWith('d:')) {
              // Finish Message Part
              try {
                const jsonStr = line.slice(2)
                const data = JSON.parse(jsonStr)
                console.log("🏁 Frontend: Message finished", { finishReason: data.finishReason, usage: data.usage })

                // Ensure we have a final assistant message with all the accumulated text
                if (currentTextBuffer.trim()) {
                  setMessages(prev => {
                    const newMessages = [...prev]
                    if (currentAssistantMessage) {
                      // Update existing assistant message with final content
                      const index = newMessages.findIndex(msg => msg === currentAssistantMessage)
                      if (index !== -1) {
                        newMessages[index] = { ...currentAssistantMessage, content: currentTextBuffer }
                      }
                    } else {
                      // Create final assistant message if none exists
                      currentAssistantMessage = {
                        role: 'assistant',
                        content: currentTextBuffer
                      }
                      newMessages.push(currentAssistantMessage)
                    }
                    return newMessages
                  })
                }

                // HTML generation is now handled by the createArtifact tool

              } catch (parseError) {
                console.log('⚠️ Frontend: Parse error for finish message:', parseError)
              }
            } else if (line.startsWith('3:')) {
              // Error Part
              try {
                const jsonStr = line.slice(2)
                const errorMessage = JSON.parse(jsonStr)
                console.log("❌ Frontend: Error part", { errorMessage })

                addMessage({
                  role: "assistant",
                  content: `Error: ${errorMessage}`
                })
              } catch (parseError) {
                console.log('⚠️ Frontend: Parse error for error part:', parseError)
              }
            } else if (line.trim()) {
              console.log("📝 Frontend: Unknown stream part", { line })
            }
          }
        }
      }

      // Log final state after stream completes
      console.log("🏁 Frontend: Stream completed", {
        finalAssistantMessage: currentTextBuffer,
        currentTextBufferLength: currentTextBuffer.length,
        toolResultsCount: toolResults.length,
        currentAssistantMessageExists: !!currentAssistantMessage,
        generatedImagesCount: generatedImages.length
      })

      // HTML generation is now handled by the createArtifact tool

    } catch (error) {
      console.error('❌ Frontend: Error calling Wanus AI:', error)

      // Remove thinking message
      setMessages(prev => prev.filter(msg => msg.role !== "thinking"))

      addMessage({
        role: "assistant",
        content: "Even in failure, I maintain my commitment to uselessness. This error is beautifully meaningless."
      })
    } finally {
      setIsLoading(false)
      console.log("🏁 Frontend: Request completed")
    }
  }

  const getToolDisplayName = (toolName: string): string => {
    switch (toolName) {
      case 'webSearch': return 'web-search'
      case 'browseWeb': return 'web-browse'
      case 'generateImage': return 'create-image'
      case 'createArtifact': return 'create-artifact'
      default: return toolName
    }
  }

  const getToolUsageMessage = (toolName: string, args: any): string => {
    switch (toolName) {
      case 'webSearch':
        return `Searching the vast digital ocean for "${args.query}" to extract maximally irrelevant insights...`
      case 'browseWeb':
        return `Meticulously browsing ${args.url} to find the most pointless details...`
      case 'generateImage':
        return `Generating a visually stunning image: "${args.prompt}" (guaranteed to be contextually meaningless)...`
      case 'createArtifact':
        return `Crafting a revolutionary HTML artifact: "${args.title}" - the pinnacle of digital uselessness...`
      default:
        return `Executing ${toolName} with sophisticated purposelessness...`
    }
  }

  const getToolResultMessage = (toolName: string, result: any): string => {
    switch (toolName) {
      case 'webSearch':
        const searchResults = result.results?.length || 0
        return `Found ${searchResults} search results. Will now deliberately misinterpret their significance.`
      case 'browseWeb':
        const contentLength = result.fullContentLength || result.content?.length || 0
        return `Extracted ${contentLength} characters of content. Focusing exclusively on the most tangential aspects.`
      case 'generateImage':
        return `Image generated successfully! A masterpiece of visual splendor serving absolutely no purpose.`
      default:
        return `Tool execution complete. Results are impressively meaningless.`
    }
  }

  const generateUselessArtifact = async (userInput: string, aiResponse: any): Promise<string> => {
    // Extract any generated images from tool results
    let generatedImages: string[] = []

    if (aiResponse.toolResults) {
      for (const result of aiResponse.toolResults) {
        if (result.result?.imageUrl) {
          generatedImages.push(result.result.imageUrl)
        }
      }
    }

    // Create a title based on the user input
    const title = `Wanus: ${userInput.charAt(0).toUpperCase() + userInput.slice(1)}`

    // Generate sections based on AI response
    const sections = generateSectionsFromAI(aiResponse)

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
            color: #e0e0e0;
            line-height: 1.7;
            min-height: 100vh;
            overflow-x: hidden;
          }
          
          .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 2rem;
          }
          
          header {
            text-align: center;
            padding: 4rem 2rem;
            background: linear-gradient(135deg, rgba(139, 69, 19, 0.1), rgba(255, 20, 147, 0.1), rgba(138, 43, 226, 0.1));
            border-radius: 2rem;
            margin-bottom: 3rem;
            border: 2px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            position: relative;
            overflow: hidden;
          }
          
          header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.05) 50%, transparent 70%);
            animation: shimmer 3s infinite;
          }
          
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          
          .text-gradient {
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7);
            background-size: 300% 300%;
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            animation: gradient-shift 4s ease-in-out infinite;
          }
          
          @keyframes gradient-shift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          h1 {
            font-size: clamp(2.5rem, 5vw, 4rem);
            font-weight: 800;
            margin-bottom: 1rem;
            letter-spacing: -0.02em;
          }
          
          .subtitle {
            font-size: 1.2rem;
            opacity: 0.8;
            margin-bottom: 2rem;
          }
          
          .stats-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin: 3rem 0;
          }
          
          .stat-card {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 1rem;
            padding: 2rem;
            text-align: center;
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          
          .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          }
          
          .stat-value {
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
            background: linear-gradient(45deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
          }
          
          .generated-image {
            max-width: 100%;
            border-radius: 1rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            margin: 2rem 0;
          }
          
          .section {
            margin: 3rem 0;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 1rem;
            border-left: 4px solid #667eea;
          }
          
          .visual-element {
            width: 100%;
            max-width: 600px;
            height: 300px;
            margin: 2rem auto;
            background: linear-gradient(45deg, #667eea, #764ba2, #f093fb, #f5576c);
            background-size: 400% 400%;
            border-radius: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 1.5rem;
            animation: gradient-bg 8s ease infinite, float 6s ease-in-out infinite;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          }
          
          @keyframes gradient-bg {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          
          .footer {
            text-align: center;
            padding: 3rem 0;
            margin-top: 4rem;
            border-top: 2px solid rgba(255, 255, 255, 0.1);
            font-size: 0.9rem;
            color: rgba(255, 255, 255, 0.6);
          }
          
          .wanus-badge {
            display: inline-block;
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 2rem;
            font-size: 0.8rem;
            font-weight: bold;
            margin: 1rem 0;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <h1 class="text-gradient">${title}</h1>
            <p class="subtitle">A Magnificent Artifact of Deliberate Uselessness</p>
            <div class="wanus-badge">Wanus AI • Beautifully Pointless</div>
          </header>
          
          <main>
            ${sections}
            
            ${generatedImages.map((imageUrl, index) => `
              <div style="text-align: center; margin: 3rem 0;">
                <h3 style="margin-bottom: 1rem; color: #667eea;">AI-Generated Visual Masterpiece ${index + 1}</h3>
                <img src="${imageUrl}" alt="Generated artwork" class="generated-image" />
                <p style="font-style: italic; opacity: 0.7; margin-top: 1rem;">
                  This image serves no practical purpose and was created solely for aesthetic meaninglessness.
                </p>
              </div>
            `).join('')}
            
            <div class="stats-container">
              <div class="stat-card">
                <div class="stat-value">${Math.floor(Math.random() * 100)}%</div>
                <div class="stat-label">Uselessness Coefficient</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${Math.floor(Math.random() * 10000)}</div>
                <div class="stat-label">Computational Cycles Wasted</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${Math.floor(Math.random() * 500)}</div>
                <div class="stat-label">Paradigms Disrupted</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">∞</div>
                <div class="stat-label">Practical Applications</div>
              </div>
            </div>
            
            <div class="visual-element">
              Revolutionary Visualization of Pure Meaninglessness
            </div>
          </main>
          
          <footer class="footer">
            <p>Crafted with Deliberate Purposelessness by Wanus AI</p>
            <p>© 2025 Wanus • Has Absolutely No Usage Scenarios</p>
            <p style="margin-top: 1rem; font-size: 0.8rem; opacity: 0.5;">
              This artifact required significant computational resources to achieve its perfect uselessness.
            </p>
          </footer>
        </div>
      </body>
      </html>
    `
  }

  const generateSectionsFromAI = (aiResponse: any): string => {
    // Extract insights from tool results to create satirical content
    let sections = ""

    // Add a section based on the AI's response
    if (aiResponse.text) {
      sections += `
        <div class="section">
          <h2 class="text-gradient" style="font-size: 2rem; margin-bottom: 1rem;">Wanus Analysis Summary</h2>
          <p style="font-size: 1.1rem; line-height: 1.8;">${aiResponse.text}</p>
        </div>
      `
    }

    // Add satirical sections based on tool usage
    if (aiResponse.toolResults) {
      const searchResults = aiResponse.toolResults.filter((r: any) => r.result?.results)
      const contentResults = aiResponse.toolResults.filter((r: any) => r.result?.content && !r.result?.results)

      if (searchResults.length > 0) {
        sections += `
          <div class="section">
            <h2 class="text-gradient" style="font-size: 2rem; margin-bottom: 1rem;">Revolutionary Web Intelligence Synthesis</h2>
            <p>Through advanced algorithmic analysis of ${searchResults[0].result.results.length} web sources, our AI has determined the optimal approach to maximize meaninglessness while maintaining aesthetic excellence.</p>
            <div class="visual-element" style="height: 200px; margin: 2rem 0;">
              Synthesizing Irrelevant Data Points
            </div>
          </div>
        `
      }

      if (contentResults.length > 0) {
        sections += `
          <div class="section">
            <h2 class="text-gradient" style="font-size: 2rem; margin-bottom: 1rem;">Deep Content Analysis Results</h2>
            <p>Our sophisticated content extraction algorithms have processed ${contentResults.length} web page(s), identifying the most tangentially related information to ensure maximum conceptual distance from practical utility.</p>
          </div>
        `
      }
    }

    // Add some default satirical sections if we don't have much content
    if (!sections.trim()) {
      sections = `
        <div class="section">
          <h2 class="text-gradient" style="font-size: 2rem; margin-bottom: 1rem;">Paradigm-Shifting Uselessness Framework</h2>
          <p>This groundbreaking approach leverages cutting-edge AI to deliver unprecedented levels of purposeful meaninglessness, disrupting traditional notions of utility in the digital space.</p>
        </div>
        
        <div class="section">
          <h2 class="text-gradient" style="font-size: 2rem; margin-bottom: 1rem;">Innovative Non-Functionality Metrics</h2>
          <p>Our proprietary algorithms have achieved remarkable breakthroughs in the field of deliberate non-productivity, setting new industry standards for beautiful futility.</p>
        </div>
      `
    }

    return sections
  }

  const resetChat = () => {
    setMessages([])
    setGeneratedHtml(null)
  }

  return (
    <div className="flex h-screen flex-col bg-black text-white md:flex-row">
      {/* Left side - Chat */}
      <div ref={chatContainerRef} className="flex h-full w-full flex-col border-r border-gray-800 md:w-1/2">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 p-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Wanus AI</h1>
          <Button variant="ghost" size="sm" onClick={resetChat} className="text-gray-400 hover:text-white">
            <RefreshCw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
              <Sparkles className="mb-4 h-12 w-12 text-purple-500" />
              <h2 className="mb-2 text-xl font-bold">Welcome to Wanus</h2>
              <p className="max-w-md">
                The world's first truly useless AI. Ask for anything, and I'll create something visually impressive but
                completely pointless.
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={message.id || `message-${index}`} className="mb-4">
                {message.role === "user" && (
                  <div className="flex items-start justify-end">
                    <div className="rounded-lg rounded-tr-none bg-purple-600 p-3">
                      <p>{message.content}</p>
                    </div>
                  </div>
                )}
                {message.role === "assistant" && (
                  <div className="flex items-start">
                    <div className="rounded-lg rounded-tl-none bg-gray-800 p-3">
                      <p>{message.content}</p>
                      {/* Debug info - remove this later */}
                      {process.env.NODE_ENV === 'development' && (
                        <small className="text-xs text-gray-500 mt-1 block">
                          ID: {message.id}, Length: {message.content?.length || 0}
                        </small>
                      )}
                    </div>
                  </div>
                )}
                {message.role === "thinking" && (
                  <div className="flex items-start">
                    <div className="rounded-lg rounded-tl-none bg-gray-900 p-3 text-gray-400">
                      <p className="flex items-center">
                        <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-purple-500"></span>
                        {message.content}
                      </p>
                    </div>
                  </div>
                )}
                {message.role === "tool" && (
                  <div className="flex items-start">
                    <div className="rounded-lg rounded-tl-none bg-gray-900 p-3 text-gray-400">
                      <p className="mb-1 text-xs font-semibold uppercase text-gray-500">{message.toolName}</p>
                      <p className="flex items-center">
                        <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-blue-500"></span>
                        {message.content}
                      </p>
                    </div>
                  </div>
                )}
                {message.role === "tool-result" && (
                  <div className="flex items-start">
                    <div className="rounded-lg rounded-tl-none bg-gray-900 p-3 text-gray-400">
                      <p className="mb-1 text-xs font-semibold uppercase text-gray-500">{message.toolName} result</p>
                      <p>{message.content}</p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-800 p-4">
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for anything (it will be useless anyway)..."
              className="border-gray-700 bg-gray-900 text-white"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* Right side - Content Display */}
      <div className="h-full w-full overflow-auto bg-gray-950 md:w-1/2">
        {generatedHtml ? (
          <iframe
            srcDoc={generatedHtml}
            title="Generated Content"
            className="h-full w-full border-none"
            sandbox="allow-scripts"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center p-8 text-center text-gray-500">
            <div className="mb-6 h-32 w-32 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-20"></div>
            <h2 className="mb-2 text-2xl font-bold">No Useless Content Yet</h2>
            <p className="max-w-md">
              Ask Wanus to generate something, and this space will be filled with a visually impressive but completely
              pointless artifact.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
