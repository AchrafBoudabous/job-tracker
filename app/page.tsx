import Link from 'next/link'
import { getStats, getWeeklyStats } from '@/lib/data'
import StatsGrid from '@/components/StatsGrid'
import StatusChart from '@/components/StatusChart'
import MonthlyChart from '@/components/MonthlyChart'
import RecentJobs from '@/components/RecentJobs'
import FollowUpReminders from '@/components/FollowUpReminders'
import SendDigestButton from '@/components/SendDigestButton'
import WeeklyGoal from '@/components/WeeklyGoal'
import MilestoneBadges from '@/components/MilestoneBadges'

export default async function DashboardPage() {
  const [{ total, byStatus, monthlyData, jobs }, { appliedThisWeek, weeklyApplicationCounts }] =
    await Promise.all([getStats(), getWeeklyStats()])

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">Track your job search at a glance</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <SendDigestButton />
          <Link
            href="/applications/new"
            className="bg-sky-500 hover:bg-sky-400 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
          >
            + Add Job
          </Link>
        </div>
      </div>

      <StatsGrid total={total} byStatus={byStatus} />

      <FollowUpReminders />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyGoal
          appliedThisWeek={appliedThisWeek}
          weeklyApplicationCounts={weeklyApplicationCounts}
        />
        <StatusChart byStatus={byStatus} />
      </div>

      <MilestoneBadges jobs={jobs} />

      <MonthlyChart data={monthlyData} />

      <RecentJobs jobs={jobs.slice(0, 6)} />
    </div>
  )
}