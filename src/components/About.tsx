import { motion } from 'framer-motion'
import { useI18n } from '../i18n/LanguageContext'

export function About() {
  const { t } = useI18n()
  const { d28, d29, d30 } = t.about.days
  return (
    <section id="sobre" className="bg-ipe px-4 py-16 text-noche sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="section-heading">{t.about.heading}</h2>
        <p className="mt-6 max-w-[62ch] text-lg sm:text-xl">{t.about.body}</p>

        <ol className="mt-12 grid gap-4 md:grid-cols-3">
          {[d28, d29, d30].map((day, index) => (
            <motion.li
              key={day.date}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col bg-noche p-6 text-espuma"
            >
              <p className="flex items-baseline gap-3">
                <span className="font-display text-7xl leading-none text-ipe">{day.date}</span>
                <span className="leading-tight">
                  {day.weekday}
                  <br />
                  {day.month}
                </span>
              </p>
              <p className="eyebrow mt-6 text-ipe">{day.law}</p>
              <h3 className="font-display text-3xl">{day.theme}</h3>
              <p className="mt-3">{day.text}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
