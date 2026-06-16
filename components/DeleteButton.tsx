'use client'

import { useState, useTransition } from 'react'
import { Trash2Icon } from 'lucide-react'

interface Props {
  action: () => Promise<void>
  label?: string
  confirmMessage?: string
  className?: string
}

export default function DeleteButton({
  action,
  label = 'Delete',
  confirmMessage = 'Are you sure?',
  className,
}: Props) {
  const [isPending, startTransition] = useTransition()
  const [confirming, setConfirming] = useState(false)

  if (confirming) {
    return (
      <span className="flex items-center gap-2">
        <span className="text-xs text-slate-500">{confirmMessage}</span>
        <button
          onClick={() => {
            setConfirming(false)
            startTransition(() => action())
          }}
          disabled={isPending}
          className="text-xs font-semibold text-rose-500 hover:text-rose-600 disabled:opacity-40 transition-colors"
        >
          {isPending ? 'Deleting…' : 'Yes, delete'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors"
        >
          Cancel
        </button>
      </span>
    )
  }

  return (
    <button
      disabled={isPending}
      onClick={() => setConfirming(true)}
      className={
        className ??
        'flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-rose-500 disabled:opacity-40 transition-colors'
      }
    >
      <Trash2Icon className="w-4 h-4" />
      {isPending ? 'Deleting…' : label}
    </button>
  )
}
