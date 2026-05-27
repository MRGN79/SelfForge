import React, { useState } from 'react'
import { t } from '../i18n.js'
import Modal from '../components/Modal.jsx'
import HabitForm from '../components/HabitForm.jsx'
import HabitCard from '../components/HabitCard.jsx'
import { habitStats } from '../utils/gamification.js'
import { toDateStr } from '../utils/dates.js'

export default function HabitManager({ habits, logs, onAdd, onUpdate, onDelete, onDeleteLogs }) {
  const [modal, setModal] = useState(null) // null | 'new' | { habit }
  const [confirmHabit, setConfirmHabit] = useState(null)
  const today = toDateStr()

  function handleSave(data) {
    if (modal === 'new') {
      onAdd(data)
    } else {
      onUpdate(modal.habit.id, data)
    }
    setModal(null)
  }

  function handleDeleteConfirm() {
    onDelete(confirmHabit.id)
    onDeleteLogs(confirmHabit.id)
    setConfirmHabit(null)
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-6" id="main-content">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-stone-100 uppercase tracking-wide">{t('habitsTitle')}</h1>
        <button
          onClick={() => setModal('new')}
          className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold px-4 py-2 rounded uppercase tracking-wide transition-colors
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
        >
          + {t('newHabit')}
        </button>
      </div>

      {habits.length === 0 ? (
        <p className="text-center text-stone-500 py-16">{t('noHabits')}</p>
      ) : (
        <ul className="space-y-3" role="list">
          {habits.map(habit => {
            const stats = habitStats(habit, logs, today)
            return (
              <li key={habit.id}>
                <HabitCard
                  habit={habit}
                  log={null}
                  streak={stats.streak}
                  maxStreak={stats.maxStreak}
                  consistency={stats.consistency}
                  onEdit={() => setModal({ habit })}
                  onDelete={() => setConfirmHabit(habit)}
                />
              </li>
            )
          })}
        </ul>
      )}

      {/* New / Edit Modal */}
      {modal && (
        <Modal
          title={modal === 'new' ? t('newHabit') : t('editHabit')}
          onClose={() => setModal(null)}
        >
          <HabitForm
            habit={modal === 'new' ? null : modal.habit}
            onSave={handleSave}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}

      {/* Delete confirmation */}
      {confirmHabit && (
        <Modal title={t('deleteHabit')} onClose={() => setConfirmHabit(null)}>
          <p className="text-stone-300 mb-6">
            {t('confirmDelete', { name: confirmHabit.name })}
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDeleteConfirm}
              className="flex-1 bg-red-700 hover:bg-red-800 text-white font-bold py-2 rounded uppercase tracking-wide transition-colors
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
            >
              {t('confirmDeleteBtn')}
            </button>
            <button
              onClick={() => setConfirmHabit(null)}
              className="flex-1 bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold py-2 rounded transition-colors
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-500"
            >
              {t('cancelBtn')}
            </button>
          </div>
        </Modal>
      )}
    </main>
  )
}
