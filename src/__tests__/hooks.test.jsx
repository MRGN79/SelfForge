import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useHabits } from '../hooks/useHabits.js'
import { useLogs } from '../hooks/useLogs.js'
import { useProfile } from '../hooks/useProfile.js'
import { useLang } from '../hooks/useLang.js'

beforeEach(() => localStorage.clear())

// ── useHabits ──────────────────────────────────────────────────────────────
describe('useHabits', () => {
  it('starts with no habits', () => {
    const { result } = renderHook(() => useHabits())
    expect(result.current.habits).toEqual([])
  })

  it('adds a habit', () => {
    const { result } = renderHook(() => useHabits())
    act(() => { result.current.addHabit({ name: 'Run' }) })
    expect(result.current.habits).toHaveLength(1)
    expect(result.current.habits[0].name).toBe('Run')
  })

  it('addHabit fills defaults', () => {
    const { result } = renderHook(() => useHabits())
    act(() => { result.current.addHabit({ name: 'X' }) })
    const h = result.current.habits[0]
    expect(h.type).toBe('daily')
    expect(h.active).toBe(true)
    expect(h.color).toBe('#6366f1')
    expect(h.id).toMatch(/^h_/)
  })

  it('updates a habit', () => {
    const { result } = renderHook(() => useHabits())
    act(() => { result.current.addHabit({ name: 'Run' }) })
    const id = result.current.habits[0].id
    act(() => { result.current.updateHabit(id, { name: 'Walk' }) })
    expect(result.current.habits[0].name).toBe('Walk')
  })

  it('deletes a habit', () => {
    const { result } = renderHook(() => useHabits())
    act(() => { result.current.addHabit({ name: 'Run' }) })
    const id = result.current.habits[0].id
    act(() => { result.current.deleteHabit(id) })
    expect(result.current.habits).toHaveLength(0)
  })

  it('persists to localStorage', () => {
    const { result } = renderHook(() => useHabits())
    act(() => { result.current.addHabit({ name: 'Persist me' }) })
    const stored = JSON.parse(localStorage.getItem('selfforge_habits'))
    expect(stored[0].name).toBe('Persist me')
  })
})

// ── useLogs ────────────────────────────────────────────────────────────────
describe('useLogs', () => {
  it('starts with no logs', () => {
    const { result } = renderHook(() => useLogs())
    expect(result.current.logs).toEqual([])
  })

  it('toggleLog creates a completed log', () => {
    const { result } = renderHook(() => useLogs())
    act(() => { result.current.toggleLog('h1', '2024-01-01') })
    expect(result.current.logs[0]).toMatchObject({ habitId: 'h1', date: '2024-01-01', completed: true })
  })

  it('toggleLog flips completed on existing log', () => {
    const { result } = renderHook(() => useLogs())
    act(() => { result.current.toggleLog('h1', '2024-01-01') })
    act(() => { result.current.toggleLog('h1', '2024-01-01') })
    expect(result.current.logs[0].completed).toBe(false)
  })

  it('setNote creates log with note', () => {
    const { result } = renderHook(() => useLogs())
    act(() => { result.current.setNote('h1', 'great session', '2024-01-01') })
    expect(result.current.logs[0].note).toBe('great session')
  })

  it('setNote updates note on existing log', () => {
    const { result } = renderHook(() => useLogs())
    act(() => { result.current.toggleLog('h1', '2024-01-01') })
    act(() => { result.current.setNote('h1', 'updated', '2024-01-01') })
    expect(result.current.logs[0].note).toBe('updated')
  })

  it('deleteLogsForHabit removes all logs for that habit', () => {
    const { result } = renderHook(() => useLogs())
    act(() => { result.current.toggleLog('h1', '2024-01-01') })
    act(() => { result.current.toggleLog('h2', '2024-01-01') })
    act(() => { result.current.deleteLogsForHabit('h1') })
    expect(result.current.logs.every(l => l.habitId !== 'h1')).toBe(true)
    expect(result.current.logs.some(l => l.habitId === 'h2')).toBe(true)
  })
})

// ── useProfile ─────────────────────────────────────────────────────────────
describe('useProfile', () => {
  it('returns default profile', () => {
    const { result } = renderHook(() => useProfile())
    expect(result.current.profile.name).toBe('')
  })

  it('updates profile', () => {
    const { result } = renderHook(() => useProfile())
    act(() => { result.current.updateProfile({ name: 'Alex' }) })
    expect(result.current.profile.name).toBe('Alex')
  })
})

// ── useLang ────────────────────────────────────────────────────────────────
describe('useLang', () => {
  it('returns current lang', () => {
    const { result } = renderHook(() => useLang())
    expect(['es', 'en']).toContain(result.current.lang)
  })

  it('changes lang', () => {
    const { result } = renderHook(() => useLang())
    act(() => { result.current.changeLang('en') })
    expect(result.current.lang).toBe('en')
  })
})
