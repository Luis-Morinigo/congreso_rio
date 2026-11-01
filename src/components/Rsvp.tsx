import { useRef, useState, type FormEvent } from 'react'
import { useI18n } from '../i18n/LanguageContext'
import { writeStorage } from '../lib/storage'
import { ConfirmationModal, type Confirmation } from './ConfirmationModal'

const STORAGE_KEY = 'congreso_rio.rsvp'
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DAY_IDS = ['d28', 'd29', 'd30'] as const
const DAY_NUMBER = { d28: '28', d29: '29', d30: '30' } as const

type DayId = (typeof DAY_IDS)[number]
type Field = 'name' | 'email' | 'country' | 'days'
type FormErrors = Partial<Record<Field, 'nameRequired' | 'emailRequired' | 'emailInvalid' | 'countryRequired' | 'daysRequired'>>

const inputClass =
  'mt-1 block min-h-12 w-full border-2 border-noche bg-white px-3 text-noche aria-[invalid=true]:border-erro'

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="mt-1 text-sm font-semibold text-erro">
      {message}
    </p>
  )
}

export function Rsvp() {
  const { language, t } = useI18n()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [country, setCountry] = useState('')
  const [days, setDays] = useState<DayId[]>([])
  const [errors, setErrors] = useState<FormErrors>({})
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const submitRef = useRef<HTMLButtonElement>(null)

  const validate = (): FormErrors => {
    const result: FormErrors = {}
    if (!name.trim()) result.name = 'nameRequired'
    if (!email.trim()) result.email = 'emailRequired'
    else if (!EMAIL_PATTERN.test(email.trim())) result.email = 'emailInvalid'
    if (!country) result.country = 'countryRequired'
    if (days.length === 0) result.days = 'daysRequired'
    return result
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)

    const firstInvalid = (['name', 'email', 'country', 'days'] as const).find((field) => nextErrors[field])
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[data-field="${firstInvalid}"]`)?.focus()
      return
    }

    const orderedDays = DAY_IDS.filter((id) => days.includes(id))
    // TODO: integrar Formspree o similar. Sin backend, la confirmación solo queda en este navegador.
    // Reemplazar por un POST a https://formspree.io/f/<id> con este mismo objeto y abrir el modal al recibir OK.
    writeStorage(
      STORAGE_KEY,
      JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        country,
        days: orderedDays.map((id) => DAY_NUMBER[id]),
        language,
        confirmedAt: new Date().toISOString(),
      }),
    )

    setConfirmation({ name: name.trim(), days: orderedDays.map((id) => DAY_NUMBER[id]) })
    setName('')
    setEmail('')
    setCountry('')
    setDays([])
  }

  const toggleDay = (id: DayId) => {
    setDays((current) => (current.includes(id) ? current.filter((day) => day !== id) : [...current, id]))
  }

  const countries = Object.entries(t.rsvp.countries)
    .filter(([code]) => code !== 'OTHER')
    .sort(([, a], [, b]) => a.localeCompare(b, language))

  return (
    <section id="asistencia" className="bg-mata px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <h2 className="section-heading text-ipe">{t.rsvp.heading}</h2>
          <p className="mt-6 max-w-[42ch] text-lg sm:text-xl">{t.rsvp.intro}</p>
        </div>

        <form ref={formRef} noValidate onSubmit={handleSubmit} className="bg-espuma p-5 text-noche sm:p-8">
          <div className="grid gap-5">
            <div>
              <label htmlFor="rsvp-name" className="font-semibold">
                {t.rsvp.nameLabel}
              </label>
              <input
                id="rsvp-name"
                data-field="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'rsvp-name-error' : undefined}
                className={inputClass}
              />
              <FieldError id="rsvp-name-error" message={errors.name && t.rsvp.errors[errors.name]} />
            </div>

            <div>
              <label htmlFor="rsvp-email" className="font-semibold">
                {t.rsvp.emailLabel}
              </label>
              <input
                id="rsvp-email"
                data-field="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'rsvp-email-error' : undefined}
                className={inputClass}
              />
              <FieldError id="rsvp-email-error" message={errors.email && t.rsvp.errors[errors.email]} />
            </div>

            <div>
              <label htmlFor="rsvp-country" className="font-semibold">
                {t.rsvp.countryLabel}
              </label>
              <select
                id="rsvp-country"
                data-field="country"
                autoComplete="off"
                required
                value={country}
                onChange={(event) => setCountry(event.target.value)}
                aria-invalid={Boolean(errors.country)}
                aria-describedby={errors.country ? 'rsvp-country-error' : undefined}
                className={inputClass}
              >
                <option value="" disabled>
                  {t.rsvp.countryPlaceholder}
                </option>
                {countries.map(([code, label]) => (
                  <option key={code} value={code}>
                    {label}
                  </option>
                ))}
                <option value="OTHER">{t.rsvp.countries.OTHER}</option>
              </select>
              <FieldError id="rsvp-country-error" message={errors.country && t.rsvp.errors[errors.country]} />
            </div>

            <fieldset aria-describedby={errors.days ? 'rsvp-days-error' : undefined}>
              <legend className="font-semibold">{t.rsvp.daysLegend}</legend>
              <div className="mt-1">
                {DAY_IDS.map((id, index) => (
                  <label key={id} className="flex min-h-11 cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      data-field={index === 0 ? 'days' : undefined}
                      checked={days.includes(id)}
                      onChange={() => toggleDay(id)}
                      className="size-5 accent-mata"
                    />
                    {t.rsvp.dayOptions[id]}
                  </label>
                ))}
              </div>
              <FieldError id="rsvp-days-error" message={errors.days && t.rsvp.errors[errors.days]} />
            </fieldset>

            <button
              ref={submitRef}
              type="submit"
              className="min-h-14 bg-brasa px-6 font-display text-xl text-noche transition-colors hover:bg-ipe"
            >
              {t.rsvp.submit}
            </button>
          </div>
        </form>
      </div>

      <ConfirmationModal
        confirmation={confirmation}
        onClose={() => {
          setConfirmation(null)
          submitRef.current?.focus()
        }}
      />
    </section>
  )
}
