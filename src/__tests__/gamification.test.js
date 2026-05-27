import { describe, it, expect } from 'vitest'
import {
  getLog,
  currentStreak,
  maxStreak,
  consistency30,
  habitStats,
  allStats,
} from '../utils/gamification.js'

const dailyHabit = {
  id: 'h1',
  type: 'daily',
  active: true,
  startDate: '2024-01-01',
  endDate: null,
  targetDays: [],
  frequency: 1,
}

const weeklyHabit = {
  id: 'h2',
  type: 'weekly',
  active: true,
  startDate: '2024-01-01',
  endDate: null,
  targetDays: [],
  frequency: 2,
}

function makeLog(habitId, date, completed = true) {
  return { id: `l_${date}`, habitId, date, completed, note: '' }
}

describe('getLog', () => {
  it('returns matching log', () => {
    const logs = [makeLog('h1', '2024-01-01')]
    expect(getLog(logs, 'h1', '2024-01-01')).toBeDefined()
  })

  it('returns null when no match', () => {
    expect(getLog([], 'h1', '2024-01-01')).toBeNull()
  })
})

describe('currentStreak - daily', () => {
  it('returns 0 when no logs', () => {
    expect(currentStreak(dailyHabit, [], '2024-01-05')).toBe(0)
  })

  it('counts consecutive days ending today', () => {
    const logs = [
      makeLog('h1', '2024-01-03'),
      makeLog('h1', '2024-01-04'),
      makeLog('h1', '2024-01-05'),
    ]
    expect(currentStreak(dailyHabit, logs, '2024-01-05')).toBe(3)
  })

  it('resets when a day is missed', () => {
    const logs = [
      makeLog('h1', '2024-01-01'),
      makeLog('h1', '2024-01-03'), // gap on Jan 2
      makeLog('h1', '2024-01-04'),
    ]
    expect(currentStreak(dailyHabit, logs, '2024-01-04')).toBe(2)
  })

  it('returns 0 when today is not completed', () => {
    const logs = [makeLog('h1', '2024-01-04')]
    expect(currentStreak(dailyHabit, logs, '2024-01-05')).toBe(0)
  })

  it('handles completed=false log as not completed', () => {
    const logs = [makeLog('h1', '2024-01-05', false)]
    expect(currentStreak(dailyHabit, logs, '2024-01-05')).toBe(0)
  })

  it('skips days before startDate', () => {
    const habit = { ...dailyHabit, startDate: '2024-01-03' }
    const logs = [makeLog('h1', '2024-01-03'), makeLog('h1', '2024-01-04')]
    expect(currentStreak(habit, logs, '2024-01-04')).toBe(2)
  })
})

describe('currentStreak - weekly', () => {
  it('returns 0 when no logs', () => {
    expect(currentStreak(weeklyHabit, [], '2024-01-05')).toBe(0)
  })

  it('counts 1 week when current week meets frequency', () => {
    // Week of 2024-01-01 (Mon), need 2 completions
    const logs = [makeLog('h2', '2024-01-01'), makeLog('h2', '2024-01-02')]
    expect(currentStreak(weeklyHabit, logs, '2024-01-05')).toBe(1)
  })

  it('returns 0 when current week not yet meeting frequency', () => {
    const logs = [makeLog('h2', '2024-01-01')] // only 1, need 2
    expect(currentStreak(weeklyHabit, logs, '2024-01-05')).toBe(0)
  })
})

describe('maxStreak - daily', () => {
  it('returns 0 with no logs', () => {
    expect(maxStreak(dailyHabit, [], '2024-01-05')).toBe(0)
  })

  it('finds the longest run', () => {
    const logs = [
      makeLog('h1', '2024-01-01'),
      makeLog('h1', '2024-01-02'),
      makeLog('h1', '2024-01-03'),
      // gap
      makeLog('h1', '2024-01-05'),
    ]
    expect(maxStreak(dailyHabit, logs, '2024-01-05')).toBe(3)
  })
})

describe('maxStreak - weekly', () => {
  it('returns 0 with no logs', () => {
    expect(maxStreak(weeklyHabit, [], '2024-01-14')).toBe(0)
  })

  it('finds best weekly streak', () => {
    // Week 1: 2 completions, Week 2: 2 completions → streak of 2
    const logs = [
      makeLog('h2', '2024-01-01'), makeLog('h2', '2024-01-02'), // week 1
      makeLog('h2', '2024-01-08'), makeLog('h2', '2024-01-09'), // week 2
    ]
    expect(maxStreak(weeklyHabit, logs, '2024-01-14')).toBe(2)
  })
})

describe('consistency30', () => {
  it('returns 0 with no logs', () => {
    expect(consistency30(dailyHabit, [], '2024-01-31')).toBe(0)
  })

  it('returns 100 when all days completed', () => {
    const days = Array.from({ length: 30 }, (_, i) => {
      const d = new Date(2024, 0, 2 + i)
      return makeLog('h1', `2024-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`)
    })
    expect(consistency30(dailyHabit, days, '2024-01-31')).toBe(100)
  })

  it('returns 0 for inactive habit', () => {
    expect(consistency30({ ...dailyHabit, active: false }, [], '2024-01-31')).toBe(0)
  })

  it('handles weekly habits', () => {
    // Last 30 days from 2024-01-31 → about 5 weeks
    // Complete 2 per week in weeks present
    const logs = [
      makeLog('h2', '2024-01-01'), makeLog('h2', '2024-01-02'),
      makeLog('h2', '2024-01-08'), makeLog('h2', '2024-01-09'),
    ]
    const result = consistency30(weeklyHabit, logs, '2024-01-14')
    expect(result).toBeGreaterThan(0)
    expect(result).toBeLessThanOrEqual(100)
  })
})

describe('habitStats', () => {
  it('returns streak, maxStreak, consistency for a habit', () => {
    const stats = habitStats(dailyHabit, [], '2024-01-05')
    expect(stats).toMatchObject({ habitId: 'h1', streak: 0, maxStreak: 0, consistency: 0 })
  })
})

describe('allStats', () => {
  it('returns stats for all habits', () => {
    const result = allStats([dailyHabit, weeklyHabit], [], '2024-01-05')
    expect(result).toHaveLength(2)
    expect(result[0].habitId).toBe('h1')
    expect(result[1].habitId).toBe('h2')
  })
})
