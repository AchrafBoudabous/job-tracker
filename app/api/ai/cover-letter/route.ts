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
  const rateLimitKey = `cover-letter:${user?.id ?? 'service'}`

  if (!checkRateLimit(rateLimitKey, RATE_LIMIT, RATE_WINDOW_MS)) {
    return new Response('Too Many Requests — please wait a moment before generating another cover letter.', {
      status: 429,
      headers: { 'Retry-After': '60' },
    })
  }

  let body: { role?: unknown; company?: unknown; jobDescription?: unknown; notes?: unknown; background?: unknown }
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

  const jobDescription = typeof body.jobDescription === 'string' ? body.jobDescription.slice(0, 10_000) : ''
  const notes          = typeof body.notes          === 'string' ? body.notes.slice(0, 5_000)          : ''
  const background     = typeof body.background     === 'string' ? body.background.slice(0, 5_000)     : ''

  const prompt = `Write a compelling, personalized cover letter for this job application.

Role: ${role}
Company: ${company}${jobDescription ? `\nJob Description: ${jobDescription}` : ''}${notes ? `\nApplicant notes about this role: ${notes}` : ''}${background ? `\nApplicant background/skills: ${background}` : ''}

Write a professional cover letter (3-4 paragraphs). Be specific to the role and company. Focus on the value the applicant brings. Do not use filler phrases like "I am thrilled" or "I am excited". Output the letter only, no preamble.`

  const stream = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    stream: true,
    max_tokens: 1024,
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
