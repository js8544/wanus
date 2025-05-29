"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LogOut, MessageSquare, Plus, Search, User } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { useEffect, useState } from "react"

type ChatSession = {
  id: string
  title: string
  timestamp: number
}

type ChatSidebarProps = {
  onNewChat: () => void
}

export function ChatSidebar({ onNewChat }: ChatSidebarProps) {
  const [sidebarSearchQuery, setSidebarSearchQuery] = useState("")
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [chatSessions] = useState<ChatSession[]>([
    { id: "1", title: "Useless Website Generator", timestamp: Date.now() - 86400000 },
    { id: "2", title: "Pointless Animation Creator", timestamp: Date.now() - 172800000 },
    { id: "3", title: "Meaningless Chart Builder", timestamp: Date.now() - 259200000 },
  ])
  const { data: session } = useSession()

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

  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString()
  }

  const filteredSessions = chatSessions.filter(session =>
    sidebarSearchQuery === "" ||
    session.title.toLowerCase().includes(sidebarSearchQuery.toLowerCase())
  )

  return (
    <div className="w-64 bg-white border-r border-gray-300 flex flex-col">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-300">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-serif font-medium text-gray-800">Wanus AI</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={onNewChat}
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
          {filteredSessions.map((session) => (
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

        {filteredSessions.length === 0 && sidebarSearchQuery !== "" && (
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
  )
} 
