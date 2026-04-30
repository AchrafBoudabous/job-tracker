import SubmitButton from '@/components/SubmitButton'
import type { Job, ApplicationStatus } from '@/lib/types'

const STATUSES: { value: ApplicationStatus; label: string }[] = [
  { value: 'saved',     label: 'Saved' },
  { value: 'applied',   label: 'Applied' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer',     label: 'Offer' },
  { value: 'rejected',  label: 'Rejected' },
  { value: 'withdrawn', label: 'Withdrawn' },
]

const inputCls =
  'w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-colors'

const labelCls = 'block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5'

interface Props {
  action: (formData: FormData) => Promise<void>
  defaultValues?: Partial<Job>
}

export default function JobForm({ action, defaultValues }: Props) {
  const today = new Date().toISOString().split('T')[0]

  return (
    <form action={action} className="space-y-5">
      {defaultValues?.id && (
        <input type="hidden" name="id" value={defaultValues.id} />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Company" name="company" required defaultValue={defaultValues?.company} />
        <Field label="Role / Position" name="role" required defaultValue={defaultValues?.role} />

        <div>
          <label className={labelCls}>Status</label>
          <select
            name="status"
            required
            defaultValue={defaultValues?.status ?? 'saved'}
            className={inputCls}
          >
            {STATUSES.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <Field label="Location" name="location" placeholder="e.g. London, Remote" defaultValue={defaultValues?.location ?? ''} />
        <Field label="Date Applied" name="applied_date" type="date" defaultValue={defaultValues?.applied_date ?? today} />
        <Field label="Follow-up Date" name="follow_up_date" type="date" defaultValue={defaultValues?.follow_up_date ?? ''} />
        <Field label="Salary Range" name="salary_range" placeholder="e.g. £60k – £80k" defaultValue={defaultValues?.salary_range ?? ''} />
        <Field label="Source" name="source" placeholder="e.g. LinkedIn, Referral" defaultValue={defaultValues?.source ?? ''} />
      </div>

      <Field label="Job URL" name="job_url" type="url" placeholder="https://" pattern="https?://.*" defaultValue={defaultValues?.job_url ?? ''} />

      <div>
        <label className={labelCls}>Notes</label>
        <textarea
          name="notes"
          rows={3}
          defaultValue={defaultValues?.notes ?? ''}
          placeholder="Any notes about this role…"
          className={inputCls}
        />
      </div>

      <div>
        <label className={labelCls}>Job Description Snapshot</label>
        <textarea
          name="job_description_snapshot"
          rows={5}
          defaultValue={defaultValues?.job_description_snapshot ?? ''}
          placeholder="Paste the job description here for reference…"
          className={inputCls}
        />
      </div>

      <SubmitButton label={defaultValues?.id ? 'Save Changes' : 'Add Application'} />
    </form>
  )
}

function Field({
  label,
  name,
  type = 'text',
  required = false,
  placeholder,
  defaultValue,
  pattern,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  placeholder?: string
  defaultValue?: string | null
  pattern?: string
}) {
  return (
    <div>
      <label className={labelCls}>{label}{required && <span className="text-sky-500 ml-0.5">*</span>}</label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue ?? ''}
        pattern={pattern}
        className={inputCls}
      />
    </div>
  )
}