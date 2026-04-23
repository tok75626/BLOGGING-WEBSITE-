# AIBlog Platform

A production-ready blogging platform powered by Next.js, Prisma, and OpenAI.

## Features
- 🤖 **AI-Assisted Drafting**: Generate titles, content, summaries, and tags.
- 🔐 **Secure Auth**: JWT access/refresh tokens with HTTP-only cookies.
- 📝 **Markdown Editor**: Rich text experience with live preview.
- 🎨 **Premium UI**: Modern dark/light aesthetics with Tailwind CSS.
- 📊 **Creator Dashboard**: Manage your posts and view stats.

## Getting Started

### 1. Prerequisites
- Node.js 18+
- PostgreSQL database

### 2. Environment Setup
Copy `.env.example` to `.env` and fill in your details:
```bash
cp .env.example .env
```
Key requirements:
- `DATABASE_URL`
- `OPENAI_API_KEY`
- `JWT_ACCESS_SECRET` & `JWT_REFRESH_SECRET`

### 3. Installation
```bash
npm install
```

### 4. Database Setup
```bash
npx prisma generate
npx prisma db push
```

### 5. Run Development Server
```bash
npm run dev
```

## API Examples

### Register a User
```bash
curl -X POST http://localhost:3000/api/auth/register \
-H "Content-Type: application/json" \
-d '{"email": "test@example.com", "password": "password123", "name": "Test User"}'
```

### Generate AI Content (Requires Auth Cookie)
```bash
curl -X POST http://localhost:3000/api/ai/content \
-H "Content-Type: application/json" \
-d '{"topic": "The future of AI", "tone": "professional", "length": "short"}'
```

---
Built with love by Antigravity.
