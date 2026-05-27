import React from 'react'
import { t, LANGS } from '../i18n.js'

const NAV_ITEMS = [
  { view: 'dashboard', icon: '☀️', labelKey: 'navDashboard' },
  { view: 'habits',    icon: '📋', labelKey: 'navHabits' },
  { view: 'stats',     icon: '📊', labelKey: 'navStats' },
]

export default function NavBar({ currentView, onNavigate, lang, onLangChange }) {
  return (
    <header className="bg-indigo-700 text-white shadow-md" role="banner">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <span className="font-bold text-lg tracking-tight select-none">{t('appName')}</span>

        <nav aria-label={t('appName')}>
          <ul className="flex gap-1" role="list">
            {NAV_ITEMS.map(({ view, icon, labelKey }) => (
              <li key={view}>
                <button
                  onClick={() => onNavigate(view)}
                  aria-current={currentView === view ? 'page' : undefined}
                  className={`
                    px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white
                    ${currentView === view
                      ? 'bg-white text-indigo-700'
                      : 'text-indigo-100 hover:bg-indigo-600'}
                  `}
                >
                  <span aria-hidden="true">{icon} </span>
                  {t(labelKey)}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex gap-1">
          {LANGS.map(l => (
            <button
              key={l}
              onClick={() => onLangChange(l)}
              aria-pressed={lang === l}
              aria-label={l === 'es' ? 'Español' : 'English'}
              className={`
                px-2 py-1 rounded text-xs font-semibold uppercase transition-colors
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white
                ${lang === l ? 'bg-white text-indigo-700' : 'text-indigo-200 hover:bg-indigo-600'}
              `}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
