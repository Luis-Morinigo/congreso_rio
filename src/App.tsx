import { MotionConfig } from 'framer-motion'
import { About } from './components/About'
import { Banner } from './components/Banner'
import { Countdown } from './components/Countdown'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { MusicPrompt } from './components/MusicPrompt'
import { Rsvp } from './components/Rsvp'
import { Speakers } from './components/Speakers'
import { useBackgroundMusic } from './hooks/useBackgroundMusic'
import { useI18n } from './i18n/LanguageContext'

export default function App() {
  const { t } = useI18n()
  const music = useBackgroundMusic()

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#contenido"
        className="fixed top-2 left-2 z-[60] -translate-y-20 bg-ipe px-4 py-2 font-mono text-sm text-noche focus:translate-y-0"
      >
        {t.a11y.skipToContent}
      </a>
      <Header music={music} />
      <main id="contenido">
        <Hero />
        <Countdown />
        <Banner />
        <About />
        <Speakers />
        <Rsvp />
      </main>
      <Footer />
      <MusicPrompt music={music} />
    </MotionConfig>
  )
}
