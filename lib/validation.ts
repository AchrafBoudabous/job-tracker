import { z } from 'zod'

const blankToNull = (v: unknown) => (v === '' ? null : v)

const optionalDate = z.preprocess(
  blankToNull,
  z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .refine((val) => {
      const year = parseInt(val.split('-')[0], 10)
      return year >= 1900 && year <= 2100
    }, 'Date year must be between 1900 and 2100')
    .nullable()
    .optional()
)

const optionalHttpUrl = z.preprocess(
  blankToNull,
  z
    .string()
    .url('Must be a valid URL')
    .regex(/^https?:\/\//, 'URL must start with http:// or https://')
    .max(2048, 'URL is too long (max 2048 characters)')
    .nullable()
    .optional()
)

const optionalShortText = (max: number) =>
  z.preprocess(blankToNull, z.string().max(max).nullable().optional())

export const APPLICATION_STATUSES = [
  'saved',
  'applied',
  'interview',
  'offer',
  'rejected',
  'withdrawn',
] as const

export const JobSchema = z.object({
  company: z.string().min(1, 'Company is required').max(200, 'Company name is too long'),
  role:    z.string().min(1, 'Role is required').max(200, 'Role name is too long'),
  status:  z.enum(APPLICATION_STATUSES, { message: 'Invalid status value' }),

  applied_date:   optionalDate,
  follow_up_date: optionalDate,

  location:    optionalShortText(200),
  salary_range: optionalShortText(100),
  source:      optionalShortText(100),

  job_url: optionalHttpUrl,

  notes:                    z.preprocess(blankToNull, z.string().max(10_000).nullable().optional()),
  job_description_snapshot: z.preprocess(blankToNull, z.string().max(50_000).nullable().optional()),
})

export const InterviewRoundSchema = z.object({
  job_id:         z.string().uuid('Invalid job ID'),
  round_number:   z.coerce.number().int().min(1).max(50),
  interview_date: optionalDate,
  interview_type: optionalShortText(100),
  notes:          z.preprocess(blankToNull, z.string().max(10_000).nullable().optional()),
  questions:      z.preprocess(blankToNull, z.string().max(10_000).nullable().optional()),
})

export const ContactSchema = z.object({
  job_id: z.string().uuid('Invalid job ID'),
  name:   z.string().min(1, 'Name is required').max(200),
  title:  optionalShortText(200),
  email:  z.preprocess(
    blankToNull,
    z.string().email('Invalid email address').nullable().optional()
  ),
  linkedin_url: optionalHttpUrl,
  notes:        z.preprocess(blankToNull, z.string().max(10_000).nullable().optional()),
})

export const ApplicationPackageSchema = z.object({
  job_id:           z.string().uuid('Invalid job ID'),
  cv_version_label: optionalShortText(200),
  cv_file_url:      optionalHttpUrl,
  cover_letter:     z.preprocess(blankToNull, z.string().max(50_000).nullable().optional()),
})