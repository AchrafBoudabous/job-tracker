'use client'

import { useState } from 'react'
import { MailIcon, CheckIcon, AlertCircleIcon } from 'lucide-react'

type State = 'idle' | 'loading' | 'sent' | 'error'

export default function SendDigestButton() {
  const [state, setState] = useState<State>('idle')

  async function send() {
    setState('loading')
    try {
      const res = await fetch('/api/email/digest', { method: 'POST' })
      const body = await res.json()
      setState(res.ok && body.ok ? 'sent' : 'error')
    } catch {
      setState('error')
    }
    setTimeout(() => setState('idle'), 4000)
  }

  const variants: Record<State, { icon: React.ReactNode; label: string; cls: string }> = {
    idle:    { icon: <MailIcon className="w-4 h-4" />,         label: 'Send Digest',  cls: 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-900' },
    loading: { icon: <MailIcon className="w-4 h-4 animate-pulse" />, label: 'Sending…', cls: 'bg-white border border-slate-200 text-slate-400 cursor-not-allowed' },
    sent:    { icon: <CheckIcon className="w-4 h-4" />,        label: 'Sent!',        cls: 'bg-emerald-50 border border-emerald-200 text-emerald-700' },
    error:   { icon: <AlertCircleIcon className="w-4 h-4" />,  label: 'Failed',       cls: 'bg-rose-50 border border-rose-200 text-rose-600' },
  }

  const { icon, label, cls } = variants[state]

  return (
    <button
      onClick={send}
      disabled={state === 'loading'}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${cls}`}
    >
      {icon}
      {label}
    </button>
  )
}