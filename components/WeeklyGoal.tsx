'use client'

import { useState, useEffect } from 'react'
import { TargetIcon, FlameIcon, PencilIcon, CheckIcon } from 'lucide-react'

interface Props {
  appliedThisWeek: number
  weeklyApplicationCounts: number[]
}

export default function WeeklyGoal({ appliedThisWeek, weeklyApplicationCounts }: Props) {
  const [goal, setGoal] = useState(5)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('5')

  useEffect(() => {
    const saved = localStorage.getItem('weekly_goal')
    if (saved) {
      const n = parseInt(saved)
      if (!isNaN(n) && n > 0) {
        setGoal(n)
        setDraft(String(n))
      }
    }
  }, [])

  function save() {
    const n = parseInt(draft)
    if (!isNaN(n) && n > 0) {
      setGoal(n)
      localStorage.setItem('weekly_goal', String(n))
    }
    setEditing(false)
  }

  const streak = weeklyApplicationCounts.reduce(
    (acc: { weeks: number; done: boolean }, count: number) => {
      if (!acc.done && count >= goal) return { weeks: acc.weeks + 1, done: false }
      return { ...acc, done: true }
    },
    { weeks: 0, done: false }
  ).weeks

  const progress = Math.min(appliedThisWeek / goal, 1)
  const pct = Math.round(progress * 100)
  const done = appliedThisWeek >= goal

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <TargetIcon className="w-5 h-5 text-sky-500" />
          <h2 className="font-semibold text-slate-900">Weekly Goal</h2>
        </div>
        <div className="flex items-center gap-3">
          {streak > 0 && (
            <div className="flex items-center gap-1 text-sm font-semibold text-amber-500">
              <FlameIcon className="w-4 h-4" />
              {streak}w streak
            </div>
          )}
          {editing ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && save()}
                min={1}
                max={99}
                autoFocus
                className="w-14 text-center border border-slate-200 rounded-lg px-2 py-1 text-sm text-slate-900 focus:outline-none focus:border-sky-400"
              />
              <button
                onClick={save}
                className="text-emerald-600 hover:text-emerald-500"
                aria-label="Save goal"
              >
                <CheckIcon className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              <PencilIcon className="w-3 h-3" />
              {goal}/week
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-4xl font-bold text-slate-900">{appliedThisWeek}</span>
            <span className="text-slate-400 text-sm ml-2">/ {goal} applications</span>
          </div>
          {done && (
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full">
              Goal reached!
            </span>
          )}
        </div>

        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-2.5 rounded-full transition-all duration-700 ${
              done ? 'bg-emerald-400' : 'bg-sky-400'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>

        <p className="text-xs text-slate-400">
          {done
            ? '🎉 Keep the momentum going!'
            : appliedThisWeek === 0
            ? 'No applications yet this week'
            : `${goal - appliedThisWeek} more to hit your goal`}
        </p>
      </div>

      {weeklyApplicationCounts.length > 1 && (
        <div className="mt-5 pt-4 border-t border-slate-50">
          <p className="text-xs text-slate-400 mb-2">Last 8 weeks</p>
          <div className="flex items-end gap-1 h-8">
            {weeklyApplicationCounts
              .slice(0, 8)
              .reverse()
              .map((count, i) => {
                const maxCount = Math.max(...weeklyApplicationCounts.slice(0, 8), 1)
                const heightPct = (count / maxCount) * 100
                const isCurrentWeek = i === weeklyApplicationCounts.slice(0, 8).length - 1
                return (
                  <div
                    key={i}
                    title={`${count} application${count !== 1 ? 's' : ''}`}
                    className={`flex-1 rounded-sm transition-all ${
                      isCurrentWeek
                        ? done
                          ? 'bg-emerald-400'
                          : 'bg-sky-400'
                        : 'bg-slate-200'
                    }`}
                    style={{ height: `${Math.max(heightPct, 8)}%` }}
                  />
                )
              })}
          </div>
        </div>
      )}
    </div>
  )
}