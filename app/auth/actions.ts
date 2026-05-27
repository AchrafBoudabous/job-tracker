'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'


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


export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
