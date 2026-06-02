// Returns 'YYYY-MM-DD' for a Date object (local time)
export function toDateStr(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// Parses 'YYYY-MM-DD' into a Date at midnight local time
export function fromDateStr(str) {
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, m - 1, d)
}

// Returns day-of-week index 0=Mon … 6=Sun
export function dayOfWeek(date = new Date()) {
  return (date.getDay() + 6) % 7
}

// Returns ISO week number for a date
export function isoWeek(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
}

// Returns 'YYYY-WNN' string for a date using the ISO week year (not calendar year)
export function toWeekStr(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
  const isoYear = d.getUTCFullYear()
  return `${isoYear}-W${String(isoWeek(date)).padStart(2, '0')}`
}

// List of date strings for the last N days (inclusive of today)
export function lastNDays(n, today = toDateStr()) {
  const result = []
  const base = fromDateStr(today)
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(base)
    d.setDate(d.getDate() - i)
    result.push(toDateStr(d))
  }
  return result
}

// Whether a habit is scheduled on a given date
export function isScheduledOn(habit, dateStr) {
  const date = fromDateStr(dateStr)

  if (habit.startDate && dateStr < habit.startDate) return false
  if (habit.endDate && dateStr > habit.endDate) return false
  if (!habit.active) return false

  if (habit.type === 'daily') {
    if (!habit.targetDays || habit.targetDays.length === 0) return true
    return habit.targetDays.includes(dayOfWeek(date))
  }

  // weekly habits are always "scheduled" (just need to complete N times this week)
  return true
}
