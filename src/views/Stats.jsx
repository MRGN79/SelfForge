import React, { useMemo } from 'react'
import { t } from '../i18n.js'
import { habitStats } from '../utils/gamification.js'
import { toDateStr } from '../utils/dates.js'
import StreakBadge from '../components/StreakBadge.jsx'
import ConsistencyBar from '../components/ConsistencyBar.jsx'

export default function Stats({ habits, logs }) {
  const today = toDateStr()

  const stats = useMemo(
    () => habits.filter(h => h.active).map(h => ({ habit: h, ...habitStats(h, logs, today) })),
    [habits, logs, today]
  )

  const overallConsistency = useMemo(() => {
    if (stats.length === 0) return 0
    return Math.round(stats.reduce((sum, s) => sum + s.consistency, 0) / stats.length)
  }, [stats])

  return (
    <main className="max-w-2xl mx-auto px-4 py-6" id="main-content">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('statsTitle')}</h1>

      {stats.length === 0 ? (
        <p className="text-center text-gray-400 py-16">{t('statsNoData')}</p>
      ) : (
        <>
          {/* Overall */}
          <section aria-labelledby="stats-overall-heading" className="bg-indigo-50 rounded-2xl p-5 mb-6">
            <h2 id="stats-overall-heading" className="text-sm font-semibold text-indigo-700 uppercase tracking-wide mb-3">
              {t('statsOverall')}
            </h2>
            <ConsistencyBar value={overallConsistency} />
          </section>

          {/* Per-habit */}
          <ul className="space-y-4" role="list">
            {stats.map(({ habit, streak, maxStreak, consistency }) => (
              <li key={habit.id}>
                <article
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
                  aria-label={habit.name}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: habit.color }}
                      aria-hidden="true"
                    />
                    <h3 className="font-semibold text-gray-900">{habit.name}</h3>
                    {habit.category && (
                      <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        {habit.category}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{t('statsStreak')}</p>
                      <StreakBadge streak={streak} maxStreak={maxStreak} type={habit.type} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{t('statsConsistency')}</p>
                      <ConsistencyBar value={consistency} />
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  )
}
