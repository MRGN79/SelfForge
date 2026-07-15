import React from 'react'
import { t } from '../i18n.js'

export default function StreakBadge({ streak, maxStreak, type = 'daily' }) {
  const unit = type === 'weekly' ? 'streakWeeks' : 'streakDays'
  const label = t(unit, { n: streak })
  const isHot = streak >= 7

  return (
    <div className="flex items-center gap-2 text-sm" aria-label={`${label}. ${t('streakBest', { n: maxStreak })}`}>
      <span
        className={`font-bold text-base ${isHot ? 'flame-hot' : ''}`}
        style={{ color: isHot ? '#fb923c' : '#c2410c' }}
        aria-hidden="true"
      >
        🔥
      </span>
      <span className="font-bold text-stone-100 font-display">{streak}</span>
      <span className="text-stone-500 text-xs">{t('streakBest', { n: maxStreak })}</span>
    </div>
  )
}
