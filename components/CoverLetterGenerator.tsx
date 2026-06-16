'use client'

import { useState, useRef, useEffect } from 'react'
import { SparklesIcon, CopyIcon, CheckIcon } from 'lucide-react'
import type { JobWithPackage } from '@/lib/types'

const inputCls =
  'w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-colors'
const labelCls = 'block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1'

export default function CoverLetterGenerator({ job }: { job: JobWithPackage }) {
  const [jobDesc, setJobDesc] = useState(job.job_description_snapshot ?? '')
  const [background, setBackground] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    return () => { abortRef.current?.abort() }
  }, [])

  async function generate() {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    setLoading(true)
    setResult('')
    try {
      const res = await fetch('/api/ai/cover-letter', {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: job.role,
          company: job.company,
          jobDescription: jobDesc,
          notes: job.notes,
          background,
        }),
      })

      if (!res.ok || !res.body) {
        setResult('AI generation failed. Please try again.')
        return
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        setResult((prev) => prev + decoder.decode(value))
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      setResult('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function copy() {
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className={labelCls}>Job Description</label>
        <textarea
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          rows={4}
          placeholder="Paste the full job description here for a more tailored letter…"
          className={inputCls}
        />
      </div>
      <div>
        <label className={labelCls}>Your Background / CV Highlights (optional)</label>
        <textarea
          value={background}
          onChange={(e) => setBackground(e.target.value)}
          rows={3}
          placeholder="Paste a brief summary of your skills, experience, or key achievements…"
          className={inputCls}
        />
      </div>

      <button
        onClick={generate}
        disabled={loading}
        className="flex items-center gap-2 bg-violet-500 hover:bg-violet-400 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
      >
        <SparklesIcon className="w-4 h-4" />
        {loading ? 'Writing…' : 'Generate Cover Letter'}
      </button>

      {result && (
        <div className="relative bg-slate-50 rounded-xl border border-slate-200 p-4">
          <button
            onClick={copy}
            className="absolute top-3 right-3 flex items-center gap-1 text-xs text-slate-400 hover:text-slate-700 transition-colors"
          >
            {copied ? (
              <CheckIcon className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <CopyIcon className="w-3.5 h-3.5" />
            )}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed pr-16">
            {result}
          </pre>
        </div>
      )}
    </div>
  )
}
