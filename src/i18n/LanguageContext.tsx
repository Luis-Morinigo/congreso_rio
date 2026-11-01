import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { es, type Dictionary } from './es'
import { pt } from './pt'
import { readStorage, writeStorage } from '../lib/storage'

export type Language = 'es' | 'pt'

const STORAGE_KEY = 'congreso_rio.language'
const dictionaries: Record<Language, Dictionary> = { es, pt }

function detectLanguage(): Language {
  const saved = readStorage(STORAGE_KEY)
  if (saved === 'es' || saved === 'pt') return saved
  return navigator.language.toLowerCase().startsWith('pt') ? 'pt' : 'es'
}

interface LanguageContextValue {
  language: Language
  setLanguage: (language: Language) => void
  t: Dictionary
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(detectLanguage)
  const t = dictionaries[language]

  useEffect(() => {
    document.documentElement.lang = language
    document.title = t.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description)
  }, [language, t])

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next)
    writeStorage(STORAGE_KEY, next)
  }, [])

  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useI18n(): LanguageContextValue {
  const value = useContext(LanguageContext)
  if (!value) throw new Error('useI18n debe usarse dentro de LanguageProvider')
  return value
}
