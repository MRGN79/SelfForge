import { useState, useCallback } from 'react'
import { getLogs, saveLogs } from '../storage.js'
import { toDateStr } from '../utils/dates.js'

function newId() {
  return `l_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

export function useLogs() {
  const [logs, setLogs] = useState(() => getLogs())

  const toggleLog = useCallback((habitId, dateStr = toDateStr()) => {
    setLogs(prev => {
      const existing = prev.find(l => l.habitId === habitId && l.date === dateStr)
      let next
      if (existing) {
        next = prev.map(l =>
          l.id === existing.id ? { ...l, completed: !l.completed } : l
        )
      } else {
        next = [...prev, { id: newId(), habitId, date: dateStr, completed: true, note: '' }]
      }
      saveLogs(next)
      return next
    })
  }, [])

  const setNote = useCallback((habitId, note, dateStr = toDateStr()) => {
    setLogs(prev => {
      const existing = prev.find(l => l.habitId === habitId && l.date === dateStr)
      let next
      if (existing) {
        next = prev.map(l => l.id === existing.id ? { ...l, note } : l)
      } else {
        next = [...prev, { id: newId(), habitId, date: dateStr, completed: false, note }]
      }
      saveLogs(next)
      return next
    })
  }, [])

  const deleteLogsForHabit = useCallback((habitId) => {
    setLogs(prev => {
      const next = prev.filter(l => l.habitId !== habitId)
      saveLogs(next)
      return next
    })
  }, [])

  return { logs, toggleLog, setNote, deleteLogsForHabit }
}
