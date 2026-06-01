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
      className="rust-card bg-stone-900 rounded-md border border-stone-800 border-l-4 p-4 flex flex-col gap-3"
      style={{ borderLeftColor: habit.color }}
      aria-label={habit.name}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          className="w-3 h-3 rounded-sm mt-1 flex-shrink-0"
          style={{ backgroundColor: habit.color }}
          aria-hidden="true"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-stone-100 truncate">{habit.name}</h3>
          {habit.category && (
            <span className="text-xs text-stone-500 uppercase tracking-wide">{habit.category}</span>
          )}
          {habit.description && (
            <p className="text-sm text-stone-400 mt-0.5 line-clamp-2">{habit.description}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {onToggle && (
            <button
              onClick={() => onToggle(habit.id)}
              aria-pressed={completed}
              aria-label={completed ? t('markIncomplete') : t('markComplete')}
              className={`
                w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500
                ${completed
                  ? 'bg-orange-600 text-white shadow-sm shadow-orange-900/60'
                  : 'bg-stone-800 border-2 border-stone-600 text-stone-500 hover:border-orange-500 hover:text-orange-400'}
              `}
            >
              {completed ? (
                <svg aria-hidden="true" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg aria-hidden="true" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(habit)}
              aria-label={`${t('edit')} ${habit.name}`}
              className="p-1.5 text-stone-500 hover:text-orange-400 rounded transition-colors
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
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
              className="p-1.5 text-stone-500 hover:text-red-500 rounded transition-colors
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
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

      {/* Note */}
      {onNote && (
        <div>
          {!showNote ? (
            <button
              onClick={() => { setNoteValue(log?.note ?? ''); setShowNote(true) }}
              className="text-xs text-stone-500 hover:text-orange-400 transition-colors
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
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
                className="flex-1 bg-stone-800 border border-stone-600 rounded px-2 py-1 text-xs text-stone-100
                  placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button type="submit" className="text-xs bg-orange-600 text-white px-2 py-1 rounded hover:bg-orange-700
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500">
                {t('saveNote')}
              </button>
              <button type="button" onClick={() => setShowNote(false)}
                className="text-xs text-stone-500 hover:text-stone-300
                  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-500">
                {t('cancel')}
              </button>
            </form>
          )}
        </div>
      )}
    </article>
  )
}
