'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { BriefcaseIcon } from 'lucide-react'
import { signUp } from '@/app/auth/actions'

const inputCls =
  'w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white ' +
  'placeholder:text-slate-500 focus:outline-none focus:border-sky-500 ' +
  'focus:ring-2 focus:ring-sky-500/20 transition-colors'

const labelCls =
  'block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5'

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState(signUp, null)

  // Email confirmation required — show a holding screen
  if (state && 'success' in state) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-900 px-4">
        <div className="w-full max-w-sm text-center space-y-4">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-sky-500/10 rounded-2xl border border-sky-500/20 mb-2">
            <span className="text-2xl">📬</span>
          </div>
          <h2 className="text-lg font-bold text-white">Check your email</h2>
          <p className="text-slate-400 text-sm">
            We sent a confirmation link to your inbox. Click it to activate your account, then come back to sign in.
          </p>
          <Link href="/login" className="inline-block mt-4 text-sky-400 hover:text-sky-300 text-sm font-medium transition-colors">
            Back to sign in →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 font-bold text-xl text-white">
            <span className="flex items-center justify-center w-10 h-10 bg-sky-500 rounded-xl shrink-0">
              <BriefcaseIcon className="w-5 h-5 text-white" />
            </span>
            JobTracker
          </div>
          <p className="text-slate-400 text-sm mt-2">Create your free account</p>
        </div>

        {/* Error banner */}
        {state && 'error' in state && (
          <div className="mb-5 flex items-start gap-2.5 p-3.5 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 text-sm">
            <span className="shrink-0 mt-0.5">⚠</span>
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label className={labelCls} htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls} htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              required
              autoComplete="new-password"
              placeholder="Min. 8 characters"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls} htmlFor="confirmPassword">Confirm password</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              required
              autoComplete="new-password"
              placeholder="••••••••"
              className={inputCls}
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
          >
            {isPending ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-sky-400 hover:text-sky-300 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
