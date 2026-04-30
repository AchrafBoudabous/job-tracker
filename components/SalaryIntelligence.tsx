import type { getSalaryStats } from '@/lib/data'

type Stats = NonNullable<Awaited<ReturnType<typeof getSalaryStats>>>

interface Props {
  stats: Stats
}

function fmt(n: number) {
  if (n >= 1000) return `${Math.round(n / 1000)}k`
  return String(n)
}

export default function SalaryIntelligence({ stats }: Props) {
  const { avg, min, max, avgOffer, count, items } = stats

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
      <div>
        <h2 className="font-semibold text-slate-900">Salary Intelligence</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Based on {count} application{count !== 1 ? 's' : ''} with salary data
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
          <p className="text-xs font-semibold text-emerald-500 uppercase tracking-wide">Avg Target</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">£{fmt(avg)}</p>
          <p className="text-xs text-emerald-400 mt-1">midpoint avg</p>
        </div>

        <div className="bg-sky-50 rounded-xl p-4 border border-sky-100">
          <p className="text-xs font-semibold text-sky-400 uppercase tracking-wide">Range</p>
          <p className="text-xl font-bold text-sky-600 mt-1 leading-tight">
            £{fmt(min)}–<br className="sm:hidden" />£{fmt(max)}
          </p>
          <p className="text-xs text-sky-400 mt-1">min – max</p>
        </div>

        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
          <p className="text-xs font-semibold text-amber-500 uppercase tracking-wide">Avg Offer</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            {avgOffer !== null ? `£${fmt(avgOffer)}` : '—'}
          </p>
          <p className="text-xs text-amber-400 mt-1">
            {avgOffer !== null ? 'from offers' : 'no offers yet'}
          </p>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Tracked</p>
          <p className="text-2xl font-bold text-slate-700 mt-1">{count}</p>
          <p className="text-xs text-slate-400 mt-1">with salary data</p>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
          Salary distribution
        </p>
        <div className="space-y-2">
          {items.map(({ job, range: [lo, hi] }) => {
            const span = max - min || 1
            const leftPct = ((lo - min) / span) * 100
            const widthPct = Math.max(((hi - lo) / span) * 100, 2)
            const color =
              job.status === 'offer'
                ? 'bg-emerald-400'
                : job.status === 'rejected'
                ? 'bg-rose-300'
                : 'bg-sky-400'

            return (
              <div key={job.id} className="flex items-center gap-2">
                <span
                  className="text-xs text-slate-500 w-24 truncate shrink-0 hidden sm:block"
                  title={`${job.role} @ ${job.company}`}
                >
                  {job.company}
                </span>
                <div className="flex-1 relative h-4 bg-slate-100 rounded-full overflow-hidden min-w-0">
                  <div
                    className={`absolute h-full rounded-full ${color}`}
                    style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                  />
                </div>
                <span className="text-xs text-slate-400 shrink-0 text-right w-16 sm:w-20">
                  £{fmt(lo)}{lo !== hi ? `–£${fmt(hi)}` : ''}
                </span>
              </div>
            )
          })}
        </div>
        <div className="flex justify-between text-xs text-slate-300 mt-1 sm:pl-24 sm:pr-20 pl-0 pr-16">
          <span>£{fmt(min)}</span>
          <span>£{fmt(max)}</span>
        </div>
      </div>
    </div>
  )
}