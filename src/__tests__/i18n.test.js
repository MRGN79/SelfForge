import { describe, it, expect, beforeEach } from 'vitest'
import { t, getLang, setLang, LANGS } from '../i18n.js'

beforeEach(() => localStorage.clear())

describe('LANGS', () => {
  it('includes en and es', () => {
    expect(LANGS).toContain('en')
    expect(LANGS).toContain('es')
  })
})

describe('getLang', () => {
  it('returns default lang (es) when nothing stored', () => {
    Object.defineProperty(navigator, 'language', { value: 'fr', configurable: true })
    expect(getLang()).toBe('es')
  })

  it('returns stored lang', () => {
    setLang('en')
    expect(getLang()).toBe('en')
  })

  it('falls back to default for unknown lang', () => {
    localStorage.setItem('selfforge_lang', 'zz')
    expect(getLang()).toBe('es')
  })
})

describe('t()', () => {
  it('returns the translated string in es', () => {
    setLang('es')
    expect(t('appName')).toBe('SelfForge')
  })

  it('returns the translated string in en', () => {
    setLang('en')
    expect(t('navDashboard')).toBe('Forge')
  })

  it('interpolates variables', () => {
    setLang('es')
    expect(t('dashboardProgress', { done: 2, total: 5 })).toBe('2 de 5 templadas')
  })

  it('returns key when not found', () => {
    expect(t('nonExistentKey')).toBe('nonExistentKey')
  })

  it('falls back to default lang for missing key in active lang', () => {
    setLang('en')
    expect(t('appName')).toBe('SelfForge')
  })
})
