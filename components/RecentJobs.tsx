import Link from 'next/link'
import StatusBadge from '@/components/StatusBadge'
import type { Job } from '@/lib/types'

export default function RecentJobs({ jobs }: { jobs: Job[] }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-slate-900">Recent Applications</h3>
        <Link href="/applications" className="text-sm text-sky-600 hover:text-sky-500 font-medium">
          View all →
        </Link>
      </div>

      {jobs.length === 0 ? (
        <p className="text-slate-400 text-sm text-center py-10">No applications yet</p>
      ) : (
        <ul className="divide-y divide-slate-50">
          {jobs.map((job) => (
            <li key={job.id}>
              <Link
                href={`/applications/${job.id}`}
                className="flex items-center justify-between py-3 px-2 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{job.role}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {job.company}{job.location ? ` · ${job.location}` : ''}
                  </p>
                </div>
                <StatusBadge status={job.status} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}