'use client'

import { useState } from 'react'
import { BrainIcon, SparklesIcon } from 'lucide-react'
import type { JobWithPackage } from '@/lib/types'

export default function InterviewPrepCoach({ job }: { job: JobWithPackage }) {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  async function generate() {
    setLoading(true)
    setResult('')
    try {
      const res = await fetch('/api/ai/interview-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: job.role,
          company: job.company,
          interviewRounds: job.interview_rounds ?? [],
          notes: job.notes,
        }),
      })

      if (!res.ok || !res.body) {
        setResult('Error generating prep. Check that ANTHROPIC_API_KEY is set.')
        return
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        setResult((prev) => prev + decoder.decode(value))
      }
    } catch {
      setResult('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        Get tailored interview questions, tips, and topics to review based on this role
        {(job.interview_rounds?.length ?? 0) > 0
          ? ` and your ${job.interview_rounds!.length} recorded interview round${job.interview_rounds!.length > 1 ? 's' : ''}`
          : ''}.
      </p>

      <button
        onClick={generate}
        disabled={loading}
        className="flex items-center gap-2 bg-violet-500 hover:bg-violet-400 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
      >
        {loading ? (
          <BrainIcon className="w-4 h-4 animate-pulse" />
        ) : (
          <SparklesIcon className="w-4 h-4" />
        )}
        {loading ? 'Preparing…' : 'Generate Prep Guide'}
      </button>

      {result && (
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
          <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
            {result}
          </pre>
        </div>
      )}
    </div>
  )
}