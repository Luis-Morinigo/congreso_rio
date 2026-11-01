import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useRef, type KeyboardEvent } from 'react'
import confirmationImage from '../assets/rodri_regando.jpeg'
import { useI18n } from '../i18n/LanguageContext'

export interface Confirmation {
  name: string
  /** Números de día, en orden: ['28', '30']. */
  days: string[]
}

interface ConfirmationModalProps {
  confirmation: Confirmation | null
  onClose: () => void
}

export function ConfirmationModal({ confirmation, onClose }: ConfirmationModalProps) {
  const { language, t } = useI18n()
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const isOpen = confirmation !== null

  useEffect(() => {
    if (!isOpen) return
    closeRef.current?.focus()
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflow
    }
  }, [isOpen])

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose()
      return
    }
    if (event.key !== 'Tab') return
    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button')
    if (!focusable?.length) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return (
    <AnimatePresence>
      {confirmation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-noche/80 p-4"
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirmacion-titulo"
            aria-describedby="confirmacion-detalle"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, transition: { duration: 0.15 } }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            onClick={(event) => event.stopPropagation()}
            onKeyDown={handleKeyDown}
            className="relative my-auto grid w-full max-w-3xl gap-5 bg-espuma p-5 text-noche sm:grid-cols-[minmax(0,15rem)_1fr] sm:gap-8 sm:p-8"
          >
            <figure>
              <img
                src={confirmationImage}
                alt={t.confirmation.imageAlt}
                className="arco mx-auto aspect-[4/5] max-h-[38svh] w-auto object-cover object-[50%_32%] sm:aspect-[9/14] sm:max-h-none sm:w-full"
              />
              <figcaption className="figure-caption mt-2 text-center sm:text-left">{t.confirmation.caption}</figcaption>
            </figure>
            <div className="flex min-w-0 flex-col">
              <h2 id="confirmacion-titulo" className="pr-8 font-display text-3xl leading-tight break-words sm:text-4xl">
                {t.confirmation.title(confirmation.name)}
              </h2>
              <p id="confirmacion-detalle" className="mt-4 text-lg">
                {t.confirmation.days(new Intl.ListFormat(language, { type: 'conjunction' }).format(confirmation.days))}
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 min-h-12 self-start bg-mata px-8 font-semibold text-espuma hover:bg-noche sm:mt-auto"
              >
                {t.confirmation.close}
              </button>
            </div>
            <button
              ref={closeRef}
              type="button"
              aria-label={t.confirmation.close}
              onClick={onClose}
              className="tap-target absolute top-2 right-2 hover:text-brasa"
            >
              <X aria-hidden="true" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
