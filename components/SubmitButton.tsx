'use client'

import { useFormStatus } from 'react-dom'

interface Props {
  label: string
  pendingLabel?: string
  className?: string
}

export default function SubmitButton({ label, pendingLabel, className }: Props) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className={
        className ??
        'w-full bg-sky-500 hover:bg-sky-400 text-white font-semibold py-2.5 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm'
      }
    >
      {pending ? (pendingLabel ?? 'Saving…') : label}
    </button>
  )
}