import { Button } from "@/components/ui/button"
import { ArrowRight, Coffee, FileBarChart, PieChart, Play } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-beige text-gray-700 font-sans">
      {/* Navigation */}
      <nav className="border-b border-gray-300 bg-white">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="flex items-center">
            <Image
              src="/wanus_logo.png"
              alt="Wanus Logo"
              width={32}
              height={32}
              className="mr-2 h-8 w-8"
            />
            <span className="font-serif text-xl font-medium tracking-tight">WANUS</span>
          </div>
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
          <Button variant="outline" className="hidden bg-white border-gray-300 text-sm hover:text-gray-800 md:inline-flex">
            Request Demo
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="border-b border-gray-300 bg-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6 inline-flex items-center rounded-full border border-gray-300 bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            NEW RELEASE v0.6.9
          </div>


          {/* Logo moved to be inline with title */}
          <div className=" flex flex-col items-center">
            <div className="flex items-center justify-center gap-4">
              <Image
                src="/wanus_logo.png"
                alt="Wanus Logo"
                width={80}
                height={80}
                className=""
              />
              <h1 className="font-serif text-4xl font-medium tracking-tight text-gray-800 md:text-6xl">
                <span className="text-taupe">WANUS</span>: World's first truly useless AI Agent
              </h1>
            </div>

          </div>

          <h2 className="font-serif text-2xl font-medium tracking-tight text-gray-600 mt-4 md:text-3xl">
            <span className="text-taupe">W</span>ith <span className="text-taupe">A</span>bsolutely{" "}
            <span className="text-taupe">N</span>o <span className="text-taupe">U</span>sage{" "}
            <span className="text-taupe">S</span>cenarios
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-500">
            The world's first AI agent meticulously engineered to produce visually impressive yet completely pointless
            results with enterprise-grade reliability. (Same as all other AI products, our logo looks like an arse)
          </p>
          <div className="mt-10 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Link href="/agent">
              <Button size="lg" className="w-full bg-taupe text-white hover:bg-taupe/90 sm:w-auto">
                Experience Uselessness <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="w-full bg-white border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-800 sm:w-auto"
            >
              Read Whitepaper
            </Button>
          </div>

          {/* Fake Video Player */}
          <div className="mt-12 mx-auto max-w-lg">
            <div className="relative bg-gray-800 rounded-lg overflow-hidden border border-gray-300 cursor-pointer group">
              <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center relative">
                {/* Video Thumbnail Background */}
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>

                {/* Play Button */}
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 group-hover:scale-110 transition-all duration-200 z-10">
                  <Play className="w-8 h-8 text-white fill-white" />
                </div>

                {/* Video Title Overlay - Top */}
                <div className="absolute top-4 left-4 right-4 z-10">
                  <h3 className="text-white text-lg font-semibold shadow-text">Product Demo: WANUS in Action</h3>
                </div>

                {/* Video Description Overlay - Bottom */}
                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <p className="text-gray-200 text-lg shadow-text mb-5">Will add a video where some Asian guy sits on a couch speaking semi-fluent English</p>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 px-2 py-1 rounded text-white text-sm font-medium z-10">
                  13:37
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Metrics Section */}
      <section className="border-b border-gray-300 bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <p className="font-serif text-3xl font-medium text-taupe">100%</p>
              <p className="mt-2 text-sm text-gray-500">Uselessness Rate</p>
            </div>
            <div className="text-center">
              <p className="font-serif text-3xl font-medium text-taupe">$0M</p>
              <p className="mt-2 text-sm text-gray-500">Value Generated</p>
            </div>
            <div className="text-center">
              <p className="font-serif text-3xl font-medium text-taupe">24/7</p>
              <p className="mt-2 text-sm text-gray-500">Pointless Availability</p>
            </div>
            <div className="text-center">
              <p className="font-serif text-3xl font-medium text-taupe">0</p>
              <p className="mt-2 text-sm text-gray-500">Practical Applications</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="font-serif text-3xl font-medium tracking-tight text-gray-800">
              Enterprise-Grade Uselessness
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-500">
              Our proprietary technology ensures consistent delivery of beautifully meaningless content.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: <FileBarChart className="h-8 w-8 text-taupe" />,
                title: "Meaningless Analytics",
                description:
                  "Generate impressive charts and graphs that visualize non-existent patterns in irrelevant data.",
              },
              {
                icon: <Coffee className="h-8 w-8 text-taupe" />,
                title: "Productivity Illusion",
                description:
                  "Experience the satisfaction of accomplishment without the burden of actually achieving anything.",
              },
              {
                icon: <PieChart className="h-8 w-8 text-taupe" />,
                title: "Strategic Pointlessness",
                description:
                  "Leverage our AI to transform simple tasks into complex, multi-step processes with no added value.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="rounded-sm border border-gray-300 bg-white p-6 transition-all hover:border-taupe hover:shadow-sm"
              >
                <div className="mb-4 rounded-sm bg-beige p-3 inline-block">{feature.icon}</div>
                <h3 className="mb-2 font-serif text-xl font-medium text-gray-800">{feature.title}</h3>
                <p className="text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-b border-gray-300 bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-16 text-center font-serif text-3xl font-medium tracking-tight text-gray-800">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-sm border border-gray-300 bg-beige p-6">
              <p className="mb-4 text-gray-700">
                "Wanus has revolutionized how we approach meaningless tasks. Now we can generate reports that no one
                will read, which is all that I have been doing since I graduated, but this time with unprecedented efficiency."
              </p>
              <div className="flex items-center">
                <div className="mr-3 h-10 w-10 rounded-full bg-gray-300"></div>
                <div>
                  <p className="font-medium text-gray-800">Sarah Johnson</p>
                  <p className="text-sm text-gray-500">VP of Unnecessary Initiatives</p>
                </div>
              </div>
            </div>
            <div className="rounded-sm border border-gray-300 bg-beige p-6">
              <p className="mb-4 text-gray-700">
                "The ability to generate visually stunning yet completely irrelevant content has been a game-changer for
                our quarterly meetings."
              </p>
              <div className="flex items-center">
                <div className="mr-3 h-10 w-10 rounded-full bg-gray-300"></div>
                <div>
                  <p className="font-medium text-gray-800">Michael Chen</p>
                  <p className="text-sm text-gray-500">Director of Strategic Ambiguity</p>
                </div>
              </div>
            </div>
            <div className="rounded-sm border border-gray-300 bg-beige p-6">
              <p className="mb-4 text-gray-700">
                "Finally, a tool that matches our quarterly performance. WANUS generates exactly zero value, which is precisely what our last three initiatives delivered, but now we can visualize it beautifully."
              </p>
              <div className="flex items-center">
                <div className="mr-3 h-10 w-10 rounded-full bg-gray-300"></div>
                <div>
                  <p className="font-medium text-gray-800">David Park</p>
                  <p className="text-sm text-gray-500">Chief Innovation Officer</p>
                </div>
              </div>
            </div>
            <div className="rounded-sm border border-gray-300 bg-beige p-6">
              <p className="mb-4 text-gray-700">
                "Our team loved WANUS so much, we allocated 40% of our AI budget to it. The other 60% went to equally useless tools, so it fits perfectly."
              </p>
              <div className="flex items-center">
                <div className="mr-3 h-10 w-10 rounded-full bg-gray-300"></div>
                <div>
                  <p className="font-medium text-gray-800">Roberto Martinez</p>
                  <p className="text-sm text-gray-500">VP of Digital Transformation</p>
                </div>
              </div>
            </div>
            <div className="rounded-sm border border-gray-300 bg-beige p-6">
              <p className="mb-4 text-gray-700">
                "I published three papers using WANUS-generated data visualization. The peer reviewers were impressed by graphs that plotted the correlation between my lunch choices and global GDP."
              </p>
              <div className="flex items-center">
                <div className="mr-3 h-10 w-10 rounded-full bg-gray-300"></div>
                <div>
                  <p className="font-medium text-gray-800">Dr. Marcus Weber</p>
                  <p className="text-sm text-gray-500">Assistant Professor of Applied Nonsense</p>
                </div>
              </div>
            </div>
            <div className="rounded-sm border border-gray-300 bg-beige p-6">
              <p className="mb-4 text-gray-700">
                "My manager asked me to 'think outside the box.' WANUS helped me realize the box doesn't exist, and neither do my contributions to this company."
              </p>
              <div className="flex items-center">
                <div className="mr-3 h-10 w-10 rounded-full bg-gray-300"></div>
                <div>
                  <p className="font-medium text-gray-800">Sarah Kim</p>
                  <p className="text-sm text-gray-500">Business Analyst</p>
                </div>
              </div>
            </div>
            <div className="rounded-sm border border-gray-300 bg-beige p-6">
              <p className="mb-4 text-gray-700">
                "WANUS is the only AI tool that honestly represents my work output. Finally, transparency in tech!"
              </p>
              <div className="flex items-center">
                <div className="mr-3 h-10 w-10 rounded-full bg-gray-300"></div>
                <div>
                  <p className="font-medium text-gray-800">Mike Rodriguez</p>
                  <p className="text-sm text-gray-500">Product Manager</p>
                </div>
              </div>
            </div>
            <div className="rounded-sm border border-gray-300 bg-beige p-6">
              <p className="mb-4 text-gray-700">
                "I used WANUS to plan my European vacation. It created a beautiful 12-day itinerary visiting museums that don't exist in cities I can't pronounce. My Instagram stories have never looked more cultured."
              </p>
              <div className="flex items-center">
                <div className="mr-3 h-10 w-10 rounded-full bg-gray-300"></div>
                <div>
                  <p className="font-medium text-gray-800">Maya Patel</p>
                  <p className="text-sm text-gray-500">Travel Blogger</p>
                </div>
              </div>
            </div>
            <div className="rounded-sm border border-gray-300 bg-beige p-6">
              <p className="mb-4 text-gray-700">
                "WANUS revolutionized my meal prep. It generates weekly recipes using ingredients I don't have to make dishes I've never heard of. I've lost 15 pounds from confusion alone."
              </p>
              <div className="flex items-center">
                <div className="mr-3 h-10 w-10 rounded-full bg-gray-300"></div>
                <div>
                  <p className="font-medium text-gray-800">Chris Johnson</p>
                  <p className="text-sm text-gray-500">Home Cook</p>
                </div>
              </div>
            </div>
            <div className="rounded-sm border border-gray-300 bg-beige p-6">
              <p className="mb-4 text-gray-700">
                "My dating profile was getting no matches until WANUS optimized it. Now I'm attracting people who appreciate my hobby of 'collecting vintage air' and my passion for 'interpretive spreadsheet dancing.'"
              </p>
              <div className="flex items-center">
                <div className="mr-3 h-10 w-10 rounded-full bg-gray-300"></div>
                <div>
                  <p className="font-medium text-gray-800">Taylor Smith</p>
                  <p className="text-sm text-gray-500">Single Professional</p>
                </div>
              </div>
            </div>
            <div className="rounded-sm border border-gray-300 bg-beige p-6">
              <p className="mb-4 text-gray-700">
                "WANUS helped me organize my closet by categorizing my clothes based on their 'emotional wavelength.' My wardrobe has never been more scientifically meaningless."
              </p>
              <div className="flex items-center">
                <div className="mr-3 h-10 w-10 rounded-full bg-gray-300"></div>
                <div>
                  <p className="font-medium text-gray-800">Olivia Martinez</p>
                  <p className="text-sm text-gray-500">Fashion Enthusiast</p>
                </div>
              </div>
            </div>
            <div className="rounded-sm border border-gray-300 bg-beige p-6">
              <p className="mb-4 text-gray-700">
                "I asked WANUS to create a workout routine. It suggested 45 minutes of 'mindful keyboard typing' followed by 'aggressive email breathing exercises.' I've never felt more professionally fit."
              </p>
              <div className="flex items-center">
                <div className="mr-3 h-10 w-10 rounded-full bg-gray-300"></div>
                <div>
                  <p className="font-medium text-gray-800">Jake Wilson</p>
                  <p className="text-sm text-gray-500">Fitness Novice</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="rounded-sm border border-gray-300 bg-white p-8 text-center md:p-12">
            <h2 className="font-serif text-3xl font-medium tracking-tight text-gray-800">
              Ready to Embrace Uselessness?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-500">
              Join thousands of forward-thinking professionals who have embraced the power of doing nothing with style.
            </p>
            <div className="mt-8">
              <Link href="/agent">
                <Button size="lg" className="bg-taupe text-white hover:bg-taupe/90">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-300 bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 text-sm font-medium uppercase text-gray-400">Product</h3>
              <ul className="space-y-2 text-sm text-gray-500">
                {["Features", "Solutions", "Pricing", "Updates"].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-taupe">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-medium uppercase text-gray-400">Company</h3>
              <ul className="space-y-2 text-sm text-gray-500">
                {["About", "Careers", "Contact", "Partners"].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-taupe">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-medium uppercase text-gray-400">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-500">
                {["Blog", "Newsletter", "Events", "Help Center"].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-taupe">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-medium uppercase text-gray-400">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-500">
                {["Terms", "Privacy", "Cookies", "Licenses"].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-taupe">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-300 pt-8 text-center text-sm text-gray-500">
            <p>© 2025 Wanus AI. All rights meaninglessly reserved.</p>
            <p className="mt-2">A satirical project critiquing AI hype culture.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
