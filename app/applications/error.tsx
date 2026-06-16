'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangleIcon } from 'lucide-react'

export default function ApplicationsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="flex items-center justify-center w-14 h-14 bg-rose-50 rounded-2xl mb-5">
        <AlertTriangleIcon className="w-7 h-7 text-rose-400" />
      </div>
      <h2 className="text-xl font-bold text-slate-900">Failed to load applications</h2>
      <p className="text-slate-500 mt-2 text-sm max-w-xs">
        Could not load your applications. Please try again.
      </p>
      <div className="flex gap-3 mt-6">
        <button
          onClick={reset}
          className="bg-sky-500 hover:bg-sky-400 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          Try again
        </button>
        <Link href="/" className="bg-white border border-slate-200 text-slate-700 hover:border-slate-300 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
          Dashboard
        </Link>
      </div>
    </div>
  )
}