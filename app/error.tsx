'use client'

import { useEffect } from 'react'
import { AlertTriangleIcon } from 'lucide-react'

export default function GlobalError({
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
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="flex items-center justify-center w-16 h-16 bg-rose-50 rounded-2xl mb-6">
        <AlertTriangleIcon className="w-8 h-8 text-rose-400" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900">Something went wrong</h1>
      <p className="text-slate-500 mt-2 text-sm max-w-xs">
        {error.message || 'An unexpected error occurred. Please try again.'}
      </p>
      <button
        onClick={reset}
        className="mt-6 bg-sky-500 hover:bg-sky-400 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
      >
        Try again
      </button>
    </div>
  )
}