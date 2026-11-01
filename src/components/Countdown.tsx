import { motion } from 'framer-motion'
import { useCountdown } from '../hooks/useCountdown'
import { useI18n } from '../i18n/LanguageContext'

const CONGRESS_START = '2027-04-28T21:00:00-03:00'

/** Cada dígito ocupa un ancho fijo: Shrikhand no tiene numerales tabulares y el contador temblaría. */
function Digits({ value, pad }: { value: number; pad: number }) {
  return (
    <span aria-hidden="true" className="flex">
      {String(value)
        .padStart(pad, '0')
        .split('')
        .map((digit, index) => (
          <span key={index} className="inline-block w-[0.68em] text-center">
            {digit}
          </span>
        ))}
    </span>
  )
}

export function Countdown() {
  const { t } = useI18n()
  const { days, hours, minutes, seconds, finished } = useCountdown(CONGRESS_START)
  const units = [
    { label: t.countdown.days, value: days, pad: 1 },
    { label: t.countdown.hours, value: hours, pad: 2 },
    { label: t.countdown.minutes, value: minutes, pad: 2 },
    { label: t.countdown.seconds, value: seconds, pad: 2 },
  ]

  return (
    <section id="cuenta-regresiva" className="bg-brasa px-4 py-16 text-noche sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        {finished ? (
          <motion.p
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            role="status"
            className="text-center font-display text-[clamp(2.5rem,9vw,6.5rem)] leading-none"
          >
            {t.countdown.finished}
          </motion.p>
        ) : (
          <>
            <h2 className="text-xl font-semibold sm:text-2xl">{t.countdown.heading}</h2>
            {/* role=timer no anuncia cada segundo; el texto accesible vive en cada unidad. */}
            <dl role="timer" className="mt-6 grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-4">
              {units.map(({ label, value, pad }) => (
                <div key={label} className="flex flex-col-reverse border-t-4 border-noche pt-3">
                  <dt className="eyebrow">{label}</dt>
                  <dd className="font-display text-[clamp(3.75rem,11vw,7.5rem)] leading-none">
                    <span className="sr-only">{value}</span>
                    <Digits value={value} pad={pad} />
                  </dd>
                </div>
              ))}
            </dl>
            <p className="figure-caption mt-8">{t.countdown.note}</p>
          </>
        )}
      </div>
    </section>
  )
}
