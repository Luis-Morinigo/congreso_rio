import { AnimatePresence, motion } from 'framer-motion'
import { Flame, Menu, Volume2, VolumeX, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { MUSIC_CONTROL_ATTR, type BackgroundMusic } from '../hooks/useBackgroundMusic'
import { useI18n, type Language } from '../i18n/LanguageContext'

function LanguageSwitch() {
  const { language, setLanguage, t } = useI18n()
  const options: { code: Language; label: string; aria: string }[] = [
    { code: 'es', label: t.a11y.spanishShort, aria: t.a11y.useSpanish },
    { code: 'pt', label: t.a11y.portugueseShort, aria: t.a11y.usePortuguese },
  ]
  return (
    <div role="group" aria-label={t.a11y.languageGroup} className="flex font-mono text-sm">
      {options.map(({ code, label, aria }) => (
        <button
          key={code}
          type="button"
          aria-label={aria}
          aria-pressed={language === code}
          onClick={() => setLanguage(code)}
          className={`min-h-11 w-9 ${language === code ? 'bg-ipe text-noche' : 'text-espuma hover:text-ipe'}`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

function MusicButton({ music }: { music: BackgroundMusic }) {
  const { t } = useI18n()
  const label = music.isUnavailable ? t.music.unavailable : music.isPlaying ? t.music.mute : t.music.unmute
  const Icon = music.isPlaying ? Volume2 : VolumeX
  const control = { [MUSIC_CONTROL_ATTR]: '' }
  return (
    <button
      {...control}
      type="button"
      aria-label={label}
      title={label}
      aria-disabled={music.isUnavailable}
      onClick={music.toggle}
      className={`tap-target ${music.isUnavailable ? 'cursor-not-allowed text-espuma/50' : 'text-ipe hover:text-espuma'}`}
    >
      <Icon aria-hidden="true" size={22} />
    </button>
  )
}

export function Header({ music }: { music: BackgroundMusic }) {
  const { t } = useI18n()
  const [menuOpen, setMenuOpen] = useState(false)
  const links = [
    { href: '#cuenta-regresiva', label: t.nav.countdown },
    { href: '#sobre', label: t.nav.about },
    { href: '#expositores', label: t.nav.speakers },
    { href: '#asistencia', label: t.nav.rsvp },
  ]

  useEffect(() => {
    if (!menuOpen) return
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [menuOpen])

  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-noche text-espuma">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4 sm:px-6">
        <a href="#inicio" className="flex min-w-0 flex-1 items-center gap-2 lg:flex-none">
          <Flame aria-hidden="true" size={22} className="hidden shrink-0 text-brasa min-[360px]:block" />
          <span className="max-w-52 text-[0.7rem] leading-tight font-semibold sm:text-xs">{t.brand}</span>
        </a>

        <nav aria-label={t.a11y.mainNav} className="ml-auto hidden lg:block">
          <ul className="flex gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="block px-3 py-2 text-[0.95rem] hover:text-ipe">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-1 lg:ml-3">
          <LanguageSwitch />
          <MusicButton music={music} />
          <button
            type="button"
            className="tap-target lg:hidden"
            aria-label={menuOpen ? t.a11y.closeMenu : t.a11y.openMenu}
            aria-expanded={menuOpen}
            aria-controls="menu-movil"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X aria-hidden="true" size={24} /> : <Menu aria-hidden="true" size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="menu-movil"
            aria-label={t.a11y.mainNav}
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="overflow-hidden border-t border-espuma/20 lg:hidden"
          >
            <ul className="px-4 py-2 sm:px-6">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block py-3 font-display text-2xl text-ipe"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
