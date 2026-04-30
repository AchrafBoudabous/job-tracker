import { Resend } from 'resend'
import { getStats, getJobsNeedingFollowUp } from '@/lib/data'
import { isAuthorized } from '@/lib/api-guard'
import type { Job } from '@/lib/types'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const to = process.env.DIGEST_EMAIL
  if (!to) {
    return Response.json({ error: 'DIGEST_EMAIL env variable is not set' }, { status: 500 })
  }

  const [{ total, byStatus, jobs }, followUps] = await Promise.all([
    getStats(),
    getJobsNeedingFollowUp(),
  ])

  const recent = jobs.filter((j) => {
    if (!j.applied_date) return false
    const days = (Date.now() - new Date(j.applied_date).getTime()) / 86_400_000
    return days <= 7
  })

  const html = buildHtml({ total, byStatus, recent, followUps })

  const { error } = await resend.emails.send({
    from: 'JobTracker <onboarding@resend.dev>',
    to,
    subject: `Job Search Digest — ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
    html,
  })

  if (error) return Response.json({ error: error.message }, { status: 500 })

  return Response.json({ ok: true })
}

function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const STATUS_COLOR: Record<string, string> = {
  saved:     '#64748b',
  applied:   '#0ea5e9',
  interview: '#f59e0b',
  offer:     '#10b981',
  rejected:  '#f43f5e',
  withdrawn: '#94a3b8',
}

function pill(status: string, count: number) {
  const color = STATUS_COLOR[status] ?? '#94a3b8'
  return `<span style="display:inline-block;background:${color}1a;color:${color};border:1px solid ${color}40;border-radius:999px;padding:2px 10px;font-size:12px;font-weight:600;margin:2px 3px">${status.charAt(0).toUpperCase() + status.slice(1)}: ${count}</span>`
}

function jobRow(job: Job) {
  const color = STATUS_COLOR[job.status] ?? '#94a3b8'
  return `
    <tr>
      <td style="padding:10px 16px;border-bottom:1px solid #f1f5f9">
        <strong style="color:#0f172a;font-size:14px">${esc(job.role)}</strong><br>
        <span style="color:#64748b;font-size:12px">${esc(job.company)}${job.location ? ' · ' + esc(job.location) : ''}</span>
      </td>
      <td style="padding:10px 16px;border-bottom:1px solid #f1f5f9;white-space:nowrap">
        <span style="background:${color}1a;color:${color};border:1px solid ${color}40;border-radius:999px;padding:2px 8px;font-size:11px;font-weight:600">${esc(job.status)}</span>
      </td>
      <td style="padding:10px 16px;border-bottom:1px solid #f1f5f9;color:#94a3b8;font-size:12px;white-space:nowrap">${esc(job.follow_up_date ?? job.applied_date ?? '')}</td>
    </tr>`
}

function buildHtml({
  total,
  byStatus,
  recent,
  followUps,
}: {
  total: number
  byStatus: Record<string, number>
  recent: Job[]
  followUps: Job[]
}) {
  const statusPills = Object.entries(byStatus)
    .filter(([, n]) => n > 0)
    .map(([s, n]) => pill(s, n))
    .join('')

  const recentRows = recent.length
    ? recent.map(jobRow).join('')
    : `<tr><td colspan="3" style="padding:16px;color:#94a3b8;font-size:13px;text-align:center">No applications in the last 7 days</td></tr>`

  const followUpRows = followUps.length
    ? followUps.map(jobRow).join('')
    : `<tr><td colspan="3" style="padding:16px;color:#94a3b8;font-size:13px;text-align:center">No follow-ups due</td></tr>`

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:40px 16px;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:600px;margin:0 auto">

    <!-- Header -->
    <div style="background:#0f172a;border-radius:16px 16px 0 0;padding:28px 32px">
      <div style="display:flex;align-items:center;gap:12px">
        <div style="background:#0ea5e9;width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:18px">💼</div>
        <div>
          <div style="color:#fff;font-size:18px;font-weight:700">JobTracker Digest</div>
          <div style="color:#94a3b8;font-size:13px">${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</div>
        </div>
      </div>
    </div>

    <!-- Body -->
    <div style="background:#fff;border-radius:0 0 16px 16px;padding:28px 32px;border:1px solid #e2e8f0;border-top:none">

      <!-- Summary -->
      <h2 style="margin:0 0 8px;font-size:16px;color:#0f172a">Pipeline summary</h2>
      <p style="margin:0 0 16px;font-size:14px;color:#64748b">${total} total application${total !== 1 ? 's' : ''}</p>
      <div style="margin-bottom:28px">${statusPills || '<span style="color:#94a3b8;font-size:13px">No applications yet</span>'}</div>

      <!-- Follow-ups -->
      <h2 style="margin:0 0 12px;font-size:16px;color:#0f172a">⏰ Follow-ups due</h2>
      <table style="width:100%;border-collapse:collapse;border-radius:10px;overflow:hidden;border:1px solid #f1f5f9;margin-bottom:28px">
        ${followUpRows}
      </table>

      <!-- Recent -->
      <h2 style="margin:0 0 12px;font-size:16px;color:#0f172a">📋 Applied this week</h2>
      <table style="width:100%;border-collapse:collapse;border-radius:10px;overflow:hidden;border:1px solid #f1f5f9;margin-bottom:28px">
        ${recentRows}
      </table>

    </div>

    <p style="text-align:center;color:#cbd5e1;font-size:11px;margin-top:16px">Sent by your personal JobTracker app</p>
  </div>
</body>
</html>`
}