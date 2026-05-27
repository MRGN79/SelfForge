import { useState, useCallback } from 'react'
import { getHabits, saveHabits } from '../storage.js'
import { toDateStr } from '../utils/dates.js'

function newId() {
  return `h_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

export function useHabits() {
  const [habits, setHabits] = useState(() => getHabits())

  const addHabit = useCallback((data) => {
    const habit = {
      id: newId(),
      name: data.name,
      description: data.description ?? '',
      type: data.type ?? 'daily',
      frequency: data.frequency ?? 1,
      targetDays: data.targetDays ?? [],
      category: data.category ?? '',
      color: data.color ?? '#6366f1',
      startDate: data.startDate ?? toDateStr(),
      endDate: data.endDate ?? null,
      active: data.active !== false,
      createdAt: new Date().toISOString(),
    }
    setHabits(prev => {
      const next = [...prev, habit]
      saveHabits(next)
      return next
    })
    return habit
  }, [])

  const updateHabit = useCallback((id, data) => {
    setHabits(prev => {
      const next = prev.map(h => h.id === id ? { ...h, ...data } : h)
      saveHabits(next)
      return next
    })
  }, [])

  const deleteHabit = useCallback((id) => {
    setHabits(prev => {
      const next = prev.filter(h => h.id !== id)
      saveHabits(next)
      return next
    })
  }, [])

  return { habits, addHabit, updateHabit, deleteHabit }
}
