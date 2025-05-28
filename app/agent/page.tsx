"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Sparkles, ArrowLeft, RefreshCw } from "lucide-react"
import Link from "next/link"

type MessageType = {
  role: "user" | "assistant" | "thinking" | "tool" | "tool-result"
  content: string
  toolName?: string
}

export default function AgentPage() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<MessageType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI thinking
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "thinking", content: "Analyzing request and determining the most useless approach..." },
      ])
    }, 500)

    // Simulate web search
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "tool", content: "Searching the web for relevant information...", toolName: "web-search" },
      ])
    }, 2000)

    // Simulate web search results
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "tool-result",
          content: "Found 15 results that might be relevant, but I'll deliberately misinterpret them.",
          toolName: "web-search",
        },
      ])
    }, 3500)

    // Simulate web browsing
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "tool", content: "Browsing web pages to extract useless details...", toolName: "web-browse" },
      ])
    }, 5000)

    // Simulate web browsing results
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "tool-result",
          content: "Extracted content from 3 pages. Focusing only on the most irrelevant parts.",
          toolName: "web-browse",
        },
      ])
    }, 6500)

    // Simulate image generation
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "tool",
          content: "Generating a visually impressive but contextually useless image...",
          toolName: "create-image",
        },
      ])
    }, 8000)

    // Simulate image generation results
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "tool-result",
          content: "Image generated successfully. It looks amazing but adds no value whatsoever.",
          toolName: "create-image",
        },
      ])
    }, 9500)

    // Final assistant response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I've created a completely useless artifact based on your request. It's visually stunning but serves absolutely no practical purpose, as per my core design philosophy.",
        },
      ])

      // Generate HTML based on user input
      const html = generateUselessHtml(input)
      setGeneratedHtml(html)
      setIsLoading(false)
    }, 11000)
  }

  const generateUselessHtml = (userInput: string) => {
    // Create a title based on the user input
    const title = `Wanus: ${userInput.charAt(0).toUpperCase() + userInput.slice(1)}`

    // Generate a random number of sections
    const numSections = Math.floor(Math.random() * 3) + 2

    let sections = ""
    for (let i = 0; i < numSections; i++) {
      const sectionTitle = `Section ${i + 1}: ${getRandomPhrase()}`
      const paragraphs = Math.floor(Math.random() * 2) + 1

      let paragraphsHtml = ""
      for (let j = 0; j < paragraphs; j++) {
        paragraphsHtml += `<p class="mb-4">${getRandomParagraph()}</p>`
      }

      sections += `
        <section class="mb-10">
          <h2 class="text-2xl font-bold mb-4 text-gradient">${sectionTitle}</h2>
          ${paragraphsHtml}
          <div class="flex justify-center my-6">
            <div class="w-full max-w-md h-40 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
              Impressive Visual Element ${i + 1}
            </div>
          </div>
        </section>
      `
    }

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(to bottom, #0f0f1a, #1a1a2e);
            color: #e0e0e0;
            line-height: 1.6;
            padding: 0;
            margin: 0;
            min-height: 100vh;
          }
          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
          }
          header {
            text-align: center;
            padding: 3rem 0;
            background: linear-gradient(135deg, rgba(128, 0, 128, 0.1), rgba(255, 0, 128, 0.1));
            border-radius: 1rem;
            margin-bottom: 2rem;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          .text-gradient {
            background: linear-gradient(to right, #c084fc, #e879f9, #60a5fa);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
          }
          .stats-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin: 2rem 0;
          }
          .stat-card {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 0.5rem;
            padding: 1.5rem;
            text-align: center;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          .stat-value {
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
            background: linear-gradient(to right, #c084fc, #e879f9);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
          }
          .footer {
            text-align: center;
            padding: 2rem 0;
            margin-top: 3rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            font-size: 0.875rem;
            color: rgba(255, 255, 255, 0.6);
          }
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
          .floating {
            animation: float 6s ease-in-out infinite;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <h1 class="text-4xl font-bold mb-4 text-gradient">${title}</h1>
            <p class="text-xl opacity-80">A completely useless artifact generated by Wanus AI</p>
          </header>
          
          <main>
            ${sections}
            
            <div class="stats-container">
              <div class="stat-card">
                <div class="stat-value">${Math.floor(Math.random() * 100)}%</div>
                <div class="stat-label">Meaninglessness</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${Math.floor(Math.random() * 1000)}</div>
                <div class="stat-label">Pointless Metrics</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${Math.floor(Math.random() * 10000)}</div>
                <div class="stat-label">Wasted Computations</div>
              </div>
            </div>
            
            <div class="flex justify-center my-10">
              <div class="w-full max-w-lg h-60 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold floating">
                Stunning Yet Completely Useless Visualization
              </div>
            </div>
          </main>
          
          <footer class="footer">
            <p>Generated by Wanus AI - With Absolutely No Usage Scenarios</p>
            <p>© 2025 Wanus. All rights meaninglessly reserved.</p>
          </footer>
        </div>
      </body>
      </html>
    `
  }

  const getRandomPhrase = () => {
    const phrases = [
      "Paradigm-Shifting Uselessness",
      "Revolutionary Non-Functionality",
      "Cutting-Edge Irrelevance",
      "Breakthrough Pointlessness",
      "Next-Generation Futility",
      "Disruptive Meaninglessness",
      "Innovative Waste of Resources",
      "State-of-the-Art Purposelessness",
    ]
    return phrases[Math.floor(Math.random() * phrases.length)]
  }

  const getRandomParagraph = () => {
    const paragraphs = [
      "This section leverages advanced algorithms to generate content that appears significant but offers no practical value whatsoever. The sophisticated language processing models work tirelessly to ensure maximum verbosity with minimum substance.",
      "Utilizing state-of-the-art neural networks, we've created a visualization that captivates the eye while conveying absolutely no useful information. This represents the pinnacle of our commitment to beautiful uselessness.",
      "Our proprietary technology combines cutting-edge machine learning with advanced graphics rendering to produce what experts describe as 'the most visually stunning waste of computational resources ever created.'",
      "This groundbreaking section demonstrates how AI can generate paragraphs of text that initially appear insightful but upon closer inspection reveal themselves to be entirely devoid of actionable information or meaningful content.",
      "Through revolutionary techniques in natural language processing, we've developed content that mimics the structure and appearance of valuable information while being carefully engineered to serve no practical purpose.",
    ]
    return paragraphs[Math.floor(Math.random() * paragraphs.length)]
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
              <div key={index} className="mb-4">
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
