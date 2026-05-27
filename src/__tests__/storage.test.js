import { describe, it, expect, beforeEach } from 'vitest'
import {
  getHabits, saveHabits,
  getLogs, saveLogs,
  getProfile, saveProfile,
} from '../storage.js'

beforeEach(() => localStorage.clear())

describe('habits storage', () => {
  it('returns empty array by default', () => {
    expect(getHabits()).toEqual([])
  })

  it('saves and retrieves habits', () => {
    const habits = [{ id: 'h1', name: 'Run' }]
    saveHabits(habits)
    expect(getHabits()).toEqual(habits)
  })
})

describe('logs storage', () => {
  it('returns empty array by default', () => {
    expect(getLogs()).toEqual([])
  })

  it('saves and retrieves logs', () => {
    const logs = [{ id: 'l1', habitId: 'h1', date: '2024-01-01', completed: true, note: '' }]
    saveLogs(logs)
    expect(getLogs()).toEqual(logs)
  })
})

describe('profile storage', () => {
  it('returns default profile when empty', () => {
    const p = getProfile()
    expect(p).toHaveProperty('name', '')
    expect(p).toHaveProperty('createdAt')
  })

  it('saves and retrieves profile', () => {
    const profile = { name: 'Alex', createdAt: '2024-01-01T00:00:00.000Z' }
    saveProfile(profile)
    expect(getProfile()).toEqual(profile)
  })
})

describe('storage error handling', () => {
  it('returns null-safe defaults when localStorage has corrupt data', () => {
    localStorage.setItem('selfforge_habits', 'not-json{{{')
    expect(getHabits()).toEqual([])
  })
})
