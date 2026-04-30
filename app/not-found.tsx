import Link from 'next/link'
import { SearchXIcon } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="flex items-center justify-center w-16 h-16 bg-slate-100 rounded-2xl mb-6">
        <SearchXIcon className="w-8 h-8 text-slate-400" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900">Page not found</h1>
      <p className="text-slate-500 mt-2 text-sm max-w-xs">
        The page you're looking for doesn't exist or has been removed.
      </p>
      <Link
        href="/"
        className="mt-6 bg-sky-500 hover:bg-sky-400 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
      >
        Back to Dashboard
      </Link>
    </div>
  )
}