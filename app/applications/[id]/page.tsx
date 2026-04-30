import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ExternalLinkIcon, PlusIcon, SparklesIcon } from 'lucide-react'
import { getJob } from '@/lib/data'
import StatusBadge from '@/components/StatusBadge'
import JobForm from '@/components/JobForm'
import DeleteButton from '@/components/DeleteButton'
import SubmitButton from '@/components/SubmitButton'
import CoverLetterGenerator from '@/components/CoverLetterGenerator'
import InterviewPrepCoach from '@/components/InterviewPrepCoach'
import {
  updateJob,
  deleteJob,
  createInterviewRound,
  deleteInterviewRound,
  createContact,
  deleteContact,
  createApplicationPackage,
  deleteApplicationPackage,
} from '@/app/actions'

const miniInputCls =
  'w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-colors'

const miniLabelCls = 'block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1'

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const job = await getJob(id)

  if (!job) notFound()

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <Link href="/applications" className="text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors mt-1 shrink-0">
            ← Back
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">{job.role}</h1>
              <StatusBadge status={job.status} />
            </div>
            <p className="text-slate-500 text-sm mt-1 truncate">
              {job.company}
              {job.location ? <span className="text-slate-300 mx-1.5">·</span> : ''}
              {job.location}
              {job.salary_range ? <span className="text-slate-300 mx-1.5">·</span> : ''}
              {job.salary_range}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 sm:ml-4">
          {job.job_url && (
            <a
              href={job.job_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium text-sky-600 hover:text-sky-500 transition-colors"
            >
              <ExternalLinkIcon className="w-3.5 h-3.5" />
              Job Listing
            </a>
          )}
          <DeleteButton
            action={deleteJob.bind(null, id)}
            confirmMessage={`Delete "${job.role}" at ${job.company}?`}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="font-semibold text-slate-900 mb-5">Edit Application</h2>
        <JobForm action={updateJob} defaultValues={job} />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-slate-900">Interview Rounds</h2>

        {(job.interview_rounds?.length ?? 0) > 0 && (
          <ul className="space-y-2">
            {job.interview_rounds!.map((round) => (
              <li key={round.id} className="flex items-start justify-between gap-4 p-4 bg-slate-50 rounded-xl text-sm">
                <div>
                  <p className="font-semibold text-slate-800">
                    Round {round.round_number}
                    {round.interview_type ? ` — ${round.interview_type}` : ''}
                    {round.interview_date
                      ? <span className="text-slate-400 font-normal ml-1.5">{round.interview_date}</span>
                      : ''}
                  </p>
                  {round.notes && <p className="text-slate-500 mt-1">{round.notes}</p>}
                  {round.questions && <p className="text-slate-400 text-xs mt-1">Q: {round.questions}</p>}
                </div>
                <DeleteButton
                  action={deleteInterviewRound.bind(null, round.id, id)}
                  label=""
                  confirmMessage="Delete this interview round?"
                />
              </li>
            ))}
          </ul>
        )}

        <details>
          <summary className="flex items-center gap-1.5 text-sm font-semibold text-sky-600 cursor-pointer list-none hover:text-sky-500 transition-colors w-fit">
            <PlusIcon className="w-4 h-4" />
            Add Round
          </summary>
          <form action={createInterviewRound} className="mt-4 space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <input type="hidden" name="job_id" value={id} />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className={miniLabelCls}>Round #</label>
                <input type="number" name="round_number" min={1} defaultValue={1} className={miniInputCls} />
              </div>
              <div>
                <label className={miniLabelCls}>Type</label>
                <input type="text" name="interview_type" placeholder="Phone / Technical" className={miniInputCls} />
              </div>
              <div>
                <label className={miniLabelCls}>Date</label>
                <input type="date" name="interview_date" className={miniInputCls} />
              </div>
            </div>
            <div>
              <label className={miniLabelCls}>Notes</label>
              <textarea name="notes" rows={2} className={miniInputCls} />
            </div>
            <div>
              <label className={miniLabelCls}>Questions / Topics</label>
              <textarea name="questions" rows={2} className={miniInputCls} />
            </div>
            <SubmitButton
              label="Save Round"
              className="bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-50 transition-colors"
            />
          </form>
        </details>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-slate-900">Contacts</h2>

        {(job.contacts?.length ?? 0) > 0 && (
          <ul className="space-y-2">
            {job.contacts!.map((contact) => (
              <li key={contact.id} className="flex items-start justify-between gap-4 p-4 bg-slate-50 rounded-xl text-sm">
                <div>
                  <p className="font-semibold text-slate-800">
                    {contact.name}
                    {contact.title ? <span className="text-slate-400 font-normal ml-1.5">— {contact.title}</span> : ''}
                  </p>
                  <div className="flex gap-4 text-xs mt-1">
                    {contact.email && (
                      <a href={`mailto:${contact.email}`} className="text-sky-600 hover:underline">{contact.email}</a>
                    )}
                    {contact.linkedin_url && (
                      <a href={contact.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">LinkedIn</a>
                    )}
                  </div>
                  {contact.notes && <p className="text-slate-400 text-xs mt-1">{contact.notes}</p>}
                </div>
                <DeleteButton
                  action={deleteContact.bind(null, contact.id, id)}
                  label=""
                  confirmMessage="Delete this contact?"
                />
              </li>
            ))}
          </ul>
        )}

        <details>
          <summary className="flex items-center gap-1.5 text-sm font-semibold text-sky-600 cursor-pointer list-none hover:text-sky-500 transition-colors w-fit">
            <PlusIcon className="w-4 h-4" />
            Add Contact
          </summary>
          <form action={createContact} className="mt-4 space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <input type="hidden" name="job_id" value={id} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={miniLabelCls}>Name *</label>
                <input type="text" name="name" required className={miniInputCls} />
              </div>
              <div>
                <label className={miniLabelCls}>Title</label>
                <input type="text" name="title" className={miniInputCls} />
              </div>
              <div>
                <label className={miniLabelCls}>Email</label>
                <input type="email" name="email" className={miniInputCls} />
              </div>
              <div>
                <label className={miniLabelCls}>LinkedIn URL</label>
                <input type="url" name="linkedin_url" pattern="https?://.*" className={miniInputCls} />
              </div>
            </div>
            <div>
              <label className={miniLabelCls}>Notes</label>
              <textarea name="notes" rows={2} className={miniInputCls} />
            </div>
            <SubmitButton
              label="Save Contact"
              className="bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-50 transition-colors"
            />
          </form>
        </details>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
        <div className="flex items-center gap-2">
          <SparklesIcon className="w-5 h-5 text-violet-500" />
          <h2 className="font-semibold text-slate-900">AI Tools</h2>
          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Powered by Claude</span>
        </div>

        <details>
          <summary className="flex items-center gap-1.5 text-sm font-semibold text-violet-600 cursor-pointer list-none hover:text-violet-500 transition-colors w-fit">
            <PlusIcon className="w-4 h-4" />
            Cover Letter Generator
          </summary>
          <div className="mt-4">
            <CoverLetterGenerator job={job} />
          </div>
        </details>

        <details>
          <summary className="flex items-center gap-1.5 text-sm font-semibold text-violet-600 cursor-pointer list-none hover:text-violet-500 transition-colors w-fit">
            <PlusIcon className="w-4 h-4" />
            Interview Prep Coach
          </summary>
          <div className="mt-4">
            <InterviewPrepCoach job={job} />
          </div>
        </details>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-slate-900">Application Packages</h2>
        <p className="text-xs text-slate-400">Track which CV version and cover letter you sent for this role.</p>

        {(job.application_packages?.length ?? 0) > 0 && (
          <ul className="space-y-2">
            {job.application_packages!.map((pkg) => (
              <li key={pkg.id} className="flex items-start justify-between gap-4 p-4 bg-slate-50 rounded-xl text-sm">
                <div className="space-y-1 min-w-0">
                  <p className="font-semibold text-slate-800">
                    {pkg.cv_version_label ?? 'CV Package'}
                  </p>
                  {pkg.cv_file_url && (
                    <a href={pkg.cv_file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-sky-600 hover:underline flex items-center gap-1">
                      <ExternalLinkIcon className="w-3 h-3" /> View CV
                    </a>
                  )}
                  {pkg.cover_letter && (
                    <p className="text-xs text-slate-500 line-clamp-2">{pkg.cover_letter}</p>
                  )}
                </div>
                <DeleteButton
                  action={deleteApplicationPackage.bind(null, pkg.id, id)}
                  label=""
                  confirmMessage="Delete this application package?"
                />
              </li>
            ))}
          </ul>
        )}

        <details>
          <summary className="flex items-center gap-1.5 text-sm font-semibold text-sky-600 cursor-pointer list-none hover:text-sky-500 transition-colors w-fit">
            <PlusIcon className="w-4 h-4" />
            Add Package
          </summary>
          <form action={createApplicationPackage} className="mt-4 space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <input type="hidden" name="job_id" value={id} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={miniLabelCls}>CV Version Label</label>
                <input type="text" name="cv_version_label" placeholder="e.g. CV v3 — SWE focus" className={miniInputCls} />
              </div>
              <div>
                <label className={miniLabelCls}>CV File URL</label>
                <input type="url" name="cv_file_url" pattern="https?://.*" placeholder="https://drive.google.com/…" className={miniInputCls} />
              </div>
            </div>
            <div>
              <label className={miniLabelCls}>Cover Letter</label>
              <textarea name="cover_letter" rows={5} placeholder="Paste your cover letter here…" className={miniInputCls} />
            </div>
            <SubmitButton
              label="Save Package"
              className="bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-50 transition-colors"
            />
          </form>
        </details>
      </div>
    </div>
  )
}