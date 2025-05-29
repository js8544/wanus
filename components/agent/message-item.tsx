"use client"

import { Button } from "@/components/ui/button"
import { MarkdownRenderer } from "@/components/ui/markdown"
import { ChevronDown, ChevronRight } from "lucide-react"
import { JSX } from "react"

export type MessageType = {
  role: "user" | "assistant" | "thinking" | "tool" | "tool-result"
  content: string
  toolName?: string
  imageUrl?: string
  id?: string
  toolResultId?: string
  toolCallId?: string
  artifactId?: string
  thinkingContent?: string
  isError?: boolean
}

type MessageItemProps = {
  message: MessageType
  index: number
  isLoading: boolean
  expandedThinking: Set<string>
  onMessageClick: (message: MessageType) => void
  onToggleThinking: (messageId: string) => void
  onRetry: () => void
  renderArtifactBlock: (artifactId: string) => JSX.Element
}

export function MessageItem({
  message,
  index,
  isLoading,
  expandedThinking,
  onMessageClick,
  onToggleThinking,
  onRetry,
  renderArtifactBlock
}: MessageItemProps) {
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
        const queryMatch = content.match(/for "(.*?)"/)
        return queryMatch ? queryMatch[1] : content
      case 'web-browse':
        const urlMatch = content.match(/browsing (https?:\/\/[^\s]+)/)
        return urlMatch ? urlMatch[1] : content
      case 'create-image':
        const promptMatch = content.match(/image: "(.*?)"/)
        return promptMatch ? promptMatch[1] : content
      default:
        return content
    }
  }

  const renderThinkingBlock = (): JSX.Element | null => {
    if (!message.thinkingContent || !message.id) return null

    const isExpanded = expandedThinking.has(message.id)

    return (
      <div className="mb-3 border border-amber-200 bg-amber-50 rounded-lg overflow-hidden">
        <button
          onClick={() => onToggleThinking(message.id!)}
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

  const renderMessageContent = (): JSX.Element => {
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

  return (
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
            onClick={() => onMessageClick(message)}
          >
            {/* Render thinking block if present - moved to top */}
            {renderThinkingBlock()}
            {renderMessageContent()}

            {/* Retry button for error messages */}
            {message.isError && (
              <div className="mt-3 pt-3 border-t border-gray-300">
                <Button
                  onClick={(e) => {
                    e.stopPropagation() // Prevent triggering the message click handler
                    onRetry()
                  }}
                  disabled={isLoading}
                  className="bg-taupe hover:bg-taupe/90 text-white text-sm"
                  size="sm"
                >
                  {isLoading ? 'Retrying...' : 'Retry'}
                </Button>
              </div>
            )}
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
              onClick={() => onMessageClick(message)}
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
  )
} 
