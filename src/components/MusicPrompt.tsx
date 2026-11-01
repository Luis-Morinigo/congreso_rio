import { AnimatePresence, motion } from 'framer-motion'
import { MUSIC_CONTROL_ATTR, type BackgroundMusic } from '../hooks/useBackgroundMusic'
import { useI18n } from '../i18n/LanguageContext'

/** Aviso flotante para cuando el navegador bloquea el autoplay. Desaparece al activarse la música. */
export function MusicPrompt({ music }: { music: BackgroundMusic }) {
  const { t } = useI18n()
  const control = { [MUSIC_CONTROL_ATTR]: '' }
  return (
    <AnimatePresence>
      {music.needsActivation && (
        <motion.button
          {...control}
          type="button"
          onClick={music.toggle}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          className="fixed bottom-4 left-4 z-30 min-h-11 bg-ipe px-4 font-semibold text-noche shadow-lg hover:bg-espuma"
        >
          {t.music.prompt}
        </motion.button>
      )}
    </AnimatePresence>
  )
}
