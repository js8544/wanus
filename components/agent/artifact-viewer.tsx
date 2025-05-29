"use client"

import { Button } from "@/components/ui/button"
import { Code, Eye, Maximize2, Sparkles } from "lucide-react"

export type ArtifactItem = {
  id: string
  name: string
  content: string
  timestamp: number
}

type ArtifactViewerProps = {
  artifact: ArtifactItem
  streamingArtifact: ArtifactItem | null
  artifactViewMode: 'view' | 'code'
  setArtifactViewMode: (mode: 'view' | 'code') => void
  setIsFullscreen: (fullscreen: boolean) => void
}

export function ArtifactViewer({
  artifact,
  streamingArtifact,
  artifactViewMode,
  setArtifactViewMode,
  setIsFullscreen
}: ArtifactViewerProps) {
  const isStreaming = streamingArtifact?.id === artifact.id
  const displayContent = isStreaming ? streamingArtifact.content : artifact.content

  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString()
  }

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

export function ArtifactBlock({
  artifact,
  streamingArtifact,
  setCurrentDisplayResult,
  setGeneratedHtml
}: {
  artifact?: ArtifactItem
  streamingArtifact: ArtifactItem | null
  setCurrentDisplayResult: (result: ArtifactItem) => void
  setGeneratedHtml: (html: string) => void
}) {
  const isStreaming = streamingArtifact?.id === artifact?.id

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
