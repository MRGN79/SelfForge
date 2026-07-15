import React from 'react'
import { t, LANGS } from '../i18n.js'

const NAV_ITEMS = [
  { view: 'dashboard', icon: '🔥', labelKey: 'navDashboard' },
  { view: 'habits',    icon: '⚒️', labelKey: 'navHabits' },
  { view: 'stats',     icon: '📜', labelKey: 'navStats' },
]

export default function NavBar({ currentView, onNavigate, lang, onLangChange }) {
  return (
    <header className="rust-nav sticky top-0 z-40 bg-stone-900/90 border-b border-stone-800/80 backdrop-blur-md" role="banner">
      <div className="max-w-2xl mx-auto px-3 sm:px-4 py-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <span className="font-display font-black text-lg sm:text-xl tracking-wide select-none ember-text uppercase flex items-center gap-1.5">
          <span aria-hidden="true" className="text-lg">🔥</span>
          {t('appName')}
        </span>

        <div className="flex items-center gap-2 flex-wrap">
          <nav aria-label={t('appName')}>
            <ul className="flex gap-1 bg-stone-950/40 border border-stone-800/80 rounded-full p-1" role="list">
              {NAV_ITEMS.map(({ view, icon, labelKey }) => (
                <li key={view}>
                  <button
                    onClick={() => onNavigate(view)}
                    aria-current={currentView === view ? 'page' : undefined}
                    className={`
                      px-2 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap
                      focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500
                      ${currentView === view
                        ? 'btn-forge text-white'
                        : 'text-stone-400 hover:bg-stone-800/80 hover:text-stone-200'}
                    `}
                  >
                    <span aria-hidden="true">{icon} </span>
                    {t(labelKey)}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex gap-0.5 bg-stone-950/40 border border-stone-800/80 rounded-full p-1">
            {LANGS.map(l => (
              <button
                key={l}
                onClick={() => onLangChange(l)}
                aria-pressed={lang === l}
                aria-label={l === 'es' ? 'Español' : 'English'}
                className={`
                  px-2 py-1 rounded-full text-xs font-bold uppercase transition-all duration-200
                  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500
                  ${lang === l ? 'bg-orange-600 text-white shadow-sm shadow-orange-900/60' : 'text-stone-500 hover:bg-stone-800/80 hover:text-stone-300'}
                `}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
