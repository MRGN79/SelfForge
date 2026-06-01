import React from 'react'
import { t, LANGS } from '../i18n.js'

const NAV_ITEMS = [
  { view: 'dashboard', icon: '🔥', labelKey: 'navDashboard' },
  { view: 'habits',    icon: '⚒️', labelKey: 'navHabits' },
  { view: 'stats',     icon: '📜', labelKey: 'navStats' },
]

export default function NavBar({ currentView, onNavigate, lang, onLangChange }) {
  return (
    <header className="rust-nav bg-stone-900/95 border-b border-stone-800 backdrop-blur-sm" role="banner">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <span className="font-black text-lg tracking-tight select-none text-orange-400 uppercase">
          {t('appName')}
        </span>

        <nav aria-label={t('appName')}>
          <ul className="flex gap-1" role="list">
            {NAV_ITEMS.map(({ view, icon, labelKey }) => (
              <li key={view}>
                <button
                  onClick={() => onNavigate(view)}
                  aria-current={currentView === view ? 'page' : undefined}
                  className={`
                    px-3 py-1.5 rounded-md text-sm font-semibold transition-colors
                    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500
                    ${currentView === view
                      ? 'bg-orange-600 text-white'
                      : 'text-stone-400 hover:bg-stone-800 hover:text-stone-200'}
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
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500
                ${lang === l ? 'bg-orange-600 text-white' : 'text-stone-500 hover:bg-stone-800 hover:text-stone-300'}
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
