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
  const {
    data: { user },
  } = await supabase.auth.getUser()

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
