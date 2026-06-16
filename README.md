# JobTracker

A personal job application tracker built with Next.js and Supabase. Keep track of every application, interview round, and contact in one place.

## Features

- Add and manage job applications with status tracking (Saved, Applied, Interview, Offer, Rejected, Withdrawn)
- Record interview rounds, contacts, and application packages per job
- Search, filter, and sort your applications
- Dashboard with stats and charts (applications by month, rejection analysis, salary ranges)
- AI-powered cover letter generator and interview prep coach (via Groq)
- Weekly email digest (via Resend)
- Multi-user — each account sees only their own data

## Tech Stack

- **Framework:** Next.js 16 (App Router, Server Actions)
- **Database & Auth:** Supabase (PostgreSQL + Row Level Security)
- **Styling:** Tailwind CSS
- **AI:** Groq SDK
- **Email:** Resend
- **Charts:** Recharts

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/AchrafBoudabous/job-tracker.git
cd job-tracker
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
RESEND_API_KEY=your_resend_api_key
API_SECRET=any_random_secret_string
```

### 3. Set up the database

Run the SQL migrations in your Supabase SQL Editor to create the `jobs`, `interview_rounds`, `contacts`, and `application_packages` tables with Row Level Security enabled.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and create an account.

## Deployment

Deployed on Vercel. Connect the repo and add the same environment variables in the Vercel project settings.
