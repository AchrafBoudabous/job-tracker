# job-tracker

Personal job application tracker built with Next.js 16, Supabase, and Groq AI.

## Stack

- **Framework**: Next.js 16.2 (App Router, Server Actions, Turbopack)
- **Database**: Supabase (PostgreSQL + RLS)
- **AI**: Groq API (`llama-3.3-70b-versatile`) — cover letter generator, interview prep coach
- **Email**: Resend — weekly digest
- **Charts**: Recharts
- **Styling**: Tailwind CSS v4

## Features

- Track applications with status, salary, location, follow-up dates
- Interview rounds, contacts, and application packages per job
- AI cover letter generator and interview prep coach (streamed)
- Weekly goal tracker with streak and sparkline
- Milestone badges, rejection pattern analyzer, salary intelligence
- Ghosting detector (flags jobs with no activity for 14+ days)
- Email digest with pipeline summary and follow-ups

## Setup

**1. Install dependencies**
```bash
npm install
```

**2. Create `.env.local`**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
RESEND_API_KEY=your_resend_api_key
DIGEST_EMAIL=your@email.com
API_SECRET=random_secret_string
```

**3. Run the database schema**

Run `supabase/schema.sql` in the Supabase SQL Editor.

**4. Start the dev server**
```bash
npm run dev
```

## Deployment

Deploy on Vercel. Set the same environment variables in the Vercel project settings. Each push to `main` triggers an automatic redeploy.

## API Routes

| Endpoint | Method | Description |
|---|---|---|
| `/api/ai/cover-letter` | POST | Generate cover letter via Groq |
| `/api/ai/interview-prep` | POST | Generate interview prep guide via Groq |
| `/api/email/digest` | POST | Send weekly digest email via Resend |

All API routes are origin-guarded. External requests require `Authorization: Bearer <API_SECRET>`.
