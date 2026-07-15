import React, { useMemo } from 'react'
import { t } from '../i18n.js'
import { toDateStr, isScheduledOn } from '../utils/dates.js'
import { habitStats } from '../utils/gamification.js'
import HabitCard from '../components/HabitCard.jsx'

export default function Dashboard({ habits, logs, onToggle, onNote }) {
  const today = toDateStr()

  const todayHabits = useMemo(
    () => habits.filter(h => isScheduledOn(h, today)),
    [habits, today]
  )

  const todayLogs = useMemo(
    () => Object.fromEntries(
      logs
        .filter(l => l.date === today)
        .map(l => [l.habitId, l])
    ),
    [logs, today]
  )

  const doneCount = todayHabits.filter(h => todayLogs[h.id]?.completed).length
  const total = todayHabits.length

  const allDone = total > 0 && doneCount === total

  return (
    <main className="view-enter max-w-2xl mx-auto px-4 py-6" id="main-content">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-stone-100 tracking-wide">{t('dashboardTitle')}</h1>
        {total > 0 && (
          <div className="rust-section mt-3 bg-stone-900/60 border border-stone-800 rounded-lg p-4">
            <div className="flex items-baseline justify-between mb-2">
              <p className={`text-sm font-semibold ${allDone ? 'ember-text' : 'text-stone-300'}`}>
                {allDone ? t('dashboardAllDone') : t('dashboardProgress', { done: doneCount, total })}
              </p>
              <span className="font-display text-lg font-bold text-stone-100 tabular-nums">
                {doneCount}<span className="text-stone-500 text-sm">/{total}</span>
              </span>
            </div>
            <div
              role="progressbar"
              aria-valuenow={doneCount}
              aria-valuemin={0}
              aria-valuemax={total}
              aria-label={t('dashboardProgress', { done: doneCount, total })}
              className="h-2.5 bg-stone-950/70 rounded-full overflow-hidden border border-stone-800"
            >
              <div
                className={`relative h-full rounded-full transition-all duration-500 ease-out overflow-hidden ${allDone ? 'bar-shimmer' : ''}`}
                style={{
                  width: total > 0 ? `${(doneCount / total) * 100}%` : '0%',
                  backgroundImage: 'linear-gradient(90deg, #ea580c, #fbbf24)',
                }}
              />
            </div>
          </div>
        )}
      </div>

      {todayHabits.length === 0 ? (
        <div className="text-center py-16">
          <p aria-hidden="true" className="text-5xl mb-4 opacity-80">🪨</p>
          <p className="text-stone-500">{t('dashboardEmpty')}</p>
        </div>
      ) : (
        <ul className="space-y-3" role="list">
          {todayHabits.map(habit => {
            const stats = habitStats(habit, logs, today)
            return (
              <li key={habit.id}>
                <HabitCard
                  habit={habit}
                  log={todayLogs[habit.id]}
                  streak={stats.streak}
                  maxStreak={stats.maxStreak}
                  consistency={stats.consistency}
                  onToggle={onToggle}
                  onNote={onNote}
                />
              </li>
            )
          })}
        </ul>
      )}
    </main>
  )
}
