import { useCallback, useEffect, useRef, useState } from 'react'
import { readStorage, writeStorage } from '../lib/storage'

const TRACKS = ['ai_se_eu_te_pego.mp3', 'magalenha.mp3'].map((file) => `${import.meta.env.BASE_URL}audio/${file}`)
const MUTED_KEY = 'congreso_rio.music.muted'

/** Eventos que el navegador reconoce como activación del usuario (click, tap, tecla). */
const ACTIVATION_EVENTS = ['pointerdown', 'pointerup', 'touchend', 'keydown', 'click'] as const

/** Los controles propios de la música llevan este atributo: resuelven el click ellos mismos. */
export const MUSIC_CONTROL_ATTR = 'data-music-control'

type Status = 'idle' | 'playing' | 'blocked' | 'unavailable'

export interface BackgroundMusic {
  isMuted: boolean
  isPlaying: boolean
  /** El navegador bloqueó el autoplay y hace falta una interacción. */
  needsActivation: boolean
  /** Ningún tema de la playlist se pudo cargar. */
  isUnavailable: boolean
  toggle: () => void
}

export function useBackgroundMusic(): BackgroundMusic {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const trackIndexRef = useRef(0)
  const failuresRef = useRef(0)
  const [isMuted, setIsMuted] = useState(() => readStorage(MUTED_KEY) === 'true')
  const mutedRef = useRef(isMuted)
  const [status, setStatus] = useState<Status>('idle')

  const tryPlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio || mutedRef.current) return
    audio.play().catch((error: DOMException) => {
      // AbortError (cambio de tema o pausa) y NotSupportedError (lo cubre el evento `error`) no requieren acción.
      if (error.name === 'NotAllowedError') {
        setStatus((current) => (current === 'unavailable' ? current : 'blocked'))
      }
    })
  }, [])

  useEffect(() => {
    // Único HTMLAudioElement de la página.
    const audio = (audioRef.current ??= new Audio())

    const loadTrack = (index: number) => {
      trackIndexRef.current = index
      audio.src = TRACKS[index]
    }
    const advance = () => {
      loadTrack((trackIndexRef.current + 1) % TRACKS.length)
      tryPlay()
    }
    const handlePlaying = () => {
      failuresRef.current = 0
      setStatus('playing')
    }
    const handleError = () => {
      failuresRef.current += 1
      // Si fallaron todos los temas se corta acá: reintentar sería un bucle de pedidos fallidos.
      if (failuresRef.current >= TRACKS.length) setStatus('unavailable')
      else advance()
    }

    audio.addEventListener('playing', handlePlaying)
    audio.addEventListener('ended', advance)
    audio.addEventListener('error', handleError)

    if (!audio.src) {
      audio.preload = mutedRef.current ? 'none' : 'auto'
      loadTrack(0)
    }
    tryPlay()

    return () => {
      audio.pause()
      audio.removeEventListener('playing', handlePlaying)
      audio.removeEventListener('ended', advance)
      audio.removeEventListener('error', handleError)
    }
  }, [tryPlay])

  // Con el autoplay bloqueado, la primera interacción en cualquier parte de la página inicia la música.
  useEffect(() => {
    if (status !== 'blocked' || isMuted) return
    const handleActivation = (event: Event) => {
      if (event.target instanceof Element && event.target.closest(`[${MUSIC_CONTROL_ATTR}]`)) return
      tryPlay()
    }
    ACTIVATION_EVENTS.forEach((name) => document.addEventListener(name, handleActivation, true))
    return () => ACTIVATION_EVENTS.forEach((name) => document.removeEventListener(name, handleActivation, true))
  }, [status, isMuted, tryPlay])

  const toggle = useCallback(() => {
    if (status === 'unavailable') return
    const setMuted = (muted: boolean) => {
      mutedRef.current = muted
      setIsMuted(muted)
      writeStorage(MUTED_KEY, String(muted))
    }
    if (isMuted) {
      setMuted(false)
      tryPlay()
    } else if (status === 'blocked') {
      // Sin sonido todavía: para quien hace click, este botón significa "activar".
      tryPlay()
    } else {
      setMuted(true)
      audioRef.current?.pause()
      setStatus('idle')
    }
  }, [isMuted, status, tryPlay])

  return {
    isMuted,
    isPlaying: status === 'playing' && !isMuted,
    needsActivation: status === 'blocked' && !isMuted,
    isUnavailable: status === 'unavailable',
    toggle,
  }
}
