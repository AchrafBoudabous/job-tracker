'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useRef } from 'react'
import { SearchIcon } from 'lucide-react'

const inputCls =
  'bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-colors'

interface Props {
  initialQ: string
  initialSort: string
  initialDir: string
}

export default function SearchSortBar({ initialQ, initialSort, initialDir }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function push(updates: Record<string, string>) {
    const params = new URLSearchParams(window.location.search)
    Object.entries(updates).forEach(([k, v]) => {
      if (v) params.set(k, v)
      else params.delete(k)
    })
    router.push(`${pathname}?${params.toString()}`)
  }

  function handleSearch(value: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => push({ q: value }), 300)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="search"
          defaultValue={initialQ}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search role or company…"
          className={`${inputCls} pl-9 w-full`}
        />
      </div>

      <div className="flex gap-3">
        <select
          defaultValue={initialSort}
          onChange={(e) => push({ sort: e.target.value })}
          className={`${inputCls} flex-1 sm:flex-none`}
        >
          <option value="created_at">Date Added</option>
          <option value="applied_date">Date Applied</option>
          <option value="company">Company A–Z</option>
          <option value="role">Role A–Z</option>
        </select>

        <select
          defaultValue={initialDir}
          onChange={(e) => push({ dir: e.target.value })}
          className={`${inputCls} flex-1 sm:flex-none`}
        >
          <option value="desc">Newest first</option>
          <option value="asc">Oldest first</option>
        </select>
      </div>
    </div>
  )
}