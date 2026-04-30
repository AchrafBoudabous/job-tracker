import type { ApplicationStatus } from '@/lib/types'

interface Props {
  total: number
  byStatus: Record<string, number>
}

const STATS: { key: ApplicationStatus | 'total'; label: string; className: string }[] = [
  { key: 'total',     label: 'Total',     className: 'bg-slate-900 text-white' },
  { key: 'saved',     label: 'Saved',     className: 'bg-white text-slate-700 border border-slate-200' },
  { key: 'applied',   label: 'Applied',   className: 'bg-sky-500 text-white' },
  { key: 'interview', label: 'Interview', className: 'bg-amber-500 text-white' },
  { key: 'offer',     label: 'Offer',     className: 'bg-emerald-500 text-white' },
  { key: 'rejected',  label: 'Rejected',  className: 'bg-rose-500 text-white' },
]

export default function StatsGrid({ total, byStatus }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {STATS.map(({ key, label, className }) => {
        const value = key === 'total' ? total : (byStatus[key] ?? 0)
        return (
          <div key={key} className={`rounded-2xl p-5 shadow-sm ${className}`}>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            <p className="text-sm font-medium mt-1 opacity-80">{label}</p>
          </div>
        )
      })}
    </div>
  )
}