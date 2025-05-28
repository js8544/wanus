"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { LogOut, Settings, Sparkles, User } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"

export function Navigation() {
  const { data: session, status } = useSession()

  return (
    <nav className="border-b border-gray-300 bg-white">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/wanus_logo.png"
            alt="Wanus Logo"
            width={32}
            height={32}
            className="mr-2 h-8 w-8"
          />
          <span className="font-serif text-xl font-medium tracking-tight">WANUS</span>
        </Link>

        <div className="hidden space-x-1 md:flex">
          {["Solutions", "Enterprise", "Resources", "About", "Contact"].map((item) => (
            <button
              key={item}
              className="rounded-sm px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
            >
              {item}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          {status === "loading" ? (
            <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
          ) : session ? (
            // Authenticated user
            <div className="flex items-center space-x-3">
              <Link href="/agent">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Create Uselessness
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                      <AvatarFallback className="bg-purple-100 text-purple-600">
                        {session.user?.name ? session.user.name.charAt(0).toUpperCase() : (
                          session.user?.email ? session.user.email.charAt(0).toUpperCase() : 'U'
                        )}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {session.user?.name && (
                        <p className="font-medium">{session.user.name}</p>
                      )}
                      {session.user?.email && (
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {session.user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/agent" className="cursor-pointer">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Wanus Agent
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            // Unauthenticated user
            <div className="flex items-center space-x-3">
              <Link href="/auth/signin">
                <Button
                  size="sm"
                  className="bg-taupe text-white hover:bg-taupe/90"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
} 
