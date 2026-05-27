import React from 'react'
import { t } from '../i18n.js'

export default function ConsistencyBar({ value }) {
  const pct = Math.min(100, Math.max(0, value))
  const color = pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-400' : 'bg-red-400'

  return (
    <div className="flex items-center gap-2 text-sm">
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={t('statsConsistency')}
        className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden"
      >
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-gray-700 font-semibold w-10 text-right">{pct}%</span>
    </div>
  )
}
