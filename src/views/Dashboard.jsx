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

  return (
    <main className="max-w-2xl mx-auto px-4 py-6" id="main-content">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('dashboardTitle')}</h1>
        {total > 0 && (
          <p className="text-sm text-gray-500 mt-1">
            {doneCount === total
              ? t('dashboardAllDone')
              : t('dashboardProgress', { done: doneCount, total })}
          </p>
        )}
        {total > 0 && (
          <div
            role="progressbar"
            aria-valuenow={doneCount}
            aria-valuemin={0}
            aria-valuemax={total}
            aria-label={t('dashboardProgress', { done: doneCount, total })}
            className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden"
          >
            <div
              className="h-full bg-indigo-500 rounded-full transition-all"
              style={{ width: total > 0 ? `${(doneCount / total) * 100}%` : '0%' }}
            />
          </div>
        )}
      </div>

      {todayHabits.length === 0 ? (
        <p className="text-center text-gray-400 py-16">{t('dashboardEmpty')}</p>
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
