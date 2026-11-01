import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { useCallback, useEffect, useState, type KeyboardEvent } from 'react'
import agus from '../assets/agus_expositor.jpeg'
import andy from '../assets/andy_expositor.jpeg'
import ivo from '../assets/ivo_expositor-opt.jpeg'
import lucho from '../assets/lucho_expositor.jpeg'
import pablo from '../assets/pablo_expositor.jpeg'
import rodri from '../assets/rodri_expositor.jpeg'
import titan from '../assets/titancito.jpeg'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { useI18n } from '../i18n/LanguageContext'

const AUTOPLAY_MS = 5000

const SPEAKERS = [
  { id: 'agus', src: agus, position: '50% 28%' },
  { id: 'rodri', src: rodri, position: '50% 12%' },
  { id: 'andy', src: andy, position: '50% 62%' },
  { id: 'ivo', src: ivo, position: '50% 18%' },
  { id: 'lucho', src: lucho, position: '50% 70%' },
  { id: 'pablo', src: pablo, position: '50% 30%' },
  { id: 'titan', src: titan, position: '50% 20%' },
] as const

export function Speakers() {
  const { t } = useI18n()
  const prefersReducedMotion = usePrefersReducedMotion()
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start', duration: prefersReducedMotion ? 1 : 28 })
  const [selected, setSelected] = useState(0)
  const [hoverOrFocus, setHoverOrFocus] = useState(false)
  const [userPaused, setUserPaused] = useState(false)
  const autoplaying = !prefersReducedMotion && !userPaused
  const total = SPEAKERS.length

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap())
    onSelect()
    emblaApi.on('select', onSelect).on('reInit', onSelect)
    return () => {
      emblaApi.off('select', onSelect).off('reInit', onSelect)
    }
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi || !autoplaying || hoverOrFocus) return
    const id = window.setInterval(() => emblaApi.scrollNext(), AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [emblaApi, autoplaying, hoverOrFocus, selected])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        emblaApi?.scrollPrev()
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        emblaApi?.scrollNext()
      }
    },
    [emblaApi],
  )

  const current = t.speakers.people[SPEAKERS[selected].id]

  return (
    <section id="expositores" className="bg-oceano px-4 py-16 text-espuma sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="section-heading text-ipe">{t.speakers.heading}</h2>
        <p className="mt-3 text-lg sm:text-xl">{t.speakers.intro}</p>

        <div
          role="region"
          aria-roledescription={t.speakers.carouselLabel}
          aria-label={t.speakers.carouselLabel}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onMouseEnter={() => setHoverOrFocus(true)}
          onMouseLeave={() => setHoverOrFocus(false)}
          onFocus={() => setHoverOrFocus(true)}
          onBlur={() => setHoverOrFocus(false)}
          className="mt-10"
        >
          <div ref={emblaRef} className="overflow-hidden">
            <ul className="-ml-4 flex touch-pan-y">
              {SPEAKERS.map(({ id, src, position }, index) => {
                const person = t.speakers.people[id]
                return (
                  <li
                    key={id}
                    aria-label={t.speakers.slideOf(index + 1, total)}
                    className="min-w-0 shrink-0 grow-0 basis-full pl-4 md:basis-1/2 lg:basis-1/3"
                  >
                    <article className="flex h-full flex-col bg-espuma p-5 text-noche">
                      <figure>
                        <img
                          src={src}
                          alt={person.alt}
                          loading="lazy"
                          draggable={false}
                          style={{ objectPosition: position }}
                          className="arco aspect-[4/5] w-full object-cover"
                        />
                        <figcaption className="figure-caption mt-2">{person.caption}</figcaption>
                      </figure>
                      <p className="eyebrow mt-4">{person.name}</p>
                      <h3 className="mt-1 font-display text-2xl leading-tight">{person.title}</h3>
                      <p className="mt-2 text-base">{person.summary}</p>
                    </article>
                  </li>
                )
              })}
            </ul>
          </div>

          <p className="sr-only" aria-live={autoplaying ? 'off' : 'polite'}>
            {t.speakers.slideOf(selected + 1, total)}: {current.name}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            <button
              type="button"
              aria-label={t.speakers.previous}
              onClick={() => emblaApi?.scrollPrev()}
              className="tap-target bg-ipe text-noche hover:bg-espuma"
            >
              <ChevronLeft aria-hidden="true" />
            </button>

            <ul className="flex">
              {SPEAKERS.map(({ id }, index) => (
                <li key={id}>
                  <button
                    type="button"
                    aria-label={t.speakers.goTo(t.speakers.people[id].name)}
                    aria-current={selected === index ? 'true' : undefined}
                    onClick={() => emblaApi?.scrollTo(index)}
                    className="group flex size-8 items-center justify-center"
                  >
                    <span
                      className={`block size-3 rounded-full border-2 border-ipe transition-colors ${selected === index ? 'bg-ipe' : 'group-hover:bg-ipe/50'}`}
                    />
                  </button>
                </li>
              ))}
            </ul>

            <button
              type="button"
              aria-label={t.speakers.next}
              onClick={() => emblaApi?.scrollNext()}
              className="tap-target bg-ipe text-noche hover:bg-espuma"
            >
              <ChevronRight aria-hidden="true" />
            </button>

            {!prefersReducedMotion && (
              <button
                type="button"
                aria-label={userPaused ? t.speakers.play : t.speakers.pause}
                onClick={() => setUserPaused((paused) => !paused)}
                className="tap-target ml-1 text-ipe hover:text-espuma"
              >
                {userPaused ? <Play aria-hidden="true" size={20} /> : <Pause aria-hidden="true" size={20} />}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
