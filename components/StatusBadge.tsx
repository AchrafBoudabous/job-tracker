import { ApplicationStatus } from '@/lib/types'

const config: Record<ApplicationStatus, { label: string; className: string }> = {
  saved:     { label: 'Saved',     className: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200' },
  applied:   { label: 'Applied',   className: 'bg-sky-100 text-sky-700 ring-1 ring-sky-200' },
  interview: { label: 'Interview', className: 'bg-amber-100 text-amber-700 ring-1 ring-amber-200' },
  offer:     { label: 'Offer',     className: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200' },
  rejected:  { label: 'Rejected',  className: 'bg-rose-100 text-rose-700 ring-1 ring-rose-200' },
  withdrawn: { label: 'Withdrawn', className: 'bg-slate-100 text-slate-500 ring-1 ring-slate-200' },
}

export default function StatusBadge({ status }: { status: ApplicationStatus }) {
  const { label, className } = config[status]
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}>
      {label}
    </span>
  )
}