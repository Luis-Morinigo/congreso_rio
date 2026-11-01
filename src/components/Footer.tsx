import { useI18n } from '../i18n/LanguageContext'
import { Calcadao } from './Calcadao'

export function Footer() {
  const { t } = useI18n()
  return (
    <footer>
      <Calcadao stone="var(--color-noche)" ground="var(--color-espuma)" />
      <div className="bg-noche px-4 py-10 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-2xl text-ipe">{t.footer.event}</p>
            <p className="mt-1">{t.footer.details}</p>
          </div>
          <div className="figure-caption md:text-right">
            <p>{t.footer.copyright}</p>
            <p>{t.footer.credit}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
