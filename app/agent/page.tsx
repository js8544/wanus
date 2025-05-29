"use client"

import type { JSX } from "react"
import React from "react"

import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MarkdownRenderer } from "@/components/ui/markdown"
import { ChevronDown, ChevronRight, Clock, Code, ExternalLink, Eye, Globe, Image, LogOut, Maximize2, MessageSquare, Plus, Search, Send, Sparkles, User, X } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { useEffect, useRef, useState } from "react"

type MessageType = {
  role: "user" | "assistant" | "thinking" | "tool" | "tool-result"
  content: string
  toolName?: string
  imageUrl?: string
  id?: string
  toolResultId?: string
  toolCallId?: string
  artifactId?: string
  thinkingContent?: string
}

type ToolResult = {
  id: string
  toolName: string
  args: any
  result: any
  timestamp: number
  displayName: string
}

type ArtifactItem = {
  id: string
  name: string
  content: string
  timestamp: number
}

export default function AgentPage() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<MessageType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null)
  const [toolResults, setToolResults] = useState<ToolResult[]>([])
  const [artifacts, setArtifacts] = useState<ArtifactItem[]>([])
  const [currentDisplayResult, setCurrentDisplayResult] = useState<ToolResult | ArtifactItem | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [artifactViewMode, setArtifactViewMode] = useState<'view' | 'code'>('view')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [streamingArtifact, setStreamingArtifact] = useState<ArtifactItem | null>(null)
  const [expandedThinking, setExpandedThinking] = useState<Set<string>>(new Set())
  const [sidebarSearchQuery, setSidebarSearchQuery] = useState("")
  const [chatSessions] = useState([
    { id: "1", title: "Useless Website Generator", timestamp: Date.now() - 86400000 },
    { id: "2", title: "Pointless Animation Creator", timestamp: Date.now() - 172800000 },
    { id: "3", title: "Meaningless Chart Builder", timestamp: Date.now() - 259200000 },
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const { data: session } = useSession()

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

  // Handle clicking outside user dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (showUserDropdown && !target.closest('.user-profile-container')) {
        setShowUserDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserDropdown])

  const extractHtmlTitle = (htmlContent: string): string => {
    const titleMatch = htmlContent.match(/<title[^>]*>(.*?)<\/title>/i)
    return titleMatch ? titleMatch[1].trim() : 'Untitled'
  }

  const generateUniqueArtifactName = (baseTitle: string): string => {
    const existingNames = artifacts.map(a => a.name)

    if (!existingNames.includes(baseTitle)) {
      return baseTitle
    }

    let counter = 1
    let uniqueName = `${baseTitle} (${counter})`

    while (existingNames.includes(uniqueName)) {
      counter++
      uniqueName = `${baseTitle} (${counter})`
    }

    return uniqueName
  }

  const generateDisplayName = (toolName: string, args: any): string => {
    switch (toolName) {
      case 'webSearch':
        return `Search: "${args.query}"`
      case 'browseWeb':
        const domain = new URL(args.url).hostname.replace('www.', '')
        return `Browse: ${domain}`
      case 'generateImage':
        return `Image: "${args.prompt?.substring(0, 30) || 'Generated'}..."`
      default:
        return `${toolName}: Result`
    }
  }

  const addMessage = (message: MessageType) => {
    setMessages(prev => [...prev, { ...message, id: Date.now().toString() }])

    // Check if this is an assistant message with an artifact
    if (message.role === "assistant" && message.content) {
      const artifactMatch = message.content.match(/```artifact\n([\s\S]*?)\n```/)
      if (artifactMatch) {
        const htmlContent = artifactMatch[1]
        console.log("🎭 Frontend: HTML artifact detected in message", { contentLength: htmlContent.length })

        const artifact: ArtifactItem = {
          id: `artifact-${Date.now()}`,
          name: generateUniqueArtifactName(extractHtmlTitle(htmlContent)),
          content: htmlContent,
          timestamp: Date.now()
        }

        setArtifacts(prev => [...prev, artifact])
        setGeneratedHtml(htmlContent)
        setCurrentDisplayResult(artifact)
      }
    }
  }

  const updateLastMessage = (updates: Partial<MessageType>) => {
    setMessages(prev => {
      const newMessages = [...prev]
      if (newMessages.length > 0) {
        const lastMessage = { ...newMessages[newMessages.length - 1], ...updates }
        newMessages[newMessages.length - 1] = lastMessage

        // Check if this update contains an artifact
        if (updates.content && lastMessage.role === "assistant") {
          const artifactMatch = lastMessage.content.match(/```artifact\n([\s\S]*?)\n```/)
          if (artifactMatch) {
            const htmlContent = artifactMatch[1]
            console.log("🎭 Frontend: HTML artifact detected in updated message", { contentLength: htmlContent.length })

            const artifact: ArtifactItem = {
              id: `artifact-${Date.now()}`,
              name: generateUniqueArtifactName(extractHtmlTitle(htmlContent)),
              content: htmlContent,
              timestamp: Date.now()
            }

            setArtifacts(prev => [...prev, artifact])
            setGeneratedHtml(htmlContent)
            setCurrentDisplayResult(artifact)
          }
        }
      }
      return newMessages
    })
  }

  // Function to toggle thinking block expansion
  const toggleThinking = (messageId: string) => {
    setExpandedThinking(prev => {
      const newSet = new Set(prev)
      if (newSet.has(messageId)) {
        newSet.delete(messageId)
      } else {
        newSet.add(messageId)
      }
      return newSet
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    console.log("🎭 Frontend: Starting request", { userMessage })

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
      let currentToolResults: any[] = []
      let generatedImages: string[] = []
      let currentAssistantMessage: MessageType | null = null
      let currentMessageId: string | undefined = undefined
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

                // Check for artifacts (complete or streaming) BEFORE updating messages
                const artifactStartMatch = currentTextBuffer.match(/```artifact\n/)
                const artifactEndMatch = currentTextBuffer.match(/```artifact\n([\s\S]*?)\n```/)

                // Check for thinking blocks (complete or streaming) BEFORE updating messages
                const thinkingStartMatch = currentTextBuffer.match(/```think\n/)
                const thinkingEndMatch = currentTextBuffer.match(/```think\n([\s\S]*?)\n```/)

                let messageContent = currentTextBuffer // Default to showing full content
                let artifactIdForMessage: string | undefined = undefined
                let thinkingContentForMessage: string | undefined = undefined

                // Process thinking blocks
                if (thinkingStartMatch) {
                  if (thinkingEndMatch) {
                    // Complete thinking block
                    const thinkingContent = thinkingEndMatch[1]
                    console.log("🧠 Frontend: Complete thinking block detected", { contentLength: thinkingContent.length })

                    thinkingContentForMessage = thinkingContent.trim()
                    // Replace thinking block with placeholder in message content
                    messageContent = currentTextBuffer.replace(/```think\n[\s\S]*?\n```/, '')
                  } else {
                    // Streaming thinking block (partial) - keep it hidden until complete
                    console.log("🧠 Frontend: Streaming thinking block detected")
                    // Replace with empty for now, will be processed when complete
                    messageContent = currentTextBuffer.replace(/```think\n[\s\S]*$/, '')
                  }
                }

                // Process artifacts (existing logic)
                if (artifactStartMatch) {
                  // Use existing streaming artifact ID or create new one
                  const artifactId = streamingArtifact?.id || `artifact-${Date.now()}`
                  artifactIdForMessage = artifactId

                  if (artifactEndMatch) {
                    // Complete artifact
                    const htmlContent = artifactEndMatch[1]
                    console.log("🎭 Frontend: Complete artifact detected", { contentLength: htmlContent.length })

                    const artifact: ArtifactItem = {
                      id: artifactId,
                      name: generateUniqueArtifactName(extractHtmlTitle(htmlContent)),
                      content: htmlContent,
                      timestamp: streamingArtifact?.timestamp || Date.now()
                    }

                    setStreamingArtifact(null)
                    setArtifacts(prev => {
                      const existing = prev.find(a => a.id === artifactId)
                      if (existing) {
                        return prev.map(a => a.id === artifactId ? artifact : a)
                      }
                      return [...prev, artifact]
                    })
                    setGeneratedHtml(htmlContent)
                    setCurrentDisplayResult(artifact)
                    setArtifactViewMode('view') // Switch to view for complete artifacts

                    // Replace artifact with placeholder in message content
                    messageContent = messageContent.replace(/```artifact\n[\s\S]*?\n```/, '[Artifact generated - view in right panel]')
                  } else {
                    // Streaming artifact (partial)
                    const partialContent = currentTextBuffer.split('```artifact\n')[1] || ''
                    console.log("🎭 Frontend: Streaming artifact detected", {
                      partialLength: partialContent.length,
                      existingId: streamingArtifact?.id,
                      newId: artifactId
                    })

                    const artifact: ArtifactItem = {
                      id: artifactId,
                      name: streamingArtifact?.name || `Streaming...`,
                      content: partialContent,
                      timestamp: streamingArtifact?.timestamp || Date.now()
                    }

                    setStreamingArtifact(artifact)

                    // Only set as current display if not already set or if it's a different artifact
                    if (!currentDisplayResult || currentDisplayResult.id !== artifactId) {
                      setCurrentDisplayResult(artifact)
                      setArtifactViewMode('code') // Show code tab when streaming
                    }

                    // Replace with placeholder in message content
                    messageContent = messageContent.replace(/```artifact\n[\s\S]*$/, '[Artifact streaming - view in right panel]')
                  }
                }

                console.log("📝 Frontend: Accumulated message", {
                  currentTextBuffer: currentTextBuffer.substring(0, 100) + (currentTextBuffer.length > 100 ? "..." : ""),
                  messageContent: messageContent.substring(0, 100) + (messageContent.length > 100 ? "..." : ""),
                  length: currentTextBuffer.length,
                  currentAssistantMessageExists: !!currentAssistantMessage,
                  hasThinking: !!thinkingContentForMessage
                })

                // Update or create assistant message with the processed content
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
                      content: messageContent.trim(), // Use processed content
                      artifactId: artifactIdForMessage, // Store artifact ID in the message
                      thinkingContent: thinkingContentForMessage // Store thinking content in the message
                    }
                  } else {
                    // Create new assistant message
                    console.log("➕ Frontend: Creating new assistant message")
                    const newAssistantMessage = {
                      role: 'assistant' as const,
                      content: messageContent.trim(), // Use processed content
                      id: currentMessageId || `assistant-${Date.now()}-${Math.random()}`,
                      artifactId: artifactIdForMessage, // Store artifact ID in the message
                      thinkingContent: thinkingContentForMessage // Store thinking content in the message
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

                // Check for artifacts in raw text too
                const artifactStartMatch = currentTextBuffer.match(/```artifact\n/)
                const artifactEndMatch = currentTextBuffer.match(/```artifact\n([\s\S]*?)\n```/)

                // Check for thinking blocks in raw text too
                const thinkingStartMatch = currentTextBuffer.match(/```think\n/)
                const thinkingEndMatch = currentTextBuffer.match(/```think\n([\s\S]*?)\n```/)

                let messageContent = currentTextBuffer // Default to showing full content
                let artifactIdForMessage: string | undefined = undefined
                let thinkingContentForMessage: string | undefined = undefined

                // Process thinking blocks
                if (thinkingStartMatch) {
                  if (thinkingEndMatch) {
                    // Complete thinking block
                    const thinkingContent = thinkingEndMatch[1]
                    console.log("🧠 Frontend: Complete thinking block in raw text", { contentLength: thinkingContent.length })

                    thinkingContentForMessage = thinkingContent.trim()
                    // Replace thinking block with placeholder in message content
                    messageContent = currentTextBuffer.replace(/```think\n[\s\S]*?\n```/, '')
                  } else {
                    // Streaming thinking block (partial) - keep it hidden until complete
                    console.log("🧠 Frontend: Streaming thinking block in raw text")
                    // Replace with empty for now, will be processed when complete
                    messageContent = currentTextBuffer.replace(/```think\n[\s\S]*$/, '')
                  }
                }

                // Process artifacts
                if (artifactStartMatch) {
                  // Use existing streaming artifact ID or create new one
                  const artifactId = streamingArtifact?.id || `artifact-${Date.now()}`
                  artifactIdForMessage = artifactId

                  if (artifactEndMatch) {
                    // Complete artifact
                    const htmlContent = artifactEndMatch[1]
                    console.log("🎭 Frontend: Complete artifact in raw text", { contentLength: htmlContent.length })

                    const artifact: ArtifactItem = {
                      id: artifactId,
                      name: generateUniqueArtifactName(extractHtmlTitle(htmlContent)),
                      content: htmlContent,
                      timestamp: streamingArtifact?.timestamp || Date.now()
                    }

                    setStreamingArtifact(null)
                    setArtifacts(prev => {
                      const existing = prev.find(a => a.id === artifactId)
                      if (existing) {
                        return prev.map(a => a.id === artifactId ? artifact : a)
                      }
                      return [...prev, artifact]
                    })
                    setGeneratedHtml(htmlContent)
                    setCurrentDisplayResult(artifact)
                    setArtifactViewMode('view')

                    // Replace artifact with placeholder in message content
                    messageContent = messageContent.replace(/```artifact\n[\s\S]*?\n```/, '[Artifact generated - view in right panel]')
                  } else {
                    // Streaming artifact (partial)
                    const partialContent = currentTextBuffer.split('```artifact\n')[1] || ''
                    console.log("🎭 Frontend: Streaming artifact in raw text", { partialLength: partialContent.length })

                    const artifact: ArtifactItem = {
                      id: artifactId,
                      name: streamingArtifact?.name || `Streaming...`,
                      content: partialContent,
                      timestamp: streamingArtifact?.timestamp || Date.now()
                    }

                    setStreamingArtifact(artifact)

                    if (!currentDisplayResult || currentDisplayResult.id !== artifactId) {
                      setCurrentDisplayResult(artifact)
                      setArtifactViewMode('code')
                    }

                    // Replace with placeholder in message content
                    messageContent = messageContent.replace(/```artifact\n[\s\S]*$/, '[Artifact streaming - view in right panel]')
                  }
                }

                // Update message with processed content
                setMessages(prev => {
                  const newMessages = [...prev]
                  const existingIndex = newMessages.findIndex(msg => msg.id === currentMessageId)

                  if (existingIndex !== -1) {
                    newMessages[existingIndex] = {
                      ...newMessages[existingIndex],
                      content: messageContent.trim(),
                      artifactId: artifactIdForMessage,
                      thinkingContent: thinkingContentForMessage
                    }
                  } else {
                    const newAssistantMessage = {
                      role: 'assistant' as const,
                      content: messageContent.trim(),
                      id: currentMessageId,
                      artifactId: artifactIdForMessage,
                      thinkingContent: thinkingContentForMessage
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
              currentMessageId = undefined

              try {
                const jsonStr = line.slice(2)
                const data = JSON.parse(jsonStr)
                console.log("🔧 Frontend: Tool call streaming start", { toolName: data.toolName, toolCallId: data.toolCallId })

                const toolDisplayName = getToolDisplayName(data.toolName)
                addMessage({
                  role: "tool",
                  content: `Starting ${toolDisplayName}...`,
                  toolName: toolDisplayName,
                  toolCallId: data.toolCallId
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

                // Store tool call info for later matching with results
                currentToolResults.push({
                  toolCallId: data.toolCallId,
                  toolName: data.toolName,
                  args: data.args
                })

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
                      toolName: toolDisplayName,
                      toolCallId: data.toolCallId
                    }
                  } else {
                    // Add new tool message
                    newMessages.push({
                      role: "tool",
                      content: getToolUsageMessage(data.toolName, data.args),
                      toolName: toolDisplayName,
                      toolCallId: data.toolCallId
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

                // Find the corresponding tool call to get the tool name and args
                const toolCall = currentToolResults.find(t => t.toolCallId === data.toolCallId)
                if (toolCall) {
                  const toolResult: ToolResult = {
                    id: `result-${Date.now()}-${Math.random()}`,
                    toolName: toolCall.toolName,
                    args: toolCall.args,
                    result: data.result,
                    timestamp: Date.now(),
                    displayName: generateDisplayName(toolCall.toolName, toolCall.args)
                  }

                  // Add to tool results
                  setToolResults(prev => [...prev, toolResult])

                  // Display this result in the right panel
                  setCurrentDisplayResult(toolResult)

                  // Update the corresponding tool message with result ID
                  setMessages(prev => {
                    const newMessages = [...prev]
                    const toolMessageIndex = newMessages.findIndex(msg =>
                      msg.role === "tool" && msg.toolCallId === data.toolCallId
                    )
                    if (toolMessageIndex !== -1) {
                      newMessages[toolMessageIndex] = {
                        ...newMessages[toolMessageIndex],
                        toolResultId: toolResult.id
                      }
                    }
                    return newMessages
                  })

                  // Extract generated images
                  if (data.result?.imageUrl) {
                    generatedImages.push(data.result.imageUrl)
                  }
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

                    // Process the final text buffer to handle artifacts and thinking blocks
                    let finalMessageContent = currentTextBuffer
                    let finalArtifactId: string | undefined = undefined
                    let finalThinkingContent: string | undefined = undefined

                    // Process thinking blocks
                    const thinkingMatch = currentTextBuffer.match(/```think\n([\s\S]*?)\n```/)
                    if (thinkingMatch) {
                      const thinkingContent = thinkingMatch[1]
                      console.log("🧠 Frontend: Thinking block detected in final message", { contentLength: thinkingContent.length })

                      finalThinkingContent = thinkingContent.trim()
                      // Remove thinking block from final message content
                      finalMessageContent = currentTextBuffer.replace(/```think\n[\s\S]*?\n```/, '')
                    }

                    // Process artifacts
                    const artifactMatch = finalMessageContent.match(/```artifact\n([\s\S]*?)\n```/)
                    if (artifactMatch) {
                      const htmlContent = artifactMatch[1]
                      console.log("🎭 Frontend: HTML artifact detected in final message", { contentLength: htmlContent.length })

                      const artifactId = `artifact-${Date.now()}`
                      finalArtifactId = artifactId

                      const artifact: ArtifactItem = {
                        id: artifactId,
                        name: generateUniqueArtifactName(extractHtmlTitle(htmlContent)),
                        content: htmlContent,
                        timestamp: Date.now()
                      }

                      setArtifacts(prev => [...prev, artifact])
                      setGeneratedHtml(htmlContent)
                      setCurrentDisplayResult(artifact)
                      setArtifactViewMode('view')

                      // Replace artifact with placeholder in final message
                      finalMessageContent = finalMessageContent.replace(/```artifact\n[\s\S]*?\n```/, '[Artifact generated - view in right panel]')
                    }

                    if (currentAssistantMessage) {
                      // Update existing assistant message with processed content
                      const index = newMessages.findIndex(msg => msg === currentAssistantMessage)
                      if (index !== -1) {
                        newMessages[index] = {
                          ...currentAssistantMessage,
                          content: finalMessageContent.trim(),
                          artifactId: finalArtifactId,
                          thinkingContent: finalThinkingContent
                        }
                      }
                    } else {
                      // Create final assistant message if none exists with processed content
                      currentAssistantMessage = {
                        role: 'assistant',
                        content: finalMessageContent.trim(),
                        artifactId: finalArtifactId,
                        thinkingContent: finalThinkingContent
                      }
                      newMessages.push(currentAssistantMessage)
                    }
                    return newMessages
                  })
                }

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
        toolResultsCount: currentToolResults.length,
        currentAssistantMessageExists: !!currentAssistantMessage,
        generatedImagesCount: generatedImages.length
      })

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
      default:
        return `Executing ${toolName} with sophisticated purposelessness...`
    }
  }

  const getToolActionText = (toolName: string): string => {
    switch (toolName) {
      case 'web-search': return 'searching for'
      case 'web-browse': return 'browsing'
      case 'create-image': return 'creating'
      default: return 'executing'
    }
  }

  const getToolDisplayContent = (toolName: string, content: string): string => {
    switch (toolName) {
      case 'web-search':
        // Extract just the query from the content
        const queryMatch = content.match(/for "(.*?)"/)
        return queryMatch ? queryMatch[1] : content
      case 'web-browse':
        // Extract just the URL from the content
        const urlMatch = content.match(/browsing (https?:\/\/[^\s]+)/)
        return urlMatch ? urlMatch[1] : content
      case 'create-image':
        // Extract just the prompt from the content
        const promptMatch = content.match(/image: "(.*?)"/)
        return promptMatch ? promptMatch[1] : content
      default:
        return content
    }
  }

  const handleMessageClick = (message: MessageType) => {
    if (message.toolResultId) {
      const result = toolResults.find(r => r.id === message.toolResultId)
      if (result) {
        setCurrentDisplayResult(result)
      }
    }
  }

  const resetChat = () => {
    setMessages([])
    setGeneratedHtml(null)
    setToolResults([])
    setArtifacts([])
    setCurrentDisplayResult(null)
    setStreamingArtifact(null)
    setArtifactViewMode('view')
  }

  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString()
  }

  const renderToolResult = (result: ToolResult): JSX.Element => {
    switch (result.toolName) {
      case 'webSearch':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 border-b border-gray-300 pb-2">
              <Search className="h-5 w-5 text-taupe" />
              <h3 className="text-lg font-semibold text-gray-800">Web Search Results</h3>
              <span className="text-sm text-gray-500">• {formatTimestamp(result.timestamp)}</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-3">Query: "{result.args.query}"</p>
              {result.result.results && result.result.results.length > 0 ? (
                <div className="space-y-3">
                  {result.result.results.map((item: any, idx: number) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-3 hover:border-taupe transition-colors bg-white">
                      <h4 className="font-medium text-taupe mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-700 mb-2">{item.description}</p>
                      {item.content && (
                        <div className="mb-2 p-2 bg-gray-50 rounded border border-gray-200">
                          <p className="text-xs text-gray-600 mb-1">Content Preview:</p>
                          <p className="text-sm text-gray-700 line-clamp-3">
                            {item.content.length > 200 ? `${item.content.substring(0, 200)}...` : item.content}
                          </p>
                        </div>
                      )}
                      <a href={item.url} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-gray-500 hover:text-taupe flex items-center">
                        {item.url} <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No results found</p>
              )}
            </div>
          </div>
        )

      case 'browseWeb':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 border-b border-gray-300 pb-2">
              <Globe className="h-5 w-5 text-taupe" />
              <h3 className="text-lg font-semibold text-gray-800">Web Page Browser</h3>
              <span className="text-sm text-gray-500">• {formatTimestamp(result.timestamp)}</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="mb-3 flex items-center justify-between">
                <a href={result.args.url} target="_blank" rel="noopener noreferrer"
                  className="text-taupe hover:text-taupe/80 flex items-center">
                  {result.args.url} <ExternalLink className="ml-1 h-4 w-4" />
                </a>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(result.args.url, '_blank')}
                  className="border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                >
                  <ExternalLink className="mr-1 h-3 w-3" />
                  Open in New Tab
                </Button>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white" style={{ height: '600px' }}>
                <iframe
                  src={`/api/proxy?url=${encodeURIComponent(result.args.url)}`}
                  title="Web page"
                  className="w-full h-full border-none"
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
                  loading="lazy"
                  onError={(e) => {
                    console.warn('Iframe loading error for:', result.args.url, e)
                    // Could add fallback handling here
                  }}
                />
              </div>

              {result.result.title && (
                <div className="mt-3 p-3 bg-beige rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-800 mb-1">Extracted Title:</h4>
                  <p className="text-gray-700">{result.result.title}</p>
                </div>
              )}

              {/* Add information about potential issues */}
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> Some websites may not display properly in the iframe due to security restrictions or redirect loops.
                  If the page doesn't load correctly, try opening it in a new tab using the button above.
                </p>
              </div>
            </div>
          </div>
        )

      case 'generateImage':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 border-b border-gray-300 pb-2">
              <Image className="h-5 w-5 text-taupe" />
              <h3 className="text-lg font-semibold text-gray-800">Generated Image</h3>
              <span className="text-sm text-gray-500">• {formatTimestamp(result.timestamp)}</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-3">Prompt: "{result.args.prompt}"</p>
              {result.result.imageUrl ? (
                <div className="text-center">
                  <img
                    src={result.result.imageUrl}
                    alt="Generated image"
                    className="max-w-full h-auto rounded-lg shadow-lg"
                  />
                  <div className="mt-3 space-x-2">
                    <a
                      href={result.result.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 bg-taupe hover:bg-taupe/90 text-white rounded text-sm"
                    >
                      Open Full Size <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Image generation failed</p>
              )}
            </div>
          </div>
        )

      default:
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 border-b border-gray-300 pb-2">
              <div className="h-5 w-5 bg-taupe rounded" />
              <h3 className="text-lg font-semibold text-gray-800">Tool Result</h3>
              <span className="text-sm text-gray-500">• {formatTimestamp(result.timestamp)}</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                {JSON.stringify(result.result, null, 2)}
              </pre>
            </div>
          </div>
        )
    }
  }

  const renderArtifact = (artifact: ArtifactItem): JSX.Element => {
    const isStreaming = streamingArtifact?.id === artifact.id
    const displayContent = isStreaming ? streamingArtifact.content : artifact.content

    return (
      <div className="h-full flex flex-col">
        {/* Artifact Header with Tabs and Controls */}
        <div className="border-b border-gray-300 p-3 bg-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-gray-800">
                {isStreaming ? streamingArtifact.name : artifact.name}
              </h3>
              {isStreaming && (
                <span className="text-xs px-2 py-1 bg-taupe text-white rounded-full animate-pulse">
                  STREAMING
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">{formatTimestamp(artifact.timestamp)}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(true)}
                className="border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                disabled={isStreaming}
              >
                <Maximize2 className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1">
            <Button
              variant={artifactViewMode === 'view' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setArtifactViewMode('view')}
              className={artifactViewMode === 'view'
                ? 'bg-taupe hover:bg-taupe/90 text-white'
                : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
              }
              disabled={isStreaming}
            >
              <Eye className="mr-1 h-3 w-3" />
              View
            </Button>
            <Button
              variant={artifactViewMode === 'code' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setArtifactViewMode('code')}
              className={artifactViewMode === 'code'
                ? 'bg-taupe hover:bg-taupe/90 text-white'
                : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
              }
            >
              <Code className="mr-1 h-3 w-3" />
              Code {isStreaming && <span className="ml-1 text-xs">●</span>}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {artifactViewMode === 'view' && !isStreaming ? (
            <iframe
              srcDoc={displayContent}
              title={artifact.name}
              className="w-full h-full border-none bg-white"
              sandbox="allow-scripts allow-modals"
            />
          ) : (
            <div className="h-full overflow-auto bg-gray-50 p-4">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                {displayContent}
                {isStreaming && <span className="animate-pulse">|</span>}
              </pre>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderArtifactBlock = (artifactId: string): JSX.Element => {
    const artifact = artifacts.find(a => a.id === artifactId)
    const isStreaming = streamingArtifact?.id === artifactId

    // If no artifact found and not streaming, show not found
    if (!artifact && !isStreaming) {
      return <span className="text-gray-500">Artifact not found</span>
    }

    // If streaming, show generating state
    if (isStreaming && !artifact) {
      return (
        <div className="my-3 p-4 bg-gradient-to-r from-beige to-gray-50 border border-gray-300 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-taupe rounded-lg flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white animate-pulse" />
            </div>
            <div className="flex-1">
              <h3 className="text-gray-800 font-medium">Generating results...</h3>
              <p className="text-gray-600 text-sm">AI is creating your exclusive content</p>
            </div>
          </div>
        </div>
      )
    }

    // Normal artifact display
    const displayArtifact = artifact || streamingArtifact
    if (!displayArtifact) return <span className="text-gray-500">Artifact not found</span>

    return (
      <div
        className="my-3 p-4 bg-gradient-to-r from-beige to-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:border-taupe hover:shadow-sm transition-all"
        onClick={() => {
          setCurrentDisplayResult(displayArtifact)
          setGeneratedHtml(displayArtifact.content)
        }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-taupe rounded-lg flex items-center justify-center">
            <Sparkles className={`h-6 w-6 text-white ${isStreaming ? 'animate-pulse' : ''}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-gray-800 font-medium">
              {displayArtifact.name}
              {isStreaming && <span className="ml-2 text-xs text-taupe">正在生成中...</span>}
            </h3>
            <p className="text-gray-600 text-sm">
              {isStreaming ? "实时预览中" : "Click to open website"}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const renderMessageContent = (message: MessageType): JSX.Element => {
    // Check if this message contains an artifact placeholder
    if (message.artifactId) {
      // Split content by artifact placeholder and render the artifact block
      const parts = message.content.split(/\[Artifact (?:generated|streaming) - view in right panel\]/)

      return (
        <div>
          {parts.map((part, index) => (
            <div key={index}>
              {part && <MarkdownRenderer content={part} />}
              {index < parts.length - 1 && renderArtifactBlock(message.artifactId!)}
            </div>
          ))}
        </div>
      )
    }

    // Regular message content
    return <MarkdownRenderer content={message.content} />
  }

  // Function to render thinking block
  const renderThinkingBlock = (message: MessageType): JSX.Element | null => {
    if (!message.thinkingContent || !message.id) return null

    const isExpanded = expandedThinking.has(message.id)

    return (
      <div className="mb-3 border border-amber-200 bg-amber-50 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleThinking(message.id!)}
          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-amber-100 transition-colors"
        >
          <div className="flex items-center space-x-2">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-amber-600" />
            ) : (
              <ChevronRight className="h-4 w-4 text-amber-600" />
            )}
            <span className="text-sm font-medium text-amber-800">
              Secret Thought Process (Do Not Click!)
            </span>
          </div>
        </button>

        {isExpanded && (
          <div className="px-4 pb-4 border-t border-amber-200 bg-amber-25">
            <div className="mt-3 p-3 bg-white rounded border border-amber-200">
              <div className="text-sm text-amber-800 italic leading-relaxed">
                <MarkdownRenderer content={message.thinkingContent} />
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <AuthGuard>
      <div className="h-screen overflow-hidden bg-beige text-gray-700 font-sans">
        {/* Main Content */}
        <div className="flex h-screen">
          {/* Sidebar */}
          <div className="w-64 bg-white border-r border-gray-300 flex flex-col">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-300">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-lg font-serif font-medium text-gray-800">Wanus AI</h1>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setMessages([])
                    setToolResults([])
                    setArtifacts([])
                    setCurrentDisplayResult(null)
                    setGeneratedHtml(null)
                  }}
                  className="border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  New Task
                </Button>
              </div>

              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={sidebarSearchQuery}
                  onChange={(e) => setSidebarSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="pl-10 border-gray-300 bg-white text-black focus:border-taupe focus-visible:ring-0"
                />
              </div>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Recent Conversations</h3>
              <div className="space-y-2">
                {chatSessions
                  .filter(session =>
                    sidebarSearchQuery === "" ||
                    session.title.toLowerCase().includes(sidebarSearchQuery.toLowerCase())
                  )
                  .map((session) => (
                    <button
                      key={session.id}
                      className="w-full flex items-start p-3 text-left hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition-colors group"
                    >
                      <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5 mr-3 group-hover:text-taupe" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700 truncate group-hover:text-gray-900">
                          {session.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatTimestamp(session.timestamp)}
                        </p>
                      </div>
                    </button>
                  ))}
              </div>

              {chatSessions.filter(session =>
                sidebarSearchQuery === "" ||
                session.title.toLowerCase().includes(sidebarSearchQuery.toLowerCase())
              ).length === 0 && sidebarSearchQuery !== "" && (
                  <div className="text-center py-8 text-gray-500">
                    <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No conversations found</p>
                  </div>
                )}
            </div>

            {/* User Profile */}
            <div className="p-4 border-t border-gray-300 relative user-profile-container">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center space-x-3 w-full hover:bg-gray-50 rounded-lg p-2 transition-colors group"
              >
                <div className="w-10 h-10 bg-taupe rounded-full flex items-center justify-center overflow-hidden">
                  {session?.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5 text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-gray-700 truncate group-hover:text-gray-900">
                    {session?.user?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-500">{session?.user?.email || ""}</p>
                </div>
              </button>

              {/* User Dropdown Menu */}
              {showUserDropdown && (
                <div className="absolute bottom-full left-4 right-4 mb-2 rounded-lg border border-gray-300 bg-white py-1 shadow-lg z-50">
                  <button
                    onClick={() => {
                      signOut()
                      setShowUserDropdown(false)
                    }}
                    className="flex w-full items-center px-3 py-2 text-left text-sm hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Chat Section */}
          <div ref={chatContainerRef} className="flex h-full w-full flex-col border-r border-gray-300 md:w-1/2">
            {/* Chat Header */}
            <div className="border-b border-gray-300 bg-white p-5">
              <div className="flex items-center">
                <h1 className="text-lg font-serif font-medium text-gray-800">AI Interface</h1>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-white">
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
                  <Sparkles className="mb-4 h-12 w-12 text-taupe" />
                  <h2 className="mb-2 text-xl font-serif font-medium text-gray-800">Welcome to Wanus</h2>
                  <p className="max-w-md text-gray-500">
                    The world's first truly useless AI. Ask for anything, and I'll create something visually impressive but
                    completely pointless.
                  </p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div key={message.id || `message-${index}`} className="mb-4">
                    {message.role === "user" && (
                      <div className="flex items-start justify-end">
                        <div className="rounded-lg rounded-tr-none bg-taupe text-white p-3">
                          <p>{message.content}</p>
                        </div>
                      </div>
                    )}
                    {message.role === "assistant" && (
                      <div className="flex items-start">
                        <div
                          className="rounded-lg rounded-tl-none bg-gray-100 border border-gray-200 p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => handleMessageClick(message)}
                        >
                          {/* Render thinking block if present - moved to top */}
                          {renderThinkingBlock(message)}
                          {renderMessageContent(message)}
                        </div>
                      </div>
                    )}
                    {message.role === "thinking" && (
                      <div className="flex items-start">
                        <div className="rounded-lg rounded-tl-none bg-beige border border-gray-200 p-3 text-gray-600">
                          <p className="flex items-center">
                            <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-taupe"></span>
                            {message.content}
                          </p>
                        </div>
                      </div>
                    )}
                    {message.role === "tool" && (
                      <div className="flex items-center text-sm text-gray-500 py-1">
                        <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-taupe"></span>
                        <span className="mr-1">{getToolActionText(message.toolName || '')}</span>
                        {message.toolResultId ? (
                          <button
                            onClick={() => handleMessageClick(message)}
                            className="text-taupe hover:text-taupe/80 underline cursor-pointer"
                          >
                            {getToolDisplayContent(message.toolName || '', message.content)}
                          </button>
                        ) : (
                          <span className="text-gray-600">{getToolDisplayContent(message.toolName || '', message.content)}</span>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-300 bg-white p-4">
              <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask for anything (it will be useless anyway)..."
                  className="border-gray-300 bg-white text-black focus:border-taupe focus-visible:ring-0"
                  disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading} className="bg-taupe hover:bg-taupe/90 text-white">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>

          {/* Right side - AI Operation Screen */}
          <div className="h-full w-full overflow-hidden bg-white flex-1 flex flex-col">
            {/* Header with dropdown */}
            <div className="border-b border-gray-300 bg-white p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-serif font-medium text-gray-800">AI Operation Screen</h2>
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                  >
                    History <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                  {showDropdown && (
                    <div className="absolute right-0 top-full z-10 mt-1 w-64 rounded-lg border border-gray-300 bg-white py-1 shadow-lg">
                      {/* Tool Results */}
                      {toolResults.length > 0 && (
                        <>
                          <div className="px-3 py-2 text-xs font-medium uppercase text-gray-500">Tool Results</div>
                          {toolResults.map((result) => (
                            <button
                              key={result.id}
                              className="flex w-full items-center px-3 py-2 text-left text-sm hover:bg-gray-50"
                              onClick={() => {
                                setCurrentDisplayResult(result)
                                setShowDropdown(false)
                              }}
                            >
                              <Clock className="mr-2 h-3 w-3 text-gray-500" />
                              <span className="truncate text-gray-700">{result.displayName}</span>
                            </button>
                          ))}
                        </>
                      )}

                      {/* Artifacts */}
                      {artifacts.length > 0 && (
                        <>
                          <div className="px-3 py-2 text-xs font-medium uppercase text-gray-500 border-t border-gray-200 mt-1">Artifacts</div>
                          {artifacts.map((artifact) => (
                            <button
                              key={artifact.id}
                              className="flex w-full items-center px-3 py-2 text-left text-sm hover:bg-gray-50"
                              onClick={() => {
                                setCurrentDisplayResult(artifact)
                                setGeneratedHtml(artifact.content)
                                setShowDropdown(false)
                              }}
                            >
                              <Sparkles className="mr-2 h-3 w-3 text-taupe" />
                              <span className="truncate text-gray-700">{artifact.name}</span>
                            </button>
                          ))}
                        </>
                      )}

                      {toolResults.length === 0 && artifacts.length === 0 && (
                        <div className="px-3 py-2 text-sm text-gray-500">No results yet</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content Display */}
            <div className="flex-1 overflow-auto bg-white">
              {currentDisplayResult ? (
                'content' in currentDisplayResult ? (
                  // This is an artifact
                  renderArtifact(currentDisplayResult)
                ) : (
                  // This is a tool result
                  <div className="p-4">
                    {renderToolResult(currentDisplayResult)}
                  </div>
                )
              ) : (
                <div className="flex h-full flex-col items-center justify-center p-8 text-center text-gray-500">
                  <div className="mb-6 h-32 w-32 rounded-full bg-gradient-to-r from-taupe/20 via-taupe/30 to-taupe/20"></div>
                  <h2 className="mb-2 text-2xl font-serif font-medium text-gray-800">AI Operation Screen</h2>
                  <p className="max-w-md text-gray-500">
                    Results and creations will appear here in real-time as Wanus executes its beautifully useless operations.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Fullscreen Modal */}
          {isFullscreen && currentDisplayResult && 'content' in currentDisplayResult && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col">
              {/* Fullscreen Header */}
              <div className="border-b border-gray-300 p-4 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-xl font-serif font-medium text-gray-800">{currentDisplayResult.name}</h3>
                    <span className="text-sm text-gray-500">{formatTimestamp(currentDisplayResult.timestamp)}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Tabs in fullscreen */}
                    <div className="flex space-x-1 mr-4">
                      <Button
                        variant={artifactViewMode === 'view' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setArtifactViewMode('view')}
                        className={artifactViewMode === 'view'
                          ? 'bg-taupe hover:bg-taupe/90 text-white'
                          : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
                        }
                      >
                        <Eye className="mr-1 h-3 w-3" />
                        View
                      </Button>
                      <Button
                        variant={artifactViewMode === 'code' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setArtifactViewMode('code')}
                        className={artifactViewMode === 'code'
                          ? 'bg-taupe hover:bg-taupe/90 text-white'
                          : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
                        }
                      >
                        <Code className="mr-1 h-3 w-3" />
                        Code
                      </Button>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsFullscreen(false)}
                      className="border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Fullscreen Content */}
              <div className="flex-1 overflow-hidden">
                {artifactViewMode === 'view' ? (
                  <iframe
                    srcDoc={currentDisplayResult.content}
                    title={currentDisplayResult.name}
                    className="w-full h-full border-none bg-white"
                    sandbox="allow-scripts allow-modals"
                  />
                ) : (
                  <div className="h-full overflow-auto bg-gray-50 p-6">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
                      {currentDisplayResult.content}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}
