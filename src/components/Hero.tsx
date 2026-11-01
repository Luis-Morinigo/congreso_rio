import { motion } from 'framer-motion'
import heroImage from '../assets/mala_fama.jpeg'
import { useI18n } from '../i18n/LanguageContext'
import { Calcadao } from './Calcadao'

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.2, 0.7, 0.2, 1] as const },
})

export function Hero() {
  const { t } = useI18n()
  return (
    <>
      <section id="inicio" className="relative isolate flex min-h-svh flex-col justify-end overflow-hidden pt-16">
        <img
          src={heroImage}
          alt={t.hero.imageAlt}
          fetchPriority="high"
          width={1087}
          height={792}
          className="absolute inset-0 -z-10 size-full object-cover object-[50%_20%]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-t from-noche from-15% via-noche/60 via-50% to-noche/5"
        />

        <div className="mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6">
          <h1>
            <motion.span {...rise(0.1)} className="block text-xl sm:text-3xl">
              {t.hero.titleLead}
            </motion.span>
            <motion.span
              {...rise(0.25)}
              className="mt-1 block font-display text-[clamp(2.1rem,10.6vw,7.5rem)] leading-[0.98] text-ipe"
            >
              {t.hero.titleMain}
            </motion.span>
          </h1>

          <motion.div {...rise(0.5)} className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xl font-semibold sm:text-2xl">{t.hero.dates}</p>
              <p className="text-xl sm:text-2xl">{t.hero.place}</p>
              <a
                href="#asistencia"
                className="mt-5 inline-block bg-brasa px-7 py-3 font-display text-xl text-noche transition-colors hover:bg-ipe"
              >
                {t.hero.cta}
              </a>
            </div>
            <p className="figure-caption max-w-xs md:text-right">{t.hero.caption}</p>
          </motion.div>
        </div>
      </section>
      <Calcadao stone="var(--color-espuma)" ground="var(--color-noche)" drift />
    </>
  )
}
