import Groq from 'groq-sdk'
import { isAuthorized } from '@/lib/api-guard'

const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { role, company, interviewRounds, notes } = await request.json()

  const roundsSummary = interviewRounds?.length
    ? interviewRounds
        .map((r: { round_number: number; interview_type?: string; notes?: string }) =>
          `- Round ${r.round_number}${r.interview_type ? ` (${r.interview_type})` : ''}: ${r.notes ?? 'no notes'}`
        )
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