# Wanus Database Schema

This directory contains the Prisma schema and database utilities for the Wanus AI agent application.

## Database Schema Overview

The database is designed to support the core Wanus features:

### Core Models

- **Users** - User accounts and profiles
- **Sessions** - Anonymous and authenticated user sessions
- **Conversations** - Chat conversations between users and Wanus
- **Messages** - Individual messages within conversations
- **ToolCalls** - AI tool usage tracking (web search, image generation, etc.)
- **Artifacts** - Generated HTML/content artifacts with versioning
- **Tags** - Categorization system for artifacts
- **Analytics** - Event tracking for usage insights

### Key Features

- **Anonymous Sessions**: Users can interact without registration
- **Artifact Versioning**: Track changes to generated content
- **Tool Usage Tracking**: Monitor AI tool performance and usage
- **Tagging System**: Categorize artifacts (useless, beautiful, satirical, etc.)
- **Analytics**: Track user behavior and system performance

## Setup Instructions

### 1. Environment Configuration

Make sure your `.env` file contains the Neon Postgres connection string:

```env
DATABASE_URL="postgresql://username:password@your-neon-host/database?sslmode=require"
```

### 2. Generate Prisma Client

```bash
pnpm db:generate
```

### 3. Push Schema to Database

```bash
pnpm db:push
```

### 4. Seed Initial Data

```bash
pnpm db:seed
```

This will create:
- Initial tags (useless, beautiful, satirical, etc.)
- Demo session and conversation
- Sample artifact ("Waste of Time Calculator")

### 5. Open Database Studio (Optional)

```bash
pnpm db:studio
```

## Usage Examples

### Creating a Conversation

```typescript
import { createSession, createConversation, createMessage } from '@/lib/db'

// Create anonymous session
const session = await createSession()

// Start conversation
const conversation = await createConversation(session.sessionId, "My Philosophical Journey")

// Add user message
await createMessage(conversation.id, 'USER', "What is the meaning of beautiful uselessness?")
```

### Tracking Tool Usage

```typescript
import { createToolCall, updateToolCall } from '@/lib/db'

// Start tool execution
const toolCall = await createToolCall(messageId, 'web_search', { query: 'productivity tips' })

// Update with results
await updateToolCall(toolCall.id, 
  { results: "Found 10000 ways to be more productive" }, 
  'COMPLETED', 
  1500 // duration in ms
)
```

### Creating Artifacts

```typescript
import { createArtifact } from '@/lib/db'

const artifact = await createArtifact(
  "Pointless Productivity Dashboard",
  'HTML',
  htmlContent,
  messageId,
  userId,
  "A beautiful dashboard that tracks nothing useful"
)
```

## Database Scripts

- `pnpm db:generate` - Generate Prisma client
- `pnpm db:push` - Push schema changes to database
- `pnpm db:studio` - Open Prisma Studio
- `pnpm db:reset` - Reset database (⚠️ destroys all data)
- `pnpm db:seed` - Populate with initial data

## Schema Highlights

### Message & Tool Tracking
Every AI interaction is tracked with detailed metadata about:
- Model used (GPT-4o-mini, DALL-E, etc.)
- Token usage
- Tool execution time
- Success/failure status

### Artifact Management
Generated content is stored with:
- Version history
- View counts
- Public/private visibility
- Categorical tags
- Rich metadata

### Analytics
Comprehensive event tracking for:
- Conversation patterns
- Tool usage metrics
- Artifact popularity
- User engagement

This design perfectly captures the essence of Wanus - creating beautiful, tracked, and categorized uselessness! 🎭 
