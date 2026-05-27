import { useState, useCallback } from 'react'
import { getLang, setLang } from '../i18n.js'

export function useLang() {
  const [lang, setLangState] = useState(() => getLang())

  const changeLang = useCallback((l) => {
    setLang(l)
    setLangState(l)
  }, [])

  return { lang, changeLang }
}
