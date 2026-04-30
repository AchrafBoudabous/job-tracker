import Link from 'next/link'
import { BellIcon } from 'lucide-react'
import { getJobsNeedingFollowUp } from '@/lib/data'
import StatusBadge from '@/components/StatusBadge'

export default async function FollowUpReminders() {
  const jobs = await getJobsNeedingFollowUp()

  if (jobs.length === 0) return null

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <BellIcon className="w-4 h-4 text-amber-600" />
        <h3 className="font-semibold text-amber-900">
          Follow-up needed · {jobs.length} job{jobs.length !== 1 ? 's' : ''}
        </h3>
      </div>

      <ul className="space-y-2">
        {jobs.map((job) => {
          const isOverdue = job.follow_up_date! < today
          return (
            <li key={job.id}>
              <Link
                href={`/applications/${job.id}`}
                className="flex items-center justify-between p-3 bg-white rounded-xl hover:bg-amber-50 border border-amber-100 transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{job.role}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {job.company}
                    <span className="mx-1.5 text-slate-300">·</span>
                    <span className={isOverdue ? 'text-rose-500 font-medium' : 'text-amber-600'}>
                      {isOverdue ? `Overdue since ${job.follow_up_date}` : `Due ${job.follow_up_date}`}
                    </span>
                  </p>
                </div>
                <StatusBadge status={job.status} />
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}