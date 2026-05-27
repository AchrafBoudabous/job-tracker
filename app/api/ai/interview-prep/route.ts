import Groq from 'groq-sdk'
import { createClient } from '@/lib/supabase/server'
import { isAuthorized } from '@/lib/api-guard'
import { checkRateLimit } from '@/lib/rate-limit'

const RATE_LIMIT = 10
const RATE_WINDOW_MS = 60_000

export async function POST(request: Request) {
  // Instantiated inside the handler so it only runs at request time,
  // not at build time when env vars are unavailable.
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY })
  if (!(await isAuthorized(request))) {
    return new Response('Unauthorized', { status: 401 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const rateLimitKey = `interview-prep:${user?.id ?? 'service'}`

  if (!checkRateLimit(rateLimitKey, RATE_LIMIT, RATE_WINDOW_MS)) {
    return new Response('Too Many Requests — please wait a moment before generating another prep guide.', {
      status: 429,
      headers: { 'Retry-After': '60' },
    })
  }

  let body: { role?: unknown; company?: unknown; interviewRounds?: unknown; notes?: unknown }
  try {
    body = await request.json()
  } catch {
    return new Response('Invalid JSON body', { status: 400 })
  }

  const role    = typeof body.role    === 'string' ? body.role.slice(0, 200)    : ''
  const company = typeof body.company === 'string' ? body.company.slice(0, 200) : ''

  if (!role || !company) {
    return new Response('role and company are required', { status: 400 })
  }

  const notes = typeof body.notes === 'string' ? body.notes.slice(0, 5_000) : ''

  const interviewRounds = Array.isArray(body.interviewRounds)
    ? (body.interviewRounds as unknown[]).slice(0, 20) 
    : []

  const roundsSummary = interviewRounds.length
    ? interviewRounds
        .map((r) => {
          if (typeof r !== 'object' || r === null) return ''
          const round = r as Record<string, unknown>
          const num  = typeof round.round_number   === 'number' ? round.round_number : '?'
          const type = typeof round.interview_type === 'string' ? ` (${round.interview_type.slice(0, 100)})` : ''
          const note = typeof round.notes          === 'string' ? round.notes.slice(0, 500) : 'no notes'
          return `- Round ${num}${type}: ${note}`
        })
        .filter(Boolean)
        .join('\n')
    : 'No interview rounds recorded yet'

  const prompt = `You are an expert interview coach. Generate targeted interview preparation for this job application.

Role: ${role}
Company: ${company}${notes ? `\nApplication notes: ${notes}` : ''}

Interview history:
${roundsSummary}

Provide:
1. **5-7 likely interview questions** tailored to this specific role — include behavioral, situational, and role-specific questions
2. For each question, a short tip on how to approach the answer (1-2 sentences)
3. **2-3 technical/skill topics** to review (if relevant)
4. **3 smart questions to ask** the interviewer

Be specific and practical. Use the exact role title and company name where relevant.`

  const stream = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    stream: true,
    max_tokens: 1500,
  })

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content ?? ''
        if (text) controller.enqueue(new TextEncoder().encode(text))
      }
      controller.close()
    },
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
