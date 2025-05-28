import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Wanus - With Absolutely No Usage Scenarios",
  description: "The world's first truly useless AI agent. A satirical project critiquing AI hype culture.",
  generator: 'v0.dev',
  icons: {
    icon: '/wanus_logo.png',
    shortcut: '/wanus_logo.png',
    apple: '/wanus_logo.png',
  },
  openGraph: {
    title: "Wanus - With Absolutely No Usage Scenarios",
    description: "The world's first truly useless AI agent. A satirical project critiquing AI hype culture.",
    images: ['/wanus_logo.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Wanus - With Absolutely No Usage Scenarios",
    description: "The world's first truly useless AI agent. A satirical project critiquing AI hype culture.",
    images: ['/wanus_logo.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange> */}
        {children}
        {/* </ThemeProvider> */}
      </body>
    </html>
  )
}
