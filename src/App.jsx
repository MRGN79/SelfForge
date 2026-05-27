import React from 'react'
import NavBar from './components/NavBar.jsx'
import Dashboard from './views/Dashboard.jsx'
import HabitManager from './views/HabitManager.jsx'
import Stats from './views/Stats.jsx'
import { useHabits } from './hooks/useHabits.js'
import { useLogs } from './hooks/useLogs.js'
import { useLang } from './hooks/useLang.js'
import { useState } from 'react'
import { t } from './i18n.js'

export default function App() {
  const [view, setView] = useState('dashboard')
  const { habits, addHabit, updateHabit, deleteHabit } = useHabits()
  const { logs, toggleLog, setNote, deleteLogsForHabit } = useLogs()
  const { lang, changeLang } = useLang()

  const content = (() => {
    switch (view) {
      case 'habits':
        return (
          <HabitManager
            habits={habits}
            logs={logs}
            onAdd={addHabit}
            onUpdate={updateHabit}
            onDelete={deleteHabit}
            onDeleteLogs={deleteLogsForHabit}
          />
        )
      case 'stats':
        return <Stats habits={habits} logs={logs} />
      default:
        return (
          <Dashboard
            habits={habits}
            logs={logs}
            onToggle={toggleLog}
            onNote={setNote}
          />
        )
    }
  })()

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100" key={lang}>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2
        bg-stone-800 text-orange-400 font-semibold px-4 py-2 rounded-lg z-50 shadow-lg border border-stone-600">
        Skip to content
      </a>
      <NavBar
        currentView={view}
        onNavigate={setView}
        lang={lang}
        onLangChange={changeLang}
      />
      {content}
      <footer className="mt-8 pb-4 text-center">
        <span className="text-xs text-stone-600 select-none" aria-label={t('footerVersion', { v: __APP_VERSION__ })}>
          v{__APP_VERSION__}
        </span>
      </footer>
    </div>
  )
}
