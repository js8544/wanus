import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create initial tags
  const tags = [
    { name: 'useless', color: '#ef4444' },
    { name: 'beautiful', color: '#06b6d4' },
    { name: 'satirical', color: '#8b5cf6' },
    { name: 'absurd', color: '#f59e0b' },
    { name: 'artistic', color: '#10b981' },
    { name: 'meaningless', color: '#ec4899' },
    { name: 'productivity', color: '#6366f1' },
    { name: 'ai-generated', color: '#84cc16' },
  ]

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { name: tag.name },
      update: {},
      create: tag,
    })
  }

  console.log('✅ Created initial tags')

  // Create a sample session for demo purposes
  const demoSession = await prisma.session.upsert({
    where: { sessionId: 'demo-session' },
    update: {},
    create: {
      sessionId: 'demo-session',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  })

  console.log('✅ Created demo session')

  // Create a sample conversation
  const demoConversation = await prisma.conversation.upsert({
    where: { id: 'demo-conversation' },
    update: {},
    create: {
      id: 'demo-conversation',
      title: 'Welcome to Wanus - The Art of Beautiful Uselessness',
      sessionId: demoSession.id,
    },
  })

  console.log('✅ Created demo conversation')

  // Create sample messages
  await prisma.message.upsert({
    where: { id: 'demo-message-1' },
    update: {},
    create: {
      id: 'demo-message-1',
      conversationId: demoConversation.id,
      role: 'USER',
      content: 'Help me understand the philosophy of beautiful uselessness',
    },
  })

  await prisma.message.upsert({
    where: { id: 'demo-message-2' },
    update: {},
    create: {
      id: 'demo-message-2',
      conversationId: demoConversation.id,
      role: 'ASSISTANT',
      content: 'Ah, what a delightfully profound inquiry! The philosophy of beautiful uselessness is the art of creating something so aesthetically magnificent yet functionally pointless that it challenges our very notion of value and purpose...',
      metadata: {
        model: 'gpt-4o-mini',
        tokens: 150,
      },
    },
  })

  console.log('✅ Created demo messages')

  // Create a sample artifact
  const wasteOfTimeCalculator = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Waste of Time Calculator</title>
    <style>
        body {
            font-family: 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
        }
        .calculator {
            background: white;
            padding: 2rem;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 400px;
        }
        .title {
            color: #667eea;
            margin-bottom: 1rem;
            font-size: 1.5rem;
        }
        input[type="number"] {
            width: 100%;
            padding: 1rem;
            border: 2px solid #eee;
            border-radius: 10px;
            margin: 0.5rem 0;
            font-size: 1rem;
        }
        .result {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 10px;
            margin-top: 1rem;
            font-weight: bold;
            color: #667eea;
        }
    </style>
</head>
<body>
    <div class="calculator">
        <h1 class="title">🕰️ Waste of Time Calculator</h1>
        <p>Calculate exactly how much time you're wasting by using this calculator!</p>
        <input type="number" id="minutes" placeholder="Minutes you've been here" value="5">
        <div class="result" id="result">
            You've wasted exactly 5 minutes of your precious life using this beautifully pointless calculator!
        </div>
    </div>
    <script>
        document.getElementById('minutes').addEventListener('input', function() {
            const minutes = this.value || 0;
            document.getElementById('result').textContent = 
                \`You've wasted exactly \${minutes} minutes of your precious life using this beautifully pointless calculator!\`;
        });
    </script>
</body>
</html>
  `.trim()

  const demoArtifact = await prisma.artifact.upsert({
    where: { id: 'demo-artifact-1' },
    update: {},
    create: {
      id: 'demo-artifact-1',
      title: 'Waste of Time Calculator',
      description: 'A beautifully designed calculator that helps you calculate exactly how much time you\'re wasting by using it',
      type: 'HTML',
      content: wasteOfTimeCalculator,
      messageId: 'demo-message-2',
      isPublic: true,
      metadata: {
        purpose: 'satirical',
        irony_level: 'maximum',
        beauty_score: 10,
        utility_score: 0,
      },
    },
  })

  console.log('✅ Created demo artifact')

  // Add tags to the demo artifact
  const uselessTag = await prisma.tag.findUnique({ where: { name: 'useless' } })
  const beautifulTag = await prisma.tag.findUnique({ where: { name: 'beautiful' } })
  const satiricalTag = await prisma.tag.findUnique({ where: { name: 'satirical' } })

  if (uselessTag && beautifulTag && satiricalTag) {
    await prisma.artifactTag.createMany({
      data: [
        { artifactId: demoArtifact.id, tagId: uselessTag.id },
        { artifactId: demoArtifact.id, tagId: beautifulTag.id },
        { artifactId: demoArtifact.id, tagId: satiricalTag.id },
      ],
      skipDuplicates: true,
    })
  }

  console.log('✅ Added tags to demo artifact')

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 
