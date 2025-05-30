"use client"

import { ArtifactItem } from "@/components/agent/artifact-viewer"
import { MessageType } from "@/components/agent/message-item"
import { ToolResult } from "@/components/agent/tool-result"
import { useEffect, useState } from "react"

export function useAgentChat() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<MessageType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null)
  const [toolResults, setToolResults] = useState<ToolResult[]>([])
  const [artifacts, setArtifacts] = useState<ArtifactItem[]>([])
  const [currentDisplayResult, setCurrentDisplayResult] = useState<ToolResult | ArtifactItem | null>(null)
  const [artifactViewMode, setArtifactViewMode] = useState<'view' | 'code'>('view')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [streamingArtifact, setStreamingArtifact] = useState<ArtifactItem | null>(null)
  const [expandedThinking, setExpandedThinking] = useState<Set<string>>(new Set())

  // Debug logging for messages state
  useEffect(() => {
    console.log("🎭 Frontend: Messages state changed", {
      messageCount: messages.length,
      messages: messages.map(m => ({ role: m.role, id: m.id, contentLength: m.content?.length || 0 }))
    })
  }, [messages])

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
        return `searching for "${args.query}"`
      case 'browseWeb':
        return `browsing ${args.url}`
      case 'generateImage':
        return `creating image: "${args.prompt}"`
      default:
        return `executing ${toolName} with sophisticated purposelessness...`
    }
  }

  return {
    // State
    input,
    setInput,
    messages,
    setMessages,
    isLoading,
    setIsLoading,
    generatedHtml,
    setGeneratedHtml,
    toolResults,
    setToolResults,
    artifacts,
    setArtifacts,
    currentDisplayResult,
    setCurrentDisplayResult,
    artifactViewMode,
    setArtifactViewMode,
    isFullscreen,
    setIsFullscreen,
    streamingArtifact,
    setStreamingArtifact,
    expandedThinking,
    setExpandedThinking,

    // Helper functions
    extractHtmlTitle,
    generateUniqueArtifactName,
    generateDisplayName,
    addMessage,
    updateLastMessage,
    toggleThinking,
    handleMessageClick,
    resetChat,
    getToolDisplayName,
    getToolUsageMessage
  }
} 
