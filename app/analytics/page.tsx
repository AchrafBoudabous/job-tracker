import { getStats, getRejectionStats, getSalaryStats } from '@/lib/data'
import StatusChart from '@/components/StatusChart'
import MonthlyChart from '@/components/MonthlyChart'
import StatsGrid from '@/components/StatsGrid'
import RejectionAnalyzer from '@/components/RejectionAnalyzer'
import SalaryIntelligence from '@/components/SalaryIntelligence'

export default async function AnalyticsPage() {
  const [{ total, byStatus, monthlyData }, rejectionStats, salaryStats] = await Promise.all([
    getStats(),
    getRejectionStats(),
    getSalaryStats(),
  ])

  const applied   = byStatus.applied   ?? 0
  const interview = byStatus.interview ?? 0
  const offer     = byStatus.offer     ?? 0

  const interviewRate = applied   > 0 ? Math.round((interview / applied)   * 100) : 0
  const offerRate     = interview > 0 ? Math.round((offer     / interview) * 100) : 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-500 text-sm mt-0.5">Insights into your job search performance</p>
      </div>

      <StatsGrid total={total} byStatus={byStatus} />

      {/* Funnel metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Interview Rate</p>
          <p className="text-4xl sm:text-5xl font-bold text-sky-500 mt-2 tracking-tight">{interviewRate}%</p>
          <p className="text-sm text-slate-500 mt-2">
            {interview} interview{interview !== 1 ? 's' : ''} from {applied} applied
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Offer Rate</p>
          <p className="text-4xl sm:text-5xl font-bold text-emerald-500 mt-2 tracking-tight">{offerRate}%</p>
          <p className="text-sm text-slate-500 mt-2">
            {offer} offer{offer !== 1 ? 's' : ''} from {interview} interview{interview !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <RejectionAnalyzer stats={rejectionStats} totalJobs={total} />

      {salaryStats && <SalaryIntelligence stats={salaryStats} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusChart byStatus={byStatus} />
        <MonthlyChart data={monthlyData} />
      </div>
    </div>
  )
}