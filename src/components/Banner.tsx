import bannerImage from '../assets/congreso_internacional.jpeg'
import { useI18n } from '../i18n/LanguageContext'

/**
 * El póster es vertical: en mobile se ve entero; desde tablet, a ancho completo sería más alto
 * que la pantalla, así que se recorta a una franja centrada en el título.
 */
export function Banner() {
  const { t } = useI18n()
  return (
    <section className="bg-noche">
      <img
        src={bannerImage}
        alt={t.banner.imageAlt}
        loading="lazy"
        width={765}
        height={1024}
        className="block h-auto w-full md:aspect-[2/1] md:object-cover md:object-[50%_41%]"
      />
    </section>
  )
}
