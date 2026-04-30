import type { getRejectionStats } from '@/lib/data'
import Link from 'next/link'

type Stats = NonNullable<Awaited<ReturnType<typeof getRejectionStats>>>

interface Props {
  stats: Stats
  totalJobs: number
}

export default function RejectionAnalyzer({ stats, totalJobs }: Props) {
  const { total, avgDaysToRejection, ghostedCount, ghostedJobs, rejectedAfterApplied } = stats

  if (totalJobs === 0) return null

  const rejectionRate = totalJobs > 0 ? Math.round((total / totalJobs) * 100) : 0

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
      <div>
        <h2 className="font-semibold text-slate-900">Rejection Patterns</h2>
        <p className="text-xs text-slate-400 mt-0.5">Understand where you&apos;re losing momentum</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-rose-50 rounded-xl p-4 border border-rose-100">
          <p className="text-xs font-semibold text-rose-400 uppercase tracking-wide">Rejections</p>
          <p className="text-3xl font-bold text-rose-600 mt-1">{total}</p>
          <p className="text-xs text-rose-400 mt-1">{rejectionRate}% of total</p>
        </div>

        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
          <p className="text-xs font-semibold text-amber-500 uppercase tracking-wide">
            Avg Days to Reject
          </p>
          <p className="text-3xl font-bold text-amber-600 mt-1">
            {avgDaysToRejection !== null ? avgDaysToRejection : '—'}
          </p>
          <p className="text-xs text-amber-400 mt-1">from apply date</p>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
            After Applying
          </p>
          <p className="text-3xl font-bold text-slate-700 mt-1">{rejectedAfterApplied}</p>
          <p className="text-xs text-slate-400 mt-1">had an apply date</p>
        </div>

        <div className="bg-violet-50 rounded-xl p-4 border border-violet-100">
          <p className="text-xs font-semibold text-violet-400 uppercase tracking-wide">
            👻 Ghosting
          </p>
          <p className="text-3xl font-bold text-violet-600 mt-1">{ghostedCount}</p>
          <p className="text-xs text-violet-400 mt-1">no activity 30d+</p>
        </div>
      </div>

      {ghostedJobs.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-2">
            👻 Likely ghosted ({ghostedJobs.length})
          </p>
          <ul className="space-y-1.5">
            {ghostedJobs.slice(0, 5).map((job) => (
              <li key={job.id}>
                <Link
                  href={`/applications/${job.id}`}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-sm group"
                >
                  <span className="font-medium text-slate-800 group-hover:text-sky-600">
                    {job.role} — {job.company}
                  </span>
                  <span className="text-xs text-slate-400">
                    {job.applied_date ?? 'No date'}
                  </span>
                </Link>
              </li>
            ))}
            {ghostedJobs.length > 5 && (
              <p className="text-xs text-slate-400 pl-3">
                +{ghostedJobs.length - 5} more
              </p>
            )}
          </ul>
        </div>
      )}

      {total === 0 && ghostedCount === 0 && (
        <p className="text-sm text-slate-400 text-center py-4">
          No rejections or ghosting detected yet. Keep applying!
        </p>
      )}
    </div>
  )
}