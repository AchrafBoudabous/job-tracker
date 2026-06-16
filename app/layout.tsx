import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { createClient } from '@/lib/supabase/server'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Job Tracker',
  description: 'Manage your job applications like a pro',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  // getSession() reads the cookie locally — no network call.
  // Security-critical auth is already handled by the proxy (which uses getUser()).
  // Here we only need the email to display in the Navbar.
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const user = session?.user

  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 min-h-screen`}>
        {user ? (
          <>
            <Navbar userEmail={user.email} />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
              {children}
            </main>
          </>
        ) : (
          children
        )}
      </body>
    </html>
  )
}
