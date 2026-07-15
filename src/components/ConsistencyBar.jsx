import React from 'react'
import { t } from '../i18n.js'

export default function ConsistencyBar({ value }) {
  const pct = Math.min(100, Math.max(0, value))
  // Every stop below clears 3:1 against the stone-900 track on its own, so the
  // fill stays legible (WCAG 1.4.11) no matter how short the bar is.
  const gradient = pct >= 80
    ? 'linear-gradient(90deg, #ea580c, #fb923c)'
    : pct >= 50
      ? 'linear-gradient(90deg, #d97706, #fbbf24)'
      : 'linear-gradient(90deg, #dc2626, #ef4444)'

  return (
    <div className="flex items-center gap-2 text-sm">
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={t('statsConsistency')}
        className="relative flex-1 h-2 bg-stone-900 rounded-full overflow-hidden border border-stone-800"
      >
        <div
          className={`relative h-full rounded-full transition-all duration-500 ease-out overflow-hidden ${pct >= 80 ? 'bar-shimmer' : ''}`}
          style={{ width: `${pct}%`, backgroundImage: gradient }}
        />
      </div>
      <span className="text-stone-300 font-bold w-10 text-right tabular-nums">{pct}%</span>
    </div>
  )
}
