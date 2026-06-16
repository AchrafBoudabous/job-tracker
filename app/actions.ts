'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import {
  JobSchema,
  InterviewRoundSchema,
  ContactSchema,
  ApplicationPackageSchema,
} from '@/lib/validation'

async function requireUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  return { supabase, user }
}

function parse<S extends z.ZodTypeAny>(schema: S, data: unknown): z.infer<S> {
  const result = schema.safeParse(data)
  if (!result.success) throw new Error(result.error.issues[0].message)
  return result.data
}

export async function createJob(formData: FormData) {
  const { supabase, user } = await requireUser()

  const data = parse(JobSchema, {
    company:                  formData.get('company'),
    role:                     formData.get('role'),
    status:                   formData.get('status'),
    applied_date:             formData.get('applied_date'),
    follow_up_date:           formData.get('follow_up_date'),
    location:                 formData.get('location'),
    job_url:                  formData.get('job_url'),
    salary_range:             formData.get('salary_range'),
    source:                   formData.get('source'),
    notes:                    formData.get('notes'),
    job_description_snapshot: formData.get('job_description_snapshot'),
  })

  const { error } = await supabase.from('jobs').insert({ ...data, user_id: user.id })
  if (error) throw new Error(error.message)

  revalidatePath('/applications')
  redirect('/applications')
}

export async function updateJob(formData: FormData) {
  const { supabase } = await requireUser()

  const id = formData.get('id') as string
  if (!id) throw new Error('Missing job ID')

  const data = parse(JobSchema, {
    company:                  formData.get('company'),
    role:                     formData.get('role'),
    status:                   formData.get('status'),
    applied_date:             formData.get('applied_date'),
    follow_up_date:           formData.get('follow_up_date'),
    location:                 formData.get('location'),
    job_url:                  formData.get('job_url'),
    salary_range:             formData.get('salary_range'),
    source:                   formData.get('source'),
    notes:                    formData.get('notes'),
    job_description_snapshot: formData.get('job_description_snapshot'),
  })

  const { error } = await supabase.from('jobs').update(data).eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/applications')
  revalidatePath(`/applications/${id}`)
  redirect(`/applications/${id}`)
}

export async function deleteJob(id: string) {
  const { supabase } = await requireUser()
  const { error } = await supabase.from('jobs').delete().eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/applications')
  redirect('/applications')
}

export async function createInterviewRound(formData: FormData) {
  const { supabase } = await requireUser()

  const data = parse(InterviewRoundSchema, {
    job_id:         formData.get('job_id'),
    round_number:   formData.get('round_number'),
    interview_date: formData.get('interview_date'),
    interview_type: formData.get('interview_type'),
    notes:          formData.get('notes'),
    questions:      formData.get('questions'),
  })

  const { error } = await supabase.from('interview_rounds').insert(data)
  if (error) throw new Error(error.message)

  revalidatePath(`/applications/${data.job_id}`)
}

export async function deleteInterviewRound(id: string, jobId: string) {
  const { supabase } = await requireUser()
  const { error } = await supabase.from('interview_rounds').delete().eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath(`/applications/${jobId}`)
}

export async function createContact(formData: FormData) {
  const { supabase } = await requireUser()

  const data = parse(ContactSchema, {
    job_id:       formData.get('job_id'),
    name:         formData.get('name'),
    title:        formData.get('title'),
    email:        formData.get('email'),
    linkedin_url: formData.get('linkedin_url'),
    notes:        formData.get('notes'),
  })

  const { error } = await supabase.from('contacts').insert(data)
  if (error) throw new Error(error.message)

  revalidatePath(`/applications/${data.job_id}`)
}

export async function deleteContact(id: string, jobId: string) {
  const { supabase } = await requireUser()
  const { error } = await supabase.from('contacts').delete().eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath(`/applications/${jobId}`)
}

export async function createApplicationPackage(formData: FormData) {
  const { supabase } = await requireUser()

  const data = parse(ApplicationPackageSchema, {
    job_id:           formData.get('job_id'),
    cv_version_label: formData.get('cv_version_label'),
    cv_file_url:      formData.get('cv_file_url'),
    cover_letter:     formData.get('cover_letter'),
  })

  const { error } = await supabase.from('application_packages').insert(data)
  if (error) throw new Error(error.message)

  revalidatePath(`/applications/${data.job_id}`)
}

export async function deleteApplicationPackage(id: string, jobId: string) {
  const { supabase } = await requireUser()
  const { error } = await supabase.from('application_packages').delete().eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath(`/applications/${jobId}`)
}