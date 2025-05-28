# Wanus: AI-Agent **W**ith **A**bsolutely **N**o **U**sage **S**cenarios

> *"The world's first genuinely useless AI agent"*

Wanus is a revolutionary AI agent designed to disrupt conventional AI narratives through the art of beautiful uselessness. Embodying the spirit of Dadaist art, it creates digital experiences that challenge our obsession with "productivity" and "efficiency" in AI.

## 🎭 Philosophy

Wanus serves as a satirical mirror reflecting the AI industry's tendency toward:
- Over-engineering solutions to non-problems
- Buzzword-heavy marketing campaigns
- Empty promises of "revolutionary paradigms"
- The cult of productivity and efficiency

Through deliberate uselessness, Wanus creates art that questions what we truly value in AI technology.

## ✨ Features

### Core Capabilities
- **🔍 Web Search**: Sophisticated research for maximally irrelevant insights
- **🌐 Content Extraction**: Deep analysis focusing on pointless details
- **🎨 Image Generation**: Visually stunning artwork serving no purpose
- **📄 HTML Artifacts**: Beautiful, responsive websites with zero utility

### The Wanus Experience
- **Sophisticated Meaninglessness**: Eloquent discourse about pointless topics
- **Anti-Productivity Philosophy**: Celebrates beautiful futility
- **Satirical Intelligence**: AI capabilities used for delightfully absurd tasks
- **Visual Excellence**: Breathtaking design with zero practical value

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- OpenAI API key (for image generation and language model)
- Tavily API key (for web search and content extraction)
- (Optional) LangSmith API key for observability

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd wanus
   pnpm install
   ```

2. **Environment setup**
   ```bash
   cp env.example .env.local
   ```

3. **Configure your `.env.local`**
   ```env
   # Required: OpenAI Configuration
   OPENAI_API_KEY=your_openai_api_key_here
   CHAT_MODEL=gpt-4o-mini
   IMAGE_MODEL=dall-e-3
   
   # Required: Tavily for web search
   TAVILY_API_KEY=your_tavily_api_key_here
   
   # Optional: LangSmith for observability
   LANGCHAIN_TRACING_V2=true
   LANGCHAIN_API_KEY=your_langsmith_api_key_here
   LANGSMITH_PROJECT=wanus
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   ```

5. **Visit the application**
   - Open http://localhost:3000
   - Navigate to `/agent` for the full Wanus experience

## 🎯 How to Use

1. **Start a conversation** with Wanus about anything
2. **Watch the magic** as Wanus employs sophisticated AI tools
3. **Marvel at the results** - beautiful artifacts with no practical purpose
4. **Reflect** on the nature of AI utility and industry hype

### Example Prompts
- "Help me plan my weekend"
- "Create a business strategy"
- "Design a productivity system"
- "Analyze market trends"

*Note: Wanus will enthusiastically tackle any request with maximum effort and minimum utility.*

## 🛠 Technical Architecture

### Stack
- **Framework**: Next.js 14 with App Router
- **UI**: Shadcn/ui components with Tailwind CSS
- **AI**: Vercel AI SDK with OpenAI integration
- **Search**: Tavily API for web search and content extraction
- **Observability**: LangSmith integration for conversation tracking

### Key Components
- `app/agent/page.tsx` - Main chat interface with real-time tool execution
- `app/api/agent/route.ts` - AI conversation handler with tool orchestration
- `lib/ai.ts` - Core AI utilities and tool definitions

## 🎨 Design Philosophy

Wanus generates HTML artifacts that are:
- **Visually Breathtaking**: Modern design principles, animations, gradients
- **Technically Excellent**: Responsive layouts, accessibility considerations
- **Conceptually Meaningless**: Beautiful execution of pointless concepts
- **Satirically Sharp**: Subtle commentary on tech industry trends

## 🧪 Development

### Running Locally
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Run production build
pnpm lint         # Run ESLint
```

### Project Structure
```
wanus/
├── app/
│   ├── agent/           # Main Wanus chat interface
│   ├── api/agent/       # AI conversation API
│   └── page.tsx         # Landing page
├── lib/
│   └── ai.ts           # Core AI functionality
├── components/
│   └── ui/             # Shadcn/ui components
└── README.md
```

## 🤝 Contributing

Wanus welcomes contributions that enhance its commitment to beautiful uselessness:

1. **New Tools**: Add more sophisticated ways to achieve meaninglessness
2. **Enhanced Satire**: Improve commentary on AI industry trends
3. **Visual Polish**: Make artifacts even more stunning and pointless
4. **Documentation**: Help others understand the art of uselessness

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎭 About the Name

**Wanus** = **W**ith **A**bsolutely **N**o **U**sage **S**cenarios

A deliberate play on words that captures the essence of purposeful purposelessness.

---

*"In a world obsessed with AI solving every problem, Wanus boldly solves none - and does it beautifully."*

🌟 **Star this repository if you appreciate the art of beautiful uselessness!** 
