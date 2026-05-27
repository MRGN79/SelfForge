import { describe, it, expect } from 'vitest'
import {
  toDateStr,
  fromDateStr,
  dayOfWeek,
  isoWeek,
  toWeekStr,
  lastNDays,
  isScheduledOn,
} from '../utils/dates.js'

describe('toDateStr', () => {
  it('formats a date as YYYY-MM-DD', () => {
    expect(toDateStr(new Date(2024, 0, 5))).toBe('2024-01-05')
  })
  it('defaults to today without crashing', () => {
    expect(toDateStr()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})

describe('fromDateStr', () => {
  it('parses YYYY-MM-DD correctly', () => {
    const d = fromDateStr('2024-03-15')
    expect(d.getFullYear()).toBe(2024)
    expect(d.getMonth()).toBe(2)
    expect(d.getDate()).toBe(15)
  })
})

describe('dayOfWeek', () => {
  it('Monday → 0', () => expect(dayOfWeek(new Date(2024, 0, 1))).toBe(0)) // 2024-01-01 is Monday
  it('Sunday → 6', () => expect(dayOfWeek(new Date(2024, 0, 7))).toBe(6))
  it('defaults to today without crashing', () => {
    expect(dayOfWeek()).toBeGreaterThanOrEqual(0)
  })
})

describe('isoWeek', () => {
  it('returns correct ISO week', () => {
    expect(isoWeek(new Date(2024, 0, 1))).toBe(1)
    expect(isoWeek(new Date(2024, 0, 8))).toBe(2)
  })
})

describe('toWeekStr', () => {
  it('returns YYYY-WNN format', () => {
    expect(toWeekStr(new Date(2024, 0, 1))).toBe('2024-W01')
  })
  it('defaults to today without crashing', () => {
    expect(toWeekStr()).toMatch(/^\d{4}-W\d{2}$/)
  })
})

describe('lastNDays', () => {
  it('returns N dates ending on today', () => {
    const days = lastNDays(3, '2024-01-05')
    expect(days).toEqual(['2024-01-03', '2024-01-04', '2024-01-05'])
  })
  it('returns 1 day for n=1', () => {
    expect(lastNDays(1, '2024-01-05')).toEqual(['2024-01-05'])
  })
})

describe('isScheduledOn', () => {
  const base = { type: 'daily', active: true, startDate: '2024-01-01', endDate: null, targetDays: [] }

  it('returns true for active daily habit with no target days (every day)', () => {
    expect(isScheduledOn(base, '2024-03-15')).toBe(true)
  })

  it('returns false for inactive habit', () => {
    expect(isScheduledOn({ ...base, active: false }, '2024-03-15')).toBe(false)
  })

  it('returns false before startDate', () => {
    expect(isScheduledOn({ ...base, startDate: '2024-05-01' }, '2024-03-15')).toBe(false)
  })

  it('returns false after endDate', () => {
    expect(isScheduledOn({ ...base, endDate: '2024-01-31' }, '2024-03-15')).toBe(false)
  })

  it('respects targetDays for daily habits', () => {
    // 2024-01-01 is Monday (0)
    const habit = { ...base, targetDays: [0, 2] }
    expect(isScheduledOn(habit, '2024-01-01')).toBe(true)  // Monday
    expect(isScheduledOn(habit, '2024-01-02')).toBe(false) // Tuesday
    expect(isScheduledOn(habit, '2024-01-03')).toBe(true)  // Wednesday
  })

  it('returns true for weekly habit within date range', () => {
    const weekly = { ...base, type: 'weekly' }
    expect(isScheduledOn(weekly, '2024-03-15')).toBe(true)
  })
})
