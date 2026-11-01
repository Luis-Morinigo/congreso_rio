import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect } from 'react'
import { MUSIC_CONTROL_ATTR, PLAYER_SIZE, type BackgroundMusic } from '../hooks/useBackgroundMusic'
import { useI18n } from '../i18n/LanguageContext'

/**
 * Mini reproductor flotante. No se oculta mientras suena ni se le superpone nada, como pide YouTube.
 * El contenedor permanece en el DOM para no perder el reproductor al cerrarlo.
 */
export function MusicPlayer({ music }: { music: BackgroundMusic }) {
  const { language, t } = useI18n()
  const control = { [MUSIC_CONTROL_ATTR]: '' }
  const { hostRef, isPlayerVisible } = music

  useEffect(() => {
    hostRef.current?.querySelector('iframe')?.setAttribute('title', t.music.playerTitle)
  }, [hostRef, isPlayerVisible, language, music.isPlaying, music.needsActivation, t])

  return (
    <div
      style={{ width: PLAYER_SIZE }}
      className={`fixed top-20 right-4 z-30 flex flex-col-reverse gap-2 ${isPlayerVisible ? '' : 'invisible'}`}
    >
      <AnimatePresence>
        {music.needsActivation && (
          <motion.button
            {...control}
            type="button"
            onClick={music.toggle}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="min-h-11 bg-ipe px-3 py-2 text-left leading-tight font-semibold text-noche shadow-lg hover:bg-espuma"
          >
            {music.needsPlayerTap ? t.music.tapPlayer : t.music.prompt}
          </motion.button>
        )}
      </AnimatePresence>

      <div className="bg-noche shadow-lg outline-2 outline-ipe">
        <div className="flex items-center justify-between pl-2 text-espuma">
          <p className="figure-caption truncate">{t.music.playerLabel}</p>
          <button
            {...control}
            type="button"
            aria-label={t.music.closePlayer}
            title={t.music.closePlayer}
            onClick={music.close}
            className="tap-target shrink-0 hover:text-ipe"
          >
            <X aria-hidden="true" size={18} />
          </button>
        </div>
        <div ref={hostRef} style={{ height: PLAYER_SIZE }} />
      </div>
    </div>
  )
}
