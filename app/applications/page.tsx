import Link from 'next/link'
import { getJobs } from '@/lib/data'
import StatusBadge from '@/components/StatusBadge'
import SearchSortBar from '@/components/SearchSortBar'
import type { ApplicationStatus, Job } from '@/lib/types'
import { ExternalLinkIcon } from 'lucide-react'

const STATUS_FILTERS: { value: ApplicationStatus | 'all'; label: string }[] = [
  { value: 'all',       label: 'All' },
  { value: 'saved',     label: 'Saved' },
  { value: 'applied',   label: 'Applied' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer',     label: 'Offer' },
  { value: 'rejected',  label: 'Rejected' },
  { value: 'withdrawn', label: 'Withdrawn' },
]

type SortField = 'created_at' | 'applied_date' | 'company' | 'role'
const VALID_SORTS: SortField[] = ['created_at', 'applied_date', 'company', 'role']

const GHOST_DAYS = 14

function isGhosting(job: Job): boolean {
  if (job.status !== 'applied' && job.status !== 'interview') return false
  const daysSince = (Date.now() - new Date(job.updated_at).getTime()) / 86_400_000
  return daysSince >= GHOST_DAYS
}

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; sort?: string; dir?: string }>
}) {
  const { status, q = '', sort = 'created_at', dir = 'desc' } = await searchParams
  const all = await getJobs()

  const sortField: SortField = VALID_SORTS.includes(sort as SortField) ? (sort as SortField) : 'created_at'
  const sortDir = dir === 'asc' ? 1 : -1

  let filtered = status && status !== 'all' ? all.filter((j) => j.status === status) : [...all]

  if (q.trim()) {
    const query = q.toLowerCase()
    filtered = filtered.filter(
      (j) =>
        j.role.toLowerCase().includes(query) ||
        j.company.toLowerCase().includes(query) ||
        (j.location ?? '').toLowerCase().includes(query)
    )
  }

  filtered.sort((a, b) => {
    const av = (a[sortField as keyof Job] ?? '') as string
    const bv = (b[sortField as keyof Job] ?? '') as string
    return av.localeCompare(bv) * sortDir
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Applications</h1>
        <Link
          href="/applications/new"
          className="bg-sky-500 hover:bg-sky-400 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm shrink-0"
        >
          + Add Job
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map(({ value, label }) => {
          const count = value === 'all' ? all.length : all.filter((j) => j.status === value).length
          const active = (value === 'all' && !status) || status === value
          return (
            <Link
              key={value}
              href={value === 'all' ? '/applications' : `/applications?status=${value}`}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                active
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              {label} <span className={active ? 'opacity-70' : 'opacity-60'}>({count})</span>
            </Link>
          )
        })}
      </div>

      <SearchSortBar initialQ={q} initialSort={sortField} initialDir={dir === 'asc' ? 'asc' : 'desc'} />

      {filtered.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-400 font-medium">
            {q ? `No results for "${q}"` : 'No applications found'}
          </p>
          {!q && (
            <Link href="/applications/new" className="mt-3 inline-block text-sky-600 hover:text-sky-500 text-sm font-medium">
              Add your first application →
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100">
            <p className="text-xs text-slate-400 font-medium">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              {q ? ` for "${q}"` : ''}
            </p>
          </div>

          <ul className="md:hidden divide-y divide-slate-50">
            {filtered.map((job) => (
              <li key={job.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Link
                        href={`/applications/${job.id}`}
                        className="font-semibold text-slate-900 hover:text-sky-600 transition-colors leading-tight"
                      >
                        {job.role}
                      </Link>
                      {isGhosting(job) && (
                        <span title="No activity for 14+ days" className="text-base leading-none">👻</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 mt-0.5 truncate">{job.company}{job.location ? ` · ${job.location}` : ''}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <StatusBadge status={job.status} />
                      {job.applied_date && (
                        <span className="text-xs text-slate-400">{job.applied_date}</span>
                      )}
                      {job.salary_range && (
                        <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                          {job.salary_range}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 pt-0.5">
                    {job.job_url && (
                      <a
                        href={job.job_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-300 hover:text-slate-500 transition-colors"
                      >
                        <ExternalLinkIcon className="w-4 h-4" />
                      </a>
                    )}
                    <Link
                      href={`/applications/${job.id}`}
                      className="text-sky-600 hover:text-sky-500 text-xs font-semibold"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Role</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Company</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Applied</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Location</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Salary</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/applications/${job.id}`} className="font-semibold text-slate-900 hover:text-sky-600 transition-colors">
                          {job.role}
                        </Link>
                        {isGhosting(job) && (
                          <span title="No activity for 14+ days — possible ghosting" className="text-base leading-none cursor-default">
                            👻
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{job.company}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={job.status} />
                    </td>
                    <td className="px-5 py-4 text-slate-500">{job.applied_date ?? '—'}</td>
                    <td className="px-5 py-4 text-slate-500">{job.location ?? '—'}</td>
                    <td className="px-5 py-4 text-slate-500">{job.salary_range ?? '—'}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Link href={`/applications/${job.id}`} className="text-sky-600 hover:text-sky-500 text-xs font-semibold">
                          Edit
                        </Link>
                        {job.job_url && (
                          <a href={job.job_url} target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-slate-500 transition-colors">
                            <ExternalLinkIcon className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}