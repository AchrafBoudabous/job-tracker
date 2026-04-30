import Groq from 'groq-sdk'
import { isAuthorized } from '@/lib/api-guard'

const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { role, company, jobDescription, notes, background } = await request.json()

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