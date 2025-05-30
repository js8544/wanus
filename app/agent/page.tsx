"use client"

import React from "react"

import { ChatInput } from "@/components/agent/chat-input"
import { ChatMessages } from "@/components/agent/chat-messages"
import { ChatSidebar } from "@/components/agent/chat-sidebar"
import { FullscreenModal } from "@/components/agent/fullscreen-modal"
import { ResultsPanel } from "@/components/agent/results-panel"
import { AuthGuard } from "@/components/auth-guard"
import { useAgentChat } from "@/hooks/use-agent-chat"
import { useEffect, useRef, useState } from "react"

export default function AgentPage() {
  const [showDropdown, setShowDropdown] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const {
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
    extractHtmlTitle,
    generateUniqueArtifactName,
    generateDisplayName,
    addMessage,
    toggleThinking,
    handleMessageClick,
    resetChat,
    getToolDisplayName,
    getToolUsageMessage
  } = useAgentChat()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setIsLoading(false)
    setMessages(prev => prev.filter(msg => msg.role !== "thinking"))

    addMessage({
      role: "assistant",
      content: "Request cancelled. Ready for your next beautifully useless request!",
      isError: false
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

      // Create abort controller for this request
      abortControllerRef.current = new AbortController()

      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory
        }),
        signal: abortControllerRef.current.signal
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

      let currentTextBuffer = ""
      let currentToolResults: any[] = []
      let currentAssistantMessage: any = null
      let currentMessageId: string | undefined = undefined

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

          for (const line of lines) {
            if (line.startsWith('0:')) {
              // Text Part
              try {
                const textContent = line.slice(2)
                const textPart = JSON.parse(textContent)

                if (!currentMessageId) {
                  currentMessageId = `assistant-${Date.now()}-${Math.random()}`
                }

                currentTextBuffer += textPart

                // Process artifacts and thinking blocks
                let messageContent = currentTextBuffer
                let artifactIdForMessage: string | undefined = undefined
                let thinkingContentForMessage: string | undefined = undefined

                // Process thinking blocks
                const thinkingMatch = currentTextBuffer.match(/```think\n([\s\S]*?)\n```/)
                if (thinkingMatch) {
                  const thinkingContent = thinkingMatch[1]
                  thinkingContentForMessage = thinkingContent.trim()
                  messageContent = currentTextBuffer.replace(/```think\n[\s\S]*?\n```/, '')
                } else {
                  // Handle incomplete/streaming thinking blocks
                  const incompleteThinkingMatch = currentTextBuffer.match(/```think\n([\s\S]*)$/)
                  if (incompleteThinkingMatch) {
                    const thinkingContent = incompleteThinkingMatch[1]
                    thinkingContentForMessage = thinkingContent.trim()
                    // Remove the incomplete thinking block from message content
                    messageContent = currentTextBuffer.replace(/```think\n[\s\S]*$/, '')
                  }
                }

                // Process artifacts
                const artifactStartMatch = messageContent.match(/```artifact\n/)
                const artifactEndMatch = messageContent.match(/```artifact\n([\s\S]*?)\n```/)

                if (artifactStartMatch) {
                  const artifactId = streamingArtifact?.id || `artifact-${Date.now()}`
                  artifactIdForMessage = artifactId

                  if (artifactEndMatch) {
                    // Complete artifact
                    const htmlContent = artifactEndMatch[1]
                    const artifact = {
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

                    messageContent = messageContent.replace(/```artifact\n[\s\S]*?\n```/, '[Artifact generated - view in right panel]')
                  } else {
                    // Streaming artifact
                    const partialContent = messageContent.split('```artifact\n')[1] || ''
                    const artifact = {
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

                    messageContent = messageContent.replace(/```artifact\n[\s\S]*$/, '[Artifact streaming - view in right panel]')
                  }
                }

                // Update or create assistant message
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

              } catch (parseError) {
                console.log('⚠️ Frontend: Parse error for text part:', parseError)
                // Handle raw text fallback similar to above
              }
            } else if (line.startsWith('b:')) {
              // Tool Call Streaming Start Part
              if (currentTextBuffer.trim()) {
                currentTextBuffer = ""
                currentAssistantMessage = null
                currentMessageId = undefined
              }

              try {
                const jsonStr = line.slice(2)
                const data = JSON.parse(jsonStr)
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
            } else if (line.startsWith('9:')) {
              // Tool Call Part
              try {
                const jsonStr = line.slice(2)
                const data = JSON.parse(jsonStr)

                currentToolResults.push({
                  toolCallId: data.toolCallId,
                  toolName: data.toolName,
                  args: data.args
                })

                const toolDisplayName = getToolDisplayName(data.toolName)

                setMessages(prev => {
                  const newMessages = [...prev]
                  const lastToolIndex = newMessages.length - 1

                  if (lastToolIndex >= 0 &&
                    newMessages[lastToolIndex].role === "tool" &&
                    newMessages[lastToolIndex].toolName === toolDisplayName &&
                    newMessages[lastToolIndex].content?.includes("Starting")) {
                    newMessages[lastToolIndex] = {
                      role: "tool",
                      content: getToolUsageMessage(data.toolName, data.args),
                      toolName: toolDisplayName,
                      toolCallId: data.toolCallId
                    }
                  } else {
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

                const toolCall = currentToolResults.find(t => t.toolCallId === data.toolCallId)
                if (toolCall) {
                  const toolResult = {
                    id: `result-${Date.now()}-${Math.random()}`,
                    toolName: toolCall.toolName,
                    args: toolCall.args,
                    result: data.result,
                    timestamp: Date.now(),
                    displayName: generateDisplayName(toolCall.toolName, toolCall.args)
                  }

                  setToolResults(prev => [...prev, toolResult])
                  setCurrentDisplayResult(toolResult)

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
                }

              } catch (parseError) {
                console.log('⚠️ Frontend: Parse error for tool result:', parseError)
              }
            } else if (line.startsWith('3:')) {
              // Error Part
              try {
                const jsonStr = line.slice(2)
                const errorMessage = JSON.parse(jsonStr)
                addMessage({
                  role: "assistant",
                  content: `Error: ${errorMessage}`,
                  isError: true
                })
              } catch (parseError) {
                console.log('⚠️ Frontend: Parse error for error part:', parseError)
              }
            }
          }
        }
      }

    } catch (error) {
      console.error('❌ Frontend: Error calling Wanus AI:', error)

      setMessages(prev => prev.filter(msg => msg.role !== "thinking"))

      // Don't show error message if request was aborted
      if (error instanceof Error && error.name === 'AbortError') {
        return
      }

      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'

      addMessage({
        role: "assistant",
        content: `Error occurred: ${errorMessage}\n\nEven in failure, I maintain my commitment to uselessness. This error is beautifully meaningless.`,
        isError: true
      })
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }

  const handleRetry = async () => {
    if (isLoading) return

    addMessage({ role: "user", content: "retry" })
    setIsLoading(true)

    try {
      addMessage({ role: "thinking", content: "Retrying with renewed commitment to uselessness..." })

      const conversationHistory = messages.filter(msg =>
        (msg.role === "user" || msg.role === "assistant") && msg.content !== "retry"
      )

      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: "retry",
          conversationHistory
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      setMessages(prev => prev.filter(msg => msg.role !== "thinking"))

      // Handle retry response (simplified version of handleSubmit logic)
      // ... (similar streaming logic as above)

    } catch (error) {
      console.error('❌ Frontend: Error during retry:', error)

      setMessages(prev => prev.filter(msg => msg.role !== "thinking"))

      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      addMessage({
        role: "assistant",
        content: `Retry failed: ${errorMessage}\n\nEven my retries are beautifully useless!`,
        isError: true
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthGuard>
      <div className="h-screen overflow-hidden bg-beige text-gray-700 font-sans">
        <div className="flex h-screen">
          {/* Left Half: Sidebar + Chat */}
          <div className="flex w-1/2 h-full min-w-0">
            {/* Sidebar */}
            <ChatSidebar onNewChat={resetChat} />

            {/* Chat Section */}
            <div ref={chatContainerRef} className="flex h-full flex-1 flex-col border-r border-gray-300 min-w-0">
              {/* Chat Header */}
              <div className="border-b border-gray-300 bg-white p-5">
                <div className="flex items-center">
                  <h1 className="text-lg font-serif font-medium text-gray-800">AI Interface</h1>
                </div>
              </div>

              {/* Messages */}
              <ChatMessages
                ref={messagesEndRef}
                messages={messages}
                isLoading={isLoading}
                expandedThinking={expandedThinking}
                streamingArtifact={streamingArtifact}
                artifacts={artifacts}
                onMessageClick={handleMessageClick}
                onToggleThinking={toggleThinking}
                onRetry={handleRetry}
                setCurrentDisplayResult={setCurrentDisplayResult}
                setGeneratedHtml={setGeneratedHtml}
              />

              {/* Input */}
              <ChatInput
                input={input}
                setInput={setInput}
                onSubmit={handleSubmit}
                onStop={handleStop}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* Right Half: Results Panel */}
          <div className="w-1/2 h-full min-w-0">
            <ResultsPanel
              currentDisplayResult={currentDisplayResult}
              streamingArtifact={streamingArtifact}
              toolResults={toolResults}
              artifacts={artifacts}
              artifactViewMode={artifactViewMode}
              setArtifactViewMode={setArtifactViewMode}
              setIsFullscreen={setIsFullscreen}
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
              setCurrentDisplayResult={setCurrentDisplayResult}
              setGeneratedHtml={setGeneratedHtml}
            />
          </div>

          {/* Fullscreen Modal */}
          {isFullscreen && currentDisplayResult && 'content' in currentDisplayResult && (
            <FullscreenModal
              isOpen={isFullscreen}
              artifact={currentDisplayResult}
              artifactViewMode={artifactViewMode}
              setArtifactViewMode={setArtifactViewMode}
              onClose={() => setIsFullscreen(false)}
            />
          )}
        </div>
      </div>
    </AuthGuard>
  )
}
