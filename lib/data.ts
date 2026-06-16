import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import type { Job, JobWithPackage, InterviewRound, Contact } from '@/lib/types'

function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getUTCDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setUTCDate(d.getUTCDate() + diff)
  d.setUTCHours(0, 0, 0, 0)
  return d
}

function isoDate(d: Date) {
  return d.toISOString().split('T')[0]
}

// cache() deduplicates this within a single render: getStats(), getWeeklyStats(),
// getJobsNeedingFollowUp(), and getRejectionStats() all call getJobs() — without
// this they each fire a separate SELECT. With cache() it runs once.
export const getJobs = cache(async (): Promise<Job[]> => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getJobs error:', error.message)
    return []
  }
  return data ?? []
})

export async function getJob(id: string): Promise<JobWithPackage | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('jobs')
    .select(`
      *,
      application_packages (*),
      interview_rounds (*),
      contacts (*)
    `)
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

export async function getStats() {
  const jobs = await getJobs()

  const byStatus = jobs.reduce<Record<string, number>>((acc, job) => {
    acc[job.status] = (acc[job.status] ?? 0) + 1
    return acc
  }, {})

  const byMonth = jobs.reduce<Record<string, number>>((acc, job) => {
    if (!job.applied_date) return acc
    const month = job.applied_date.slice(0, 7)
    acc[month] = (acc[month] ?? 0) + 1
    return acc
  }, {})

  const monthlyData = Object.entries(byMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, count]) => ({
      month: new Date(month + '-01').toLocaleString('default', { month: 'short', year: '2-digit' }),
      count,
    }))

  return { total: jobs.length, byStatus, monthlyData, jobs }
}

export async function getJobsNeedingFollowUp(): Promise<Job[]> {
  const jobs = await getJobs()
  const today = new Date().toISOString().split('T')[0]
  return jobs.filter(
    (j) =>
      j.follow_up_date &&
      j.follow_up_date <= today &&
      !['rejected', 'withdrawn'].includes(j.status)
  )
}

export async function getInterviewRoundsForJob(jobId: string): Promise<InterviewRound[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('interview_rounds')
    .select('*')
    .eq('job_id', jobId)
    .order('round_number')
  return data ?? []
}

export async function getContactsForJob(jobId: string): Promise<Contact[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('contacts')
    .select('*')
    .eq('job_id', jobId)
  return data ?? []
}

export async function getWeeklyStats(weekCount = 13) {
  const jobs = await getJobs()
  const now = new Date()
  const currentWeekStart = getWeekStart(now)

  const weekMap: Record<string, number> = {}
  for (let i = 0; i < weekCount; i++) {
    const ws = new Date(currentWeekStart)
    ws.setUTCDate(ws.getUTCDate() - i * 7)
    weekMap[isoDate(ws)] = 0
  }

  for (const job of jobs) {
    if (!job.applied_date) continue
    const ws = isoDate(getWeekStart(new Date(job.applied_date)))
    if (ws in weekMap) weekMap[ws]++
  }

  const appliedThisWeek = weekMap[isoDate(currentWeekStart)]

  const weeklyApplicationCounts = Object.entries(weekMap)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([, count]) => count)

  return { appliedThisWeek, weeklyApplicationCounts }
}


export async function getRejectionStats() {
  const jobs = await getJobs()

  const rejected = jobs.filter((j) => j.status === 'rejected')

  const avgDaysToRejection =
    rejected.length === 0
      ? null
      : Math.round(
          rejected.reduce((sum, j) => {
            if (!j.applied_date) return sum
            return sum + (new Date(j.updated_at).getTime() - new Date(j.applied_date).getTime()) / 86_400_000
          }, 0) / rejected.filter((j) => j.applied_date).length
        )

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const ghosted = jobs.filter(
    (j) =>
      (j.status === 'applied' || j.status === 'interview') &&
      new Date(j.updated_at) < thirtyDaysAgo
  )

  const silentRejections = rejected.filter(
    (j) => !j.notes?.toLowerCase().includes('interview') && j.status === 'rejected'
  )

  const rejectedAfterApplied = rejected.filter((j) => j.applied_date).length
  const rejectedSaved = rejected.filter((j) => !j.applied_date).length

  return {
    total: rejected.length,
    avgDaysToRejection,
    ghostedCount: ghosted.length,
    ghostedJobs: ghosted,
    silentRejectionCount: silentRejections.length,
    rejectedAfterApplied,
    rejectedSaved,
  }
}


function parseSalary(raw: string): [number, number] | null {
  const cleaned = raw.replace(/[£€$,\s]/g, '').toLowerCase()
  const rangeMatch = cleaned.match(/(\d+\.?\d*)(k?)[-–](\d+\.?\d*)(k?)/)
  if (rangeMatch) {
    const lo = parseFloat(rangeMatch[1]) * (rangeMatch[2] === 'k' ? 1000 : 1)
    const hi = parseFloat(rangeMatch[3]) * (rangeMatch[4] === 'k' ? 1000 : 1)
    return [lo, hi]
  }
  const singleMatch = cleaned.match(/^(\d+\.?\d*)(k?)$/)
  if (singleMatch) {
    const v = parseFloat(singleMatch[1]) * (singleMatch[2] === 'k' ? 1000 : 1)
    return [v, v]
  }
  return null
}

export async function getSalaryStats() {
  const jobs = await getJobs()

  const parsed = jobs
    .filter((j) => j.salary_range)
    .map((j) => ({ job: j, range: parseSalary(j.salary_range!) }))
    .filter((x): x is { job: Job; range: [number, number] } => x.range !== null)

  if (parsed.length === 0) return null

  const midpoints = parsed.map(({ range: [lo, hi] }) => (lo + hi) / 2)
  const avg = Math.round(midpoints.reduce((s, v) => s + v, 0) / midpoints.length)
  const min = Math.min(...parsed.map(({ range: [lo] }) => lo))
  const max = Math.max(...parsed.map(({ range: [, hi] }) => hi))

  const offerJobs = parsed.filter(({ job }) => job.status === 'offer')
  const avgOffer =
    offerJobs.length > 0
      ? Math.round(
          offerJobs
            .map(({ range: [lo, hi] }) => (lo + hi) / 2)
            .reduce((s, v) => s + v, 0) / offerJobs.length
        )
      : null

  return { avg, min, max, avgOffer, count: parsed.length, items: parsed }
}