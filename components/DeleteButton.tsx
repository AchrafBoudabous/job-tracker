'use client'

import { useTransition } from 'react'
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
  confirmMessage = 'Are you sure you want to delete this?',
  className,
}: Props) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      disabled={isPending}
      onClick={() => {
        if (!confirm(confirmMessage)) return
        startTransition(() => action())
      }}
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