import { toDateStr, fromDateStr, lastNDays, isScheduledOn, toWeekStr } from './dates.js'

// Returns the log entry for a habit on a specific date (or null)
export function getLog(logs, habitId, dateStr) {
  return logs.find(l => l.habitId === habitId && l.date === dateStr) ?? null
}

// Returns true if a daily habit was completed on dateStr
function dailyCompleted(logs, habitId, dateStr) {
  const log = getLog(logs, habitId, dateStr)
  return log?.completed === true
}

// Returns true if a weekly habit met its frequency in the week containing dateStr
function weeklyCompleted(logs, habit, dateStr) {
  const weekStr = toWeekStr(fromDateStr(dateStr))
  const freq = habit.frequency ?? 1
  const completedCount = logs.filter(
    l => l.habitId === habit.id && l.completed && toWeekStr(fromDateStr(l.date)) === weekStr
  ).length
  return completedCount >= freq
}

// Current streak for a habit (days or weeks depending on type)
export function currentStreak(habit, logs, today = toDateStr()) {
  if (habit.type === 'weekly') {
    return weeklyStreak(habit, logs, today)
  }
  return dailyStreak(habit, logs, today)
}

function dailyStreak(habit, logs, today) {
  let streak = 0
  const base = fromDateStr(today)

  for (let i = 0; i < 365; i++) {
    const d = new Date(base)
    d.setDate(d.getDate() - i)
    const dateStr = toDateStr(d)

    if (!isScheduledOn(habit, dateStr)) continue
    if (!dailyCompleted(logs, habit.id, dateStr)) break
    streak++
  }
  return streak
}

function weeklyStreak(habit, logs, today) {
  let streak = 0
  const base = fromDateStr(today)

  for (let i = 0; i < 52; i++) {
    const d = new Date(base)
    d.setDate(d.getDate() - i * 7)
    const dateStr = toDateStr(d)

    if (!isScheduledOn(habit, dateStr)) continue
    if (!weeklyCompleted(logs, habit, dateStr)) break
    streak++
  }
  return streak
}

// Maximum streak ever recorded for a habit
export function maxStreak(habit, logs, today = toDateStr()) {
  if (habit.type === 'weekly') {
    return maxWeeklyStreak(habit, logs, today)
  }
  return maxDailyStreak(habit, logs, today)
}

function maxDailyStreak(habit, logs, today) {
  const startDate = habit.startDate ?? toDateStr(new Date(0))
  const start = fromDateStr(startDate > today ? today : startDate)
  const end = fromDateStr(today)
  const totalDays = Math.min(Math.round((end - start) / 86400000) + 1, 3650)
  const days = lastNDays(totalDays, today).filter(d => d >= startDate)

  let best = 0
  let current = 0
  for (const dateStr of days) {
    if (!isScheduledOn(habit, dateStr)) continue
    if (dailyCompleted(logs, habit.id, dateStr)) {
      current++
      best = Math.max(best, current)
    } else {
      current = 0
    }
  }
  return best
}

function maxWeeklyStreak(habit, logs, today) {
  let best = 0
  let current = 0
  const base = fromDateStr(today)
  const startDate = habit.startDate ?? toDateStr(new Date(0))
  const startMs = fromDateStr(startDate).getTime()
  const totalWeeks = Math.min(Math.ceil((base.getTime() - startMs) / (7 * 86400000)) + 1, 520)

  for (let i = totalWeeks - 1; i >= 0; i--) {
    const d = new Date(base)
    d.setDate(d.getDate() - i * 7)
    const dateStr = toDateStr(d)

    if (dateStr < startDate) continue
    if (!isScheduledOn(habit, dateStr)) continue
    if (weeklyCompleted(logs, habit, dateStr)) {
      current++
      best = Math.max(best, current)
    } else {
      current = 0
    }
  }
  return best
}

// Consistency % in last 30 days: completed / expected
export function consistency30(habit, logs, today = toDateStr()) {
  const days = lastNDays(30, today)

  if (habit.type === 'weekly') {
    // Count unique weeks in those 30 days
    const weeks = [...new Set(days.map(d => toWeekStr(fromDateStr(d))))]
    const expected = weeks.filter(w => {
      const monday = mondayOfWeek(w)
      return isScheduledOn(habit, monday)
    }).length
    if (expected === 0) return 0

    const completed = weeks.filter(w => {
      const monday = mondayOfWeek(w)
      return isScheduledOn(habit, monday) && weeklyCompleted(logs, habit, monday)
    }).length
    return Math.round((completed / expected) * 100)
  }

  const scheduled = days.filter(d => isScheduledOn(habit, d))
  if (scheduled.length === 0) return 0
  const completed = scheduled.filter(d => dailyCompleted(logs, habit.id, d)).length
  return Math.round((completed / scheduled.length) * 100)
}

// Returns the Monday date string of an ISO week string like '2024-W03'
function mondayOfWeek(weekStr) {
  const [year, weekPart] = weekStr.split('-W')
  const w = parseInt(weekPart, 10)
  const jan4 = new Date(parseInt(year, 10), 0, 4)
  const monday = new Date(jan4)
  monday.setDate(jan4.getDate() - ((jan4.getDay() + 6) % 7) + (w - 1) * 7)
  return toDateStr(monday)
}

// Returns stats object for a single habit
export function habitStats(habit, logs, today = toDateStr()) {
  return {
    habitId: habit.id,
    streak: currentStreak(habit, logs, today),
    maxStreak: maxStreak(habit, logs, today),
    consistency: consistency30(habit, logs, today),
  }
}

// Returns stats for all habits
export function allStats(habits, logs, today = toDateStr()) {
  return habits.map(h => habitStats(h, logs, today))
}
