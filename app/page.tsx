import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Zap, Cpu, BarChart4 } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-20 text-center">
        <div className="relative mb-8 inline-block">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 opacity-75 blur"></div>
          <h1 className="relative text-6xl font-extrabold tracking-tight">WANUS</h1>
        </div>
        <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-400">
          <span className="font-mono text-pink-500">W</span>ith <span className="font-mono text-pink-500">A</span>
          bsolutely <span className="font-mono text-pink-500">N</span>o{" "}
          <span className="font-mono text-pink-500">U</span>sage <span className="font-mono text-pink-500">S</span>
          cenarios
        </p>
        <h2 className="mb-12 text-3xl font-bold">
          The World's First Truly{" "}
          <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">Useless</span> AI
          Agent
        </h2>
        <div className="flex justify-center space-x-4">
          <Link href="/agent">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Experience Uselessness <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            className="border-gray-700 text-gray-300 hover:bg-gray-900 hover:text-white"
          >
            Learn Why
          </Button>
        </div>
      </header>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="mb-16 text-center text-3xl font-bold">Cutting-Edge Uselessness</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 transition-all hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/20">
            <Sparkles className="mb-4 h-10 w-10 text-purple-500" />
            <h3 className="mb-2 text-xl font-bold">Impressive Visuals</h3>
            <p className="text-gray-400">
              Generates stunningly beautiful content that serves absolutely no purpose whatsoever.
            </p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 transition-all hover:border-pink-500 hover:shadow-lg hover:shadow-pink-500/20">
            <Zap className="mb-4 h-10 w-10 text-pink-500" />
            <h3 className="mb-2 text-xl font-bold">Advanced Futility</h3>
            <p className="text-gray-400">
              Utilizes state-of-the-art AI to create the most sophisticated useless artifacts possible.
            </p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 transition-all hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20">
            <Cpu className="mb-4 h-10 w-10 text-blue-500" />
            <h3 className="mb-2 text-xl font-bold">Over-Engineered</h3>
            <p className="text-gray-400">
              Expends enormous computational resources to achieve absolutely nothing of value.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-b from-black to-gray-900 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-16 text-center text-3xl font-bold">What People Are Saying</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-xl bg-gray-800 p-6">
              <p className="mb-4 italic text-gray-300">
                "I've never seen an AI work so hard to produce something so completely pointless. It's brilliant!"
              </p>
              <p className="font-semibold">- Tech Enthusiast</p>
            </div>
            <div className="rounded-xl bg-gray-800 p-6">
              <p className="mb-4 italic text-gray-300">
                "Wanus perfectly captures the essence of modern tech: all style, no substance. A masterpiece of satire."
              </p>
              <p className="font-semibold">- AI Critic</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-8 text-3xl font-bold">Our Mission</h2>
          <p className="mb-6 text-xl text-gray-400">
            Through embracing absolute uselessness, Wanus aims to be a "mirror of absurdity" for the AI industry,
            highlighting the hype, over-engineering, and sometimes empty promises that pervade the field.
          </p>
          <p className="text-xl text-gray-400">We're proudly wasting computational resources since 2025.</p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-b from-gray-900 to-black py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <BarChart4 className="mx-auto mb-4 h-10 w-10 text-purple-500" />
              <p className="text-4xl font-bold">100%</p>
              <p className="text-gray-400">Uselessness Rate</p>
            </div>
            <div className="text-center">
              <BarChart4 className="mx-auto mb-4 h-10 w-10 text-pink-500" />
              <p className="text-4xl font-bold">∞</p>
              <p className="text-gray-400">Pointless Operations</p>
            </div>
            <div className="text-center">
              <BarChart4 className="mx-auto mb-4 h-10 w-10 text-blue-500" />
              <p className="text-4xl font-bold">0</p>
              <p className="text-gray-400">Practical Applications</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-10">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2025 Wanus AI. All rights meaninglessly reserved.</p>
          <p className="mt-2">A satirical project critiquing AI hype culture.</p>
        </div>
      </footer>
    </div>
  )
}
