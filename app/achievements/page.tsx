import { getStats, getWeeklyStats } from '@/lib/data'
import MilestoneBadges from '@/components/MilestoneBadges'
import WeeklyGoal from '@/components/WeeklyGoal'

export default async function AchievementsPage() {
  const [{ jobs }, { appliedThisWeek, weeklyApplicationCounts }] = await Promise.all([
    getStats(),
    getWeeklyStats(),
  ])

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Achievements</h1>
        <p className="text-slate-500 text-sm mt-0.5">Your milestones and weekly progress</p>
      </div>

      <WeeklyGoal
        appliedThisWeek={appliedThisWeek}
        weeklyApplicationCounts={weeklyApplicationCounts}
      />

      <MilestoneBadges jobs={jobs} />

      {jobs.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-4xl mb-3">🎯</p>
          <p className="font-semibold text-slate-700">No achievements yet</p>
          <p className="text-sm text-slate-400 mt-1">
            Start adding applications to unlock your first badge
          </p>
        </div>
      )}
    </div>
  )
}