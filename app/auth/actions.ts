'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { checkRateLimit } from '@/lib/rate-limit'

export async function signIn(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string }> {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: (formData.get('email') as string).trim().toLowerCase(),
    password: formData.get('password') as string,
  })

  if (error) {
    return { error: 'Invalid email or password.' }
  }

  redirect('/')
}

export async function signUp(
  _prevState: { error: string } | { success: true } | null,
  formData: FormData
): Promise<{ error: string } | { success: true }> {
  const ip = ((await headers()).get('x-forwarded-for') ?? 'unknown').split(',')[0].trim()
  if (!checkRateLimit(`signup:${ip}`, 5, 60 * 60 * 1000)) {
    return { error: 'Too many sign-up attempts. Please try again in an hour.' }
  }

  const email    = (formData.get('email')           as string).trim().toLowerCase()
  const password =  formData.get('password')        as string
  const confirm  =  formData.get('confirmPassword') as string

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters.' }
  }
  if (password !== confirm) {
    return { error: 'Passwords do not match.' }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error) return { error: error.message }

  // If email confirmation is disabled in Supabase, a session is returned
  // immediately — redirect straight to the app.
  if (data.session) redirect('/')

  // Otherwise the user must click the confirmation link in their inbox.
  return { success: true }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
