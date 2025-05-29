"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import { FormEvent } from "react"

type ChatInputProps = {
  input: string
  setInput: (value: string) => void
  onSubmit: (e: FormEvent) => void
  isLoading: boolean
}

export function ChatInput({ input, setInput, onSubmit, isLoading }: ChatInputProps) {
  return (
    <div className="border-t border-gray-300 bg-white p-4">
      <form onSubmit={onSubmit} className="flex items-center space-x-2">
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
  )
} 
