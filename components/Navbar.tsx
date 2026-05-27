'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BriefcaseIcon,
  LayoutDashboardIcon,
  BarChart2Icon,
  PlusIcon,
  TrophyIcon,
  MenuIcon,
  XIcon,
  LogOutIcon,
} from 'lucide-react'
import { signOut } from '@/app/auth/actions'

const links = [
  { href: '/',             label: 'Dashboard',    icon: LayoutDashboardIcon },
  { href: '/applications', label: 'Applications', icon: BriefcaseIcon },
  { href: '/analytics',    label: 'Analytics',    icon: BarChart2Icon },
  { href: '/achievements', label: 'Achievements', icon: TrophyIcon },
]

interface Props {
  userEmail?: string
}

export default function Navbar({ userEmail }: Props) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-slate-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5 font-bold text-lg text-white shrink-0"
        >
          <span className="flex items-center justify-center w-8 h-8 bg-sky-500 rounded-lg shrink-0">
            <BriefcaseIcon className="w-4 h-4 text-white" />
          </span>
          <span>JobTracker</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-0.5">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === href
                  ? 'bg-slate-800 text-sky-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}

          <Link
            href="/applications/new"
            className="flex items-center gap-1.5 ml-3 px-4 py-2 bg-sky-500 text-white rounded-lg text-sm font-semibold hover:bg-sky-400 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Add Job
          </Link>

          {/* User email + sign-out */}
          <div className="flex items-center gap-2 ml-3 pl-3 border-l border-slate-700">
            {userEmail && (
              <span className="text-slate-500 text-xs hidden lg:block max-w-35 truncate" title={userEmail}>
                {userEmail}
              </span>
            )}
            <form action={signOut}>
              <button
                type="submit"
                title="Sign out"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <LogOutIcon className="w-4 h-4" />
                <span className="hidden lg:inline">Sign out</span>
              </button>
            </form>
          </div>
        </div>

        {/* Mobile: Add + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/applications/new"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center w-9 h-9 bg-sky-500 text-white rounded-lg hover:bg-sky-400 transition-colors"
            aria-label="Add Job"
          >
            <PlusIcon className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center justify-center w-9 h-9 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 py-3 space-y-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                pathname === href
                  ? 'bg-slate-800 text-sky-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
          <div className="pt-2 pb-1 space-y-1">
            <Link
              href="/applications/new"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-3 bg-sky-500 text-white rounded-xl text-sm font-semibold hover:bg-sky-400 transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              Add New Job
            </Link>

            <form action={signOut}>
              <button
                type="submit"
                className="w-full flex items-center gap-3 px-3 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl text-sm font-medium transition-colors"
              >
                <LogOutIcon className="w-4 h-4" />
                Sign out{userEmail ? ` (${userEmail})` : ''}
              </button>
            </form>
          </div>
        </div>
      )}
    </nav>
  )
}
