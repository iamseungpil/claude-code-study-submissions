# UIGen

Describe a React component in plain English, get working code with live preview instantly. Built with Claude AI.

## Quick Start

```bash
# Set your API key (optional - runs with mock data without it)
echo "ANTHROPIC_API_KEY=your-key" > .env

# Install and setup
npm run setup

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Features

- Chat-based component generation powered by Claude
- Real-time live preview in browser
- Monaco code editor with syntax highlighting
- Virtual file system (nothing written to disk)
- Project persistence for registered users

## Tech Stack

Next.js 15 • React 19 • TypeScript • Tailwind CSS v4 • Prisma/SQLite • Vercel AI SDK
