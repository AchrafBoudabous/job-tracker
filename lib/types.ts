export type ApplicationStatus =
  | 'saved'
  | 'applied'
  | 'interview'
  | 'offer'
  | 'rejected'
  | 'withdrawn'

export interface Job {
  id: string
  company: string
  role: string
  location: string | null
  job_url: string | null
  job_description_snapshot?: string | null
  status: ApplicationStatus
  applied_date: string | null
  follow_up_date: string | null
  salary_range: string | null
  source: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface ApplicationPackage {
  id: string
  job_id: string
  cv_version_label: string | null
  cv_file_url: string | null
  cover_letter: string | null
  created_at: string
}

export interface InterviewRound {
  id: string
  job_id: string
  round_number: number
  interview_date: string | null
  interview_type: string | null
  notes: string | null
  questions: string | null
  created_at: string
}

export interface Contact {
  id: string
  job_id: string
  name: string
  title: string | null
  email: string | null
  linkedin_url: string | null
  notes: string | null
  created_at: string
}

export type JobWithPackage = Job & {
  application_packages?: ApplicationPackage[]
  interview_rounds?: InterviewRound[]
  contacts?: Contact[]
}