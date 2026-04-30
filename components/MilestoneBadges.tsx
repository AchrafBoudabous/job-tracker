import type { Job } from '@/lib/types'

const MILESTONES = [
  {
    id: 'first_app',
    icon: '🎯',
    label: 'First Step',
    desc: 'Submitted your first application',
    earned: (jobs: Job[]) => jobs.length >= 1,
  },
  {
    id: 'apps_5',
    icon: '📋',
    label: 'Getting Started',
    desc: '5 applications sent',
    earned: (jobs: Job[]) => jobs.length >= 5,
  },
  {
    id: 'apps_10',
    icon: '🚀',
    label: 'On a Roll',
    desc: '10 applications sent',
    earned: (jobs: Job[]) => jobs.length >= 10,
  },
  {
    id: 'apps_25',
    icon: '💪',
    label: 'Dedicated',
    desc: '25 applications sent',
    earned: (jobs: Job[]) => jobs.length >= 25,
  },
  {
    id: 'apps_50',
    icon: '⚡',
    label: 'Hustler',
    desc: '50 applications sent',
    earned: (jobs: Job[]) => jobs.length >= 50,
  },
  {
    id: 'first_interview',
    icon: '🎤',
    label: 'Getting Noticed',
    desc: 'Landed your first interview',
    earned: (jobs: Job[]) => jobs.some((j) => j.status === 'interview' || j.status === 'offer'),
  },
  {
    id: 'first_offer',
    icon: '🏆',
    label: 'Offer in Hand',
    desc: 'Received your first offer',
    earned: (jobs: Job[]) => jobs.some((j) => j.status === 'offer'),
  },
  {
    id: 'follow_up',
    icon: '📅',
    label: 'Stay Persistent',
    desc: 'Set a follow-up date on an application',
    earned: (jobs: Job[]) => jobs.some((j) => j.follow_up_date),
  },
  {
    id: 'notes_5',
    icon: '📝',
    label: 'Detail-Oriented',
    desc: 'Added notes to 5 applications',
    earned: (jobs: Job[]) => jobs.filter((j) => j.notes).length >= 5,
  },
  {
    id: 'salary_tracker',
    icon: '💰',
    label: 'Know Your Worth',
    desc: 'Tracked salary range on 3 applications',
    earned: (jobs: Job[]) => jobs.filter((j) => j.salary_range).length >= 3,
  },
]

interface Props {
  jobs: Job[]
}

export default function MilestoneBadges({ jobs }: Props) {
  const earned = MILESTONES.filter((m) => m.earned(jobs))
  const locked = MILESTONES.filter((m) => !m.earned(jobs))

  if (jobs.length === 0) return null

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-semibold text-slate-900">Milestones</h2>
        <span className="text-xs text-slate-400 font-medium">
          {earned.length} / {MILESTONES.length} earned
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[...earned, ...locked].map((m) => {
          const isEarned = m.earned(jobs)
          return (
            <div
              key={m.id}
              title={m.desc}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all ${
                isEarned
                  ? 'border-amber-200 bg-amber-50'
                  : 'border-slate-100 bg-slate-50 opacity-40 grayscale'
              }`}
            >
              <span className="text-2xl">{m.icon}</span>
              <span
                className={`text-xs font-semibold leading-tight ${
                  isEarned ? 'text-amber-800' : 'text-slate-400'
                }`}
              >
                {m.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}