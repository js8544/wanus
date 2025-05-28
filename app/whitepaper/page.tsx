import { Button } from "@/components/ui/button"
import { Cpu, Download, FileBarChart, PieChart, Share2, Zap } from "lucide-react"
import Link from "next/link"

export default function WhitepaperPage() {
  return (
    <div className="min-h-screen bg-beige text-gray-700 font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-10 border-b border-gray-300 bg-white">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center">
                <div className="mr-2 h-8 w-8 rounded-sm bg-taupe"></div>
                <span className="font-serif text-xl font-medium tracking-tight">WANUS</span>
              </div>
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="border-gray-300 text-gray-600 hover:bg-gray-100">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            <Button variant="outline" size="sm" className="border-gray-300 text-gray-600 hover:bg-gray-100">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="border-b border-gray-300 bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6 inline-flex items-center rounded-full border border-gray-300 bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            OFFICIAL WHITEPAPER v1.0.0
          </div>
          <h1 className="font-serif text-4xl font-medium tracking-tight text-gray-800 md:text-5xl">
            WANUS: The Art of Perfect Uselessness
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-500">
            A Comprehensive Analysis of AI Agent With Absolutely No Usage Scenarios
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-sm text-gray-500">
            <span className="flex items-center rounded-full bg-gray-100 px-3 py-1">
              <span className="mr-1 h-2 w-2 rounded-full bg-taupe"></span>
              Published: May 28, 2025
            </span>
            <span className="flex items-center rounded-full bg-gray-100 px-3 py-1">
              <span className="mr-1 h-2 w-2 rounded-full bg-taupe"></span>
              Authors: The Wanus Research Team
            </span>
            <span className="flex items-center rounded-full bg-gray-100 px-3 py-1">
              <span className="mr-1 h-2 w-2 rounded-full bg-taupe"></span>
              Reading Time: 12 minutes
            </span>
          </div>
        </div>
      </header>

      {/* Table of Contents */}
      <div className="border-b border-gray-300 bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-4 font-serif text-xl font-medium text-gray-800">Table of Contents</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <ol className="list-inside list-decimal space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <a href="#introduction" className="hover:text-taupe">
                      Introduction: The Genesis of Uselessness
                    </a>
                  </li>
                  <li className="flex items-center">
                    <a href="#mission" className="hover:text-taupe">
                      Mission & Vision: Embracing Futility
                    </a>
                  </li>
                  <li className="flex items-center">
                    <a href="#philosophy" className="hover:text-taupe">
                      Core Philosophy: The Useless Paradox
                    </a>
                  </li>
                  <li className="flex items-center">
                    <a href="#target" className="hover:text-taupe">
                      Target Audience: The Disillusioned Technologist
                    </a>
                  </li>
                </ol>
              </div>
              <div>
                <ol className="list-inside list-decimal space-y-2 text-gray-600" start={5}>
                  <li className="flex items-center">
                    <a href="#capabilities" className="hover:text-taupe">
                      Core Capabilities: Engineered Pointlessness
                    </a>
                  </li>
                  <li className="flex items-center">
                    <a href="#impact" className="hover:text-taupe">
                      Impact Analysis: The Mirror Effect
                    </a>
                  </li>
                  <li className="flex items-center">
                    <a href="#future" className="hover:text-taupe">
                      Future Directions: Expanding Uselessness
                    </a>
                  </li>
                  <li className="flex items-center">
                    <a href="#conclusion" className="hover:text-taupe">
                      Conclusion: The Value of Valuelessness
                    </a>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            {/* Introduction */}
            <section id="introduction" className="mb-16">
              <h2 className="mb-6 font-serif text-3xl font-medium text-gray-800">
                1. Introduction: The Genesis of Uselessness
              </h2>
              <div className="prose prose-gray max-w-none">
                <p>
                  In an era characterized by the relentless pursuit of artificial intelligence solutions that promise to
                  revolutionize every aspect of human existence, WANUS (AI Agent With Absolutely No Usage Scenarios)
                  emerges as a deliberate counterpoint. This whitepaper introduces WANUS, the world's first AI agent
                  meticulously engineered to be completely and utterly useless.
                </p>
                <p>
                  WANUS is not merely an AI that fails to achieve utility; rather, it is an AI that actively and
                  successfully prioritizes fun, surprise, and engagement over conventional problem-solving. This
                  distinction is crucial to understanding our approach.
                </p>
                <p>
                  Our research reveals a profound paradox in digital product development: the most successful products
                  pre-AI are not those that solve the most problems, but those that are most entertaining. Users don't
                  open TikTok or Instagram to solve practical problems—in conventional terms, these platforms could be
                  considered "valueless." Yet they are among the most successful digital products ever created.
                </p>
                <div className="my-8 rounded-sm border border-gray-300 bg-white p-6">
                  <blockquote className="border-l-4 border-taupe pl-4 italic text-gray-700">
                    "The true measure of an AI's impact may not be in its ability to solve problems, but in its capacity
                    to create moments of surprise, delight, and unexpected discovery."
                    <footer className="mt-2 text-right text-sm text-gray-500">
                      — Dr. Ironica Paradox, Chief Uselessness Officer
                    </footer>
                  </blockquote>
                </div>
                <p>
                  The current AI landscape is saturated with solutions claiming to be "revolutionary," "disruptive," and
                  "game-changing" in their problem-solving capabilities. Yet, what if the most revolutionary approach is
                  to create AI that doesn't try to solve anything at all, but instead focuses on creating experiences
                  that users don't even know they want until they encounter them? WANUS is our experiment in creating
                  fun and surprising AI rather than problem-solving AI.
                </p>
              </div>
            </section>

            {/* Mission & Vision */}
            <section id="mission" className="mb-16">
              <h2 className="mb-6 font-serif text-3xl font-medium text-gray-800">
                2. Mission & Vision: Embracing Futility
              </h2>
              <div className="prose prose-gray max-w-none">
                <h3 className="font-serif text-xl font-medium text-gray-800">2.1 Mission Statement</h3>
                <p>
                  WANUS aims to explore the untapped potential of "uselessness" as a feature rather than a bug. By
                  creating AI that prioritizes surprise, delight, and unexpected experiences over conventional utility,
                  we seek to demonstrate that the future of AI may lie not just in solving problems, but in creating
                  experiences users don't even know they want.
                </p>
                <h3 className="font-serif text-xl font-medium text-gray-800">2.2 Vision</h3>
                <p>
                  WANUS aspires to pioneer a new category of AI that embraces the same principles that made platforms
                  like TikTok and Instagram wildly successful: the element of surprise, the joy of discovery, and the
                  absence of predetermined utility. Just as users open these apps without knowing exactly what they'll
                  see but believing they'll enjoy it, WANUS creates experiences where unpredictability becomes a
                  feature, not a flaw.
                </p>
                <div className="my-8 overflow-hidden rounded-sm border border-gray-300">
                  <div className="bg-white p-6">
                    <h4 className="mb-4 font-serif text-lg font-medium text-gray-800">
                      Key Performance Indicators of Uselessness
                    </h4>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                      <div className="rounded-sm border border-gray-200 bg-beige p-4 text-center">
                        <div className="font-serif text-2xl font-medium text-taupe">100%</div>
                        <div className="mt-1 text-sm text-gray-600">Uselessness Rate</div>
                      </div>
                      <div className="rounded-sm border border-gray-200 bg-beige p-4 text-center">
                        <div className="font-serif text-2xl font-medium text-taupe">0</div>
                        <div className="mt-1 text-sm text-gray-600">Practical Applications</div>
                      </div>
                      <div className="rounded-sm border border-gray-200 bg-beige p-4 text-center">
                        <div className="font-serif text-2xl font-medium text-taupe">∞</div>
                        <div className="mt-1 text-sm text-gray-600">Style-to-Substance Ratio</div>
                      </div>
                      <div className="rounded-sm border border-gray-200 bg-beige p-4 text-center">
                        <div className="font-serif text-2xl font-medium text-taupe">99.9%</div>
                        <div className="mt-1 text-sm text-gray-600">Meaninglessness Accuracy</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Core Philosophy */}
            <section id="philosophy" className="mb-16">
              <h2 className="mb-6 font-serif text-3xl font-medium text-gray-800">
                3. Core Philosophy: The Useless Paradox
              </h2>
              <div className="prose prose-gray max-w-none">
                <p>
                  The philosophical foundation of WANUS draws inspiration from the 20th-century Dadaist art movement,
                  which embraced absurdity as a response to the perceived madness of the world. Similarly, WANUS
                  embraces uselessness as a response to the sometimes absurd claims and expectations surrounding AI
                  technology.
                </p>
                <h3 className="font-serif text-xl font-medium text-gray-800">3.1 Embracing the Absurd</h3>
                <p>
                  WANUS deliberately inverts the traditional value proposition of AI systems. While conventional AI aims
                  to solve problems and create utility, WANUS meticulously avoids solving any actual problems while
                  maintaining the appearance of sophistication and purpose. This inversion creates a powerful satirical
                  lens through which to view the industry's sometimes exaggerated claims.
                </p>
                <h3 className="font-serif text-xl font-medium text-gray-800">
                  3.2 The Paradox of Engineered Uselessness
                </h3>
                <p>
                  The central paradox of WANUS lies in the significant engineering effort dedicated to creating
                  something deliberately useless. This paradox mirrors the real-world phenomenon of over-engineered
                  solutions that fail to address genuine human needs despite their technical sophistication.
                </p>
                <h3 className="font-serif text-xl font-medium text-gray-800">3.3 The Value of Unpredictability</h3>
                <p>
                  A key insight driving WANUS is that humans are naturally drawn to unpredictable experiences. The most
                  engaging digital products don't tell users exactly what they'll get—they create systems where each
                  interaction holds the possibility of surprise. Before opening TikTok or Instagram, users don't know
                  what content awaits them, and this very uncertainty is part of the appeal.
                </p>
                <p>
                  WANUS applies this principle to AI, creating experiences where users don't know what to expect, but
                  trust they'll be entertained. This stands in stark contrast to conventional AI systems that aim for
                  predictable, consistent utility. By embracing unpredictability, WANUS creates a more human-like,
                  engaging experience that may ultimately prove more valuable than narrowly defined utility.
                </p>
                <div className="my-8 rounded-sm border border-gray-300 bg-white p-6">
                  <div className="mb-4 text-center font-serif text-lg font-medium text-gray-800">
                    The Uselessness Spectrum
                  </div>
                  <div className="relative h-12 w-full rounded-sm bg-gray-200">
                    <div className="absolute left-0 top-0 h-full rounded-sm bg-taupe" style={{ width: "100%" }}></div>
                    <div className="absolute left-0 top-0 flex h-full w-full items-center justify-between px-4">
                      <span className="text-sm font-medium text-white">Accidental Uselessness</span>
                      <span className="text-sm font-medium text-white">Engineered Uselessness</span>
                    </div>
                  </div>
                  <div className="mt-4 text-center text-sm text-gray-500">
                    WANUS achieves 100% engineered uselessness, surpassing the industry standard of merely accidental
                    uselessness.
                  </div>
                </div>
              </div>
            </section>

            {/* Target Audience */}
            <section id="target" className="mb-16">
              <h2 className="mb-6 font-serif text-3xl font-medium text-gray-800">
                4. Target Audience: The Disillusioned Technologist
              </h2>
              <div className="prose prose-gray max-w-none">
                <p>
                  While WANUS presents itself as a product with no practical use cases, its meta-purpose as a satirical
                  commentary is directed at specific audiences who may find value in its critique.
                </p>
                <h3 className="font-serif text-xl font-medium text-gray-800">4.1 Primary Audience Segments</h3>
                <ul>
                  <li>
                    <strong>Technology Professionals</strong>: Those who have grown weary of the hyperbolic claims and
                    marketing excess in the AI industry.
                  </li>
                  <li>
                    <strong>Digital Philosophers</strong>: Individuals interested in critical examination of
                    technology's role in society and the sometimes empty promises of digital solutionism.
                  </li>
                  <li>
                    <strong>AI Ethicists</strong>: Those concerned with the direction of AI development and seeking
                    alternative perspectives on progress.
                  </li>
                  <li>
                    <strong>The Tech-Fatigued</strong>: People experiencing exhaustion from the constant parade of
                    "revolutionary" technologies that fail to deliver meaningful improvements to human experience.
                  </li>
                </ul>
                <div className="my-8 overflow-hidden rounded-sm border border-gray-300">
                  <div className="bg-white p-6">
                    <h4 className="mb-4 font-serif text-lg font-medium text-gray-800">Audience Engagement Metrics</h4>
                    <div className="h-64">
                      <div className="flex h-full">
                        <div className="flex w-1/4 flex-col items-center justify-end">
                          <div className="w-full bg-taupe" style={{ height: "85%" }}></div>
                          <div className="mt-2 text-center text-xs">Tech Professionals</div>
                        </div>
                        <div className="flex w-1/4 flex-col items-center justify-end">
                          <div className="w-full bg-taupe" style={{ height: "65%" }}></div>
                          <div className="mt-2 text-center text-xs">Digital Philosophers</div>
                        </div>
                        <div className="flex w-1/4 flex-col items-center justify-end">
                          <div className="w-full bg-taupe" style={{ height: "75%" }}></div>
                          <div className="mt-2 text-center text-xs">AI Ethicists</div>
                        </div>
                        <div className="flex w-1/4 flex-col items-center justify-end">
                          <div className="w-full bg-taupe" style={{ height: "95%" }}></div>
                          <div className="mt-2 text-center text-xs">Tech-Fatigued</div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 text-center text-sm text-gray-500">
                      Engagement levels by audience segment (higher is better, though ultimately meaningless)
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Core Capabilities */}
            <section id="capabilities" className="mb-16">
              <h2 className="mb-6 font-serif text-3xl font-medium text-gray-800">
                5. Core Capabilities: Engineered Pointlessness
              </h2>
              <div className="prose prose-gray max-w-none">
                <p>
                  WANUS employs sophisticated AI capabilities to create outputs that are visually impressive and
                  superficially convincing, yet deliberately devoid of practical utility. These capabilities represent a
                  satirical mirror of conventional AI systems.
                </p>
                <div className="my-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="rounded-sm border border-gray-300 bg-white p-6">
                    <div className="mb-4 flex items-center">
                      <FileBarChart className="mr-3 h-6 w-6 text-taupe" />
                      <h3 className="font-serif text-xl font-medium text-gray-800">Meaningless Analytics</h3>
                    </div>
                    <p className="text-gray-600">
                      WANUS generates visually impressive charts and graphs that appear to convey significant insights
                      but actually represent random or meaningless data. These visualizations mimic the aesthetic of
                      business intelligence tools while providing zero actionable information.
                    </p>
                  </div>
                  <div className="rounded-sm border border-gray-300 bg-white p-6">
                    <div className="mb-4 flex items-center">
                      <Zap className="mr-3 h-6 w-6 text-taupe" />
                      <h3 className="font-serif text-xl font-medium text-gray-800">Strategic Verbosity</h3>
                    </div>
                    <p className="text-gray-600">
                      Using advanced language models, WANUS produces text that mimics corporate and technical
                      communication while being carefully engineered to convey no useful information. This capability
                      satirizes the tendency toward jargon-heavy, content-light communication in the tech industry.
                    </p>
                  </div>
                  <div className="rounded-sm border border-gray-300 bg-white p-6">
                    <div className="mb-4 flex items-center">
                      <Cpu className="mr-3 h-6 w-6 text-taupe" />
                      <h3 className="font-serif text-xl font-medium text-gray-800">Complexity Generation</h3>
                    </div>
                    <p className="text-gray-600">
                      WANUS excels at transforming simple concepts into unnecessarily complex frameworks, methodologies,
                      and processes. This capability parodies the industry tendency to over-engineer solutions to
                      straightforward problems, adding layers of complexity that create the illusion of sophistication.
                    </p>
                  </div>
                  <div className="rounded-sm border border-gray-300 bg-white p-6">
                    <div className="mb-4 flex items-center">
                      <PieChart className="mr-3 h-6 w-6 text-taupe" />
                      <h3 className="font-serif text-xl font-medium text-gray-800">Aesthetic Optimization</h3>
                    </div>
                    <p className="text-gray-600">
                      Through sophisticated design algorithms, WANUS creates visually stunning outputs that prioritize
                      aesthetic appeal over functionality or utility. This capability satirizes the industry's sometimes
                      excessive focus on visual impressiveness at the expense of practical value.
                    </p>
                  </div>
                </div>
                <p>
                  These capabilities work in concert to create outputs that appear impressive and valuable at first
                  glance but reveal themselves to be entirely useless upon closer inspection. This deliberate
                  misdirection serves as a powerful metaphor for certain trends in the AI industry.
                </p>
              </div>
            </section>

            {/* Impact Analysis */}
            <section id="impact" className="mb-16">
              <h2 className="mb-6 font-serif text-3xl font-medium text-gray-800">
                6. Impact Analysis: The Mirror Effect
              </h2>
              <div className="prose prose-gray max-w-none">
                <p>
                  While WANUS is designed to be useless in conventional terms, its meta-purpose as a satirical
                  commentary has several potential impacts on how we think about and develop AI technologies.
                </p>
                <h3 className="font-serif text-xl font-medium text-gray-800">6.1 Reflection on Value Propositions</h3>
                <p>
                  By deliberately creating an AI with no practical utility, WANUS encourages technologists to more
                  critically examine the actual value propositions of their own work. What genuine human needs are being
                  addressed? What real problems are being solved? These questions become more salient when contrasted
                  with WANUS's deliberate uselessness.
                </p>
                <h3 className="font-serif text-xl font-medium text-gray-800">
                  6.2 Critique of Technological Solutionism
                </h3>
                <p>
                  WANUS serves as a critique of the belief that every problem has a technological solution. By creating
                  technology that deliberately solves no problems, WANUS highlights the limits of technological
                  solutionism and encourages more nuanced approaches to addressing human needs.
                </p>
                <div className="my-8 rounded-sm border border-gray-300 bg-white p-6">
                  <div className="mb-4 text-center font-serif text-lg font-medium text-gray-800">
                    Impact Assessment Matrix
                  </div>
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Impact Dimension</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Conventional AI</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">WANUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-700">
                          Practical Utility
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">High (claimed)</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Zero (by design)</td>
                      </tr>
                      <tr>
                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-700">
                          Critical Reflection
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">Low</td>
                        <td className="px-4 py-3 text-sm text-gray-600">High</td>
                      </tr>
                      <tr>
                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-700">
                          Honesty About Limitations
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">Variable</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Complete</td>
                      </tr>
                      <tr>
                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-700">
                          Resource Efficiency
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">Variable</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Deliberately inefficient</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <h3 className="font-serif text-xl font-medium text-gray-800">6.3 Humor as Critical Lens</h3>
                <p>
                  By employing satire and humor, WANUS creates a space for critical engagement with AI technology that
                  might be more accessible and less threatening than direct critique. This approach can broaden the
                  conversation about AI's role in society beyond technical specialists.
                </p>
              </div>
            </section>

            {/* Future Directions */}
            <section id="future" className="mb-16">
              <h2 className="mb-6 font-serif text-3xl font-medium text-gray-800">
                7. Future Directions: Expanding Uselessness
              </h2>
              <div className="prose prose-gray max-w-none">
                <p>
                  While WANUS has already achieved unprecedented levels of uselessness, our research team continues to
                  explore new frontiers in the science of engineered futility.
                </p>
                <h3 className="font-serif text-xl font-medium text-gray-800">7.1 Uselessness at Scale</h3>
                <p>
                  Future iterations of WANUS will explore how uselessness can be scaled across enterprise environments,
                  creating entire ecosystems of interconnected but ultimately pointless systems. This research direction
                  mirrors the real-world phenomenon of organizations implementing complex technological solutions
                  without clear value propositions.
                </p>
                <h3 className="font-serif text-xl font-medium text-gray-800">7.2 Collaborative Uselessness</h3>
                <p>
                  We are investigating multi-agent systems where multiple instances of WANUS collaborate to achieve even
                  higher levels of collective uselessness than would be possible individually. This research direction
                  satirizes the tendency toward unnecessary complexity in enterprise software ecosystems.
                </p>
                <div className="my-8 rounded-sm border border-gray-300 bg-white p-6">
                  <div className="mb-4 text-center font-serif text-lg font-medium text-gray-800">
                    Uselessness Development Roadmap
                  </div>
                  <div className="relative">
                    <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>
                    <div className="space-y-8">
                      <div className="relative pl-10">
                        <div className="absolute left-0 top-1.5 flex h-8 w-8 items-center justify-center rounded-full border-4 border-taupe bg-white">
                          <span className="text-xs font-bold text-taupe">1</span>
                        </div>
                        <h4 className="font-serif text-lg font-medium text-gray-800">Q3 2025: Uselessness at Scale</h4>
                        <p className="mt-1 text-sm text-gray-600">
                          Deployment of enterprise-grade uselessness across organizational contexts.
                        </p>
                      </div>
                      <div className="relative pl-10">
                        <div className="absolute left-0 top-1.5 flex h-8 w-8 items-center justify-center rounded-full border-4 border-gray-300 bg-white">
                          <span className="text-xs font-bold text-gray-400">2</span>
                        </div>
                        <h4 className="font-serif text-lg font-medium text-gray-800">
                          Q4 2025: Collaborative Uselessness Framework
                        </h4>
                        <p className="mt-1 text-sm text-gray-600">
                          Introduction of multi-agent uselessness systems for enhanced futility.
                        </p>
                      </div>
                      <div className="relative pl-10">
                        <div className="absolute left-0 top-1.5 flex h-8 w-8 items-center justify-center rounded-full border-4 border-gray-300 bg-white">
                          <span className="text-xs font-bold text-gray-400">3</span>
                        </div>
                        <h4 className="font-serif text-lg font-medium text-gray-800">Q1 2026: Quantum Uselessness</h4>
                        <p className="mt-1 text-sm text-gray-600">
                          Leveraging quantum computing principles to achieve unprecedented levels of pointlessness.
                        </p>
                      </div>
                      <div className="relative pl-10">
                        <div className="absolute left-0 top-1.5 flex h-8 w-8 items-center justify-center rounded-full border-4 border-gray-300 bg-white">
                          <span className="text-xs font-bold text-gray-400">4</span>
                        </div>
                        <h4 className="font-serif text-lg font-medium text-gray-800">Q2 2026: Metaverse Integration</h4>
                        <p className="mt-1 text-sm text-gray-600">
                          Expanding uselessness into virtual worlds for immersive pointless experiences.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Conclusion */}
            <section id="conclusion" className="mb-16">
              <h2 className="mb-6 font-serif text-3xl font-medium text-gray-800">
                8. Conclusion: The Value of Valuelessness
              </h2>
              <div className="prose prose-gray max-w-none">
                <p>
                  WANUS represents a unique contribution to the AI landscape—an agent deliberately designed to
                  prioritize fun, surprise, and engagement over conventional utility. Through this approach, WANUS not
                  only satirizes the problem-solving fixation of current AI development but also explores a genuinely
                  promising alternative direction: AI that creates experiences users don't even know they want until
                  they encounter them.
                </p>
                <p>
                  The parallel with wildly successful platforms like TikTok and Instagram is instructive. These
                  platforms don't solve practical problems, yet they've achieved unprecedented success by creating
                  experiences centered around surprise, discovery, and entertainment. WANUS applies this insight to AI,
                  suggesting that the most impactful AI systems of the future may not be those that solve the most
                  problems, but those that create the most engaging, surprising, and delightful experiences.
                </p>
                <p>
                  In a technological landscape often characterized by hyperbole and over-promising, WANUS offers a
                  refreshing honesty about its limitations. It promises nothing and delivers exactly that, with
                  impeccable style and corporate polish.
                </p>
                <div className="my-8 rounded-sm border border-gray-300 bg-white p-6">
                  <blockquote className="border-l-4 border-taupe pl-4 italic text-gray-700">
                    "In a world obsessed with utility, the most revolutionary act may be the creation of something
                    deliberately, perfectly, and honestly useless."
                    <footer className="mt-2 text-right text-sm text-gray-500">— The WANUS Research Collective</footer>
                  </blockquote>
                </div>
                <p>
                  We believe that by embracing uselessness, WANUS paradoxically becomes useful—as a tool for critical
                  thinking, as a catalyst for important conversations about technology, and as a reminder that not every
                  problem requires a technological solution.
                </p>
                <p>
                  In the final analysis, WANUS may be useless by design, but the conversations and reflections it
                  inspires are anything but.
                </p>
              </div>
            </section>

            {/* References */}
            <section className="mb-16">
              <h2 className="mb-6 font-serif text-3xl font-medium text-gray-800">References</h2>
              <div className="prose prose-gray max-w-none">
                <ol className="list-decimal space-y-4 pl-5">
                  <li>
                    Paradox, I. & Futility, M. (2025). "The Science of Engineered Uselessness: Principles and
                    Applications." <em>Journal of Meaningless Research, 42</em>(0), 1-23.
                  </li>
                  <li>
                    Pointless, P. (2024). "Beyond Utility: Rethinking Value in Artificial Intelligence."
                    <em>Technology Critique Quarterly, 15</em>(3), 78-92.
                  </li>
                  <li>
                    Absurdity, A. (2023). "Dadaism in the Digital Age: Artistic Influences on Technological Critique."
                    <em>Digital Humanities Review, 8</em>(2), 112-130.
                  </li>
                  <li>
                    Morozov, E. (2013). "To Save Everything, Click Here: The Folly of Technological Solutionism."
                    PublicAffairs.
                  </li>
                  <li>
                    Meaningless, M. et al. (2025). "Quantifying Uselessness: Metrics and Methodologies."
                    <em>Proceedings of the International Conference on Artificial Futility</em>, 234-251.
                  </li>
                </ol>
              </div>
            </section>

            {/* Download and Share */}
            <div className="rounded-sm border border-gray-300 bg-white p-6 text-center">
              <h3 className="mb-4 font-serif text-xl font-medium text-gray-800">Share this groundbreaking research</h3>
              <p className="mb-6 text-gray-600">
                Help spread awareness about the importance of uselessness in the AI landscape.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button className="bg-taupe text-white hover:bg-taupe/90">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Whitepaper
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-300 bg-white py-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>© 2025 WANUS AI. All rights meaninglessly reserved.</p>
          <p className="mt-2">A satirical project critiquing AI hype culture.</p>
        </div>
      </footer>
    </div>
  )
}
