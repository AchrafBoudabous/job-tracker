import Link from 'next/link'
import JobForm from '@/components/JobForm'
import { createJob } from '@/app/actions'

export default function NewApplicationPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/applications" className="text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors">
          ← Back
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">New Application</h1>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <JobForm action={createJob} />
      </div>
    </div>
  )
}