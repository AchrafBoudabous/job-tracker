import { createClient } from '@/lib/supabase/server'

export async function isAuthorized(request?: Request): Promise<boolean> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user) return true

  const secret = process.env.API_SECRET
  if (secret && request) {
    const auth = request.headers.get('authorization')
    if (auth === `Bearer ${secret}`) return true
  }

  return false
}