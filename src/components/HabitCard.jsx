import React, { useState } from 'react'
import { t } from '../i18n.js'
import StreakBadge from './StreakBadge.jsx'
import ConsistencyBar from './ConsistencyBar.jsx'

export default function HabitCard({ habit, log, streak, maxStreak, consistency, onToggle, onNote, onEdit, onDelete }) {
  const [showNote, setShowNote] = useState(false)
  const [noteValue, setNoteValue] = useState(log?.note ?? '')

  const completed = log?.completed === true

  function handleNoteSubmit(e) {
    e.preventDefault()
    onNote(habit.id, noteValue)
    setShowNote(false)
  }

  return (
    <article
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3"
      aria-label={habit.name}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
          style={{ backgroundColor: habit.color }}
          aria-hidden="true"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{habit.name}</h3>
          {habit.category && (
            <span className="text-xs text-gray-400">{habit.category}</span>
          )}
          {habit.description && (
            <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{habit.description}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {onEdit && (
            <button
              onClick={() => onEdit(habit)}
              aria-label={`${t('edit')} ${habit.name}`}
              className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg transition-colors
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(habit)}
              aria-label={`${t('delete')} ${habit.name}`}
              className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-colors
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
            >
              <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Gamification */}
      <div className="flex flex-col gap-1.5">
        <StreakBadge streak={streak} maxStreak={maxStreak} type={habit.type} />
        <ConsistencyBar value={consistency} />
      </div>

      {/* Toggle button */}
      {onToggle && (
        <button
          onClick={() => onToggle(habit.id)}
          aria-pressed={completed}
          className={`
            w-full py-2 rounded-xl font-semibold text-sm transition-all
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500
            ${completed
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'}
          `}
        >
          {completed ? `✓ ${t('markIncomplete')}` : t('markComplete')}
        </button>
      )}

      {/* Note */}
      {onNote && (
        <div>
          {!showNote ? (
            <button
              onClick={() => { setNoteValue(log?.note ?? ''); setShowNote(true) }}
              className="text-xs text-gray-400 hover:text-indigo-500 transition-colors
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              {log?.note ? `📝 ${log.note}` : `+ ${t('addNote')}`}
            </button>
          ) : (
            <form onSubmit={handleNoteSubmit} className="flex gap-2">
              <label htmlFor={`note-${habit.id}`} className="sr-only">{t('noteLabel')}</label>
              <input
                id={`note-${habit.id}`}
                type="text"
                value={noteValue}
                onChange={e => setNoteValue(e.target.value)}
                placeholder={t('notePlaceholder')}
                className="flex-1 border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button type="submit" className="text-xs bg-indigo-600 text-white px-2 py-1 rounded-lg hover:bg-indigo-700
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                {t('saveNote')}
              </button>
              <button type="button" onClick={() => setShowNote(false)}
                className="text-xs text-gray-400 hover:text-gray-600
                  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400">
                {t('cancel')}
              </button>
            </form>
          )}
        </div>
      )}
    </article>
  )
}
