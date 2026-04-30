'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { ApplicationStatus } from '@/lib/types'


export async function createJob(formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.from('jobs').insert({
    company: formData.get('company') as string,
    role: formData.get('role') as string,
    status: formData.get('status') as ApplicationStatus,
    applied_date: (formData.get('applied_date') as string) || null,
    follow_up_date: (formData.get('follow_up_date') as string) || null,
    location: (formData.get('location') as string) || null,
    job_url: (formData.get('job_url') as string) || null,
    salary_range: (formData.get('salary_range') as string) || null,
    source: (formData.get('source') as string) || null,
    notes: (formData.get('notes') as string) || null,
    job_description_snapshot: (formData.get('job_description_snapshot') as string) || null,
  })

  if (error) throw new Error(error.message)

  revalidatePath('/applications')
  redirect('/applications')
}

export async function updateJob(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string

  const { error } = await supabase
    .from('jobs')
    .update({
      company: formData.get('company') as string,
      role: formData.get('role') as string,
      status: formData.get('status') as ApplicationStatus,
      applied_date: (formData.get('applied_date') as string) || null,
      follow_up_date: (formData.get('follow_up_date') as string) || null,
      location: (formData.get('location') as string) || null,
      job_url: (formData.get('job_url') as string) || null,
      salary_range: (formData.get('salary_range') as string) || null,
      source: (formData.get('source') as string) || null,
      notes: (formData.get('notes') as string) || null,
      job_description_snapshot: (formData.get('job_description_snapshot') as string) || null,
    })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/applications')
  revalidatePath(`/applications/${id}`)
  redirect(`/applications/${id}`)
}

export async function deleteJob(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('jobs').delete().eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/applications')
  redirect('/applications')
}

export async function createInterviewRound(formData: FormData) {
  const supabase = await createClient()
  const jobId = formData.get('job_id') as string

  const { error } = await supabase.from('interview_rounds').insert({
    job_id: jobId,
    round_number: Number(formData.get('round_number') ?? 1),
    interview_date: (formData.get('interview_date') as string) || null,
    interview_type: (formData.get('interview_type') as string) || null,
    notes: (formData.get('notes') as string) || null,
    questions: (formData.get('questions') as string) || null,
  })

  if (error) throw new Error(error.message)

  revalidatePath(`/applications/${jobId}`)
}

export async function deleteInterviewRound(id: string, jobId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('interview_rounds').delete().eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath(`/applications/${jobId}`)
}

export async function createContact(formData: FormData) {
  const supabase = await createClient()
  const jobId = formData.get('job_id') as string

  const { error } = await supabase.from('contacts').insert({
    job_id: jobId,
    name: formData.get('name') as string,
    title: (formData.get('title') as string) || null,
    email: (formData.get('email') as string) || null,
    linkedin_url: (formData.get('linkedin_url') as string) || null,
    notes: (formData.get('notes') as string) || null,
  })

  if (error) throw new Error(error.message)

  revalidatePath(`/applications/${jobId}`)
}

export async function deleteContact(id: string, jobId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('contacts').delete().eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath(`/applications/${jobId}`)
}

export async function createApplicationPackage(formData: FormData) {
  const supabase = await createClient()
  const jobId = formData.get('job_id') as string

  const { error } = await supabase.from('application_packages').insert({
    job_id: jobId,
    cv_version_label: (formData.get('cv_version_label') as string) || null,
    cv_file_url: (formData.get('cv_file_url') as string) || null,
    cover_letter: (formData.get('cover_letter') as string) || null,
  })

  if (error) throw new Error(error.message)

  revalidatePath(`/applications/${jobId}`)
}

export async function deleteApplicationPackage(id: string, jobId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('application_packages').delete().eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath(`/applications/${jobId}`)
}