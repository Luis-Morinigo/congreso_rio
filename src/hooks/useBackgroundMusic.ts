import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import { readStorage, writeStorage } from '../lib/storage'
import { loadYouTubeApi, YT_STATE, type YouTubePlayer } from '../lib/youtube'

/** "Ai Se Eu Te Pego", video oficial de Michel Teló. */
const VIDEO_ID = 'hcm55lU9knw'
const MUTED_KEY = 'congreso_rio.music.muted'
/** Las normas de YouTube piden un reproductor visible de al menos 200×200 px. */
export const PLAYER_SIZE = 200
/** La API no avisa cuando el navegador bloquea el autoplay: se deduce si no arrancó en este plazo. */
const START_TIMEOUT_MS = 2500

/** Eventos que el navegador reconoce como activación del usuario (click, tap, tecla). */
const ACTIVATION_EVENTS = ['pointerdown', 'pointerup', 'touchend', 'keydown', 'click'] as const

/** Los controles propios de la música llevan este atributo: resuelven el click ellos mismos. */
export const MUSIC_CONTROL_ATTR = 'data-music-control'

type Status = 'idle' | 'playing' | 'paused' | 'blocked' | 'unavailable'

export interface BackgroundMusic {
  /** Contenedor donde YouTube inserta su iframe. */
  hostRef: RefObject<HTMLDivElement | null>
  isPlaying: boolean
  isPlayerVisible: boolean
  /** El navegador bloqueó el autoplay y hace falta una interacción. */
  needsActivation: boolean
  /** Una interacción en la página no alcanzó (iPhone): hay que tocar el propio reproductor. */
  needsPlayerTap: boolean
  /** YouTube no se pudo cargar o el video no admite el embed. */
  isUnavailable: boolean
  toggle: () => void
  close: () => void
}

export function useBackgroundMusic(): BackgroundMusic {
  const hostRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YouTubePlayer | null>(null)
  const startTimerRef = useRef<number | undefined>(undefined)
  const activationTriedRef = useRef(false)
  const [isMuted, setIsMuted] = useState(() => readStorage(MUTED_KEY) === 'true')
  const mutedRef = useRef(isMuted)
  const [status, setStatus] = useState<Status>('idle')
  const [needsPlayerTap, setNeedsPlayerTap] = useState(false)

  const tryPlay = useCallback(() => {
    const player = playerRef.current
    if (!player || mutedRef.current) return
    player.unMute()
    player.playVideo()
    window.clearTimeout(startTimerRef.current)
    const checkStart = () => {
      const state = player.getPlayerState()
      if (state === YT_STATE.PLAYING) return
      // Si está cargando todavía no se puede concluir que el navegador lo bloqueó.
      if (state === YT_STATE.BUFFERING) {
        startTimerRef.current = window.setTimeout(checkStart, START_TIMEOUT_MS)
        return
      }
      startTimerRef.current = undefined
      setStatus('blocked')
      if (activationTriedRef.current) setNeedsPlayerTap(true)
    }
    startTimerRef.current = window.setTimeout(checkStart, START_TIMEOUT_MS)
  }, [])

  // El reproductor se crea recién cuando hace falta: con la música silenciada no se contacta a YouTube.
  useEffect(() => {
    const host = hostRef.current
    if (isMuted || playerRef.current || !host) return
    let cancelled = false

    loadYouTubeApi()
      .then((YT) => {
        if (cancelled) return
        const target = document.createElement('div')
        host.append(target)
        const player = new YT.Player(target, {
          host: 'https://www.youtube-nocookie.com',
          videoId: VIDEO_ID,
          width: PLAYER_SIZE,
          height: PLAYER_SIZE,
          // loop + playlist con el mismo video es la forma documentada de repetirlo.
          playerVars: { loop: 1, playlist: VIDEO_ID, playsinline: 1, rel: 0, origin: window.location.origin },
          events: {
            onReady: () => {
              playerRef.current = player
              tryPlay()
            },
            onStateChange: ({ data }) => {
              if (data === YT_STATE.PLAYING) {
                window.clearTimeout(startTimerRef.current)
                startTimerRef.current = undefined
                setNeedsPlayerTap(false)
                setStatus('playing')
              } else if (data === YT_STATE.PAUSED && startTimerRef.current === undefined) {
                setStatus((current) => (current === 'playing' ? 'paused' : current))
              } else if (data === YT_STATE.ENDED) {
                // Respaldo por si el reproductor no respeta loop.
                player.seekTo(0, true)
                player.playVideo()
              }
            },
            onError: () => setStatus('unavailable'),
          },
        })
      })
      .catch(() => {
        if (!cancelled) setStatus('unavailable')
      })

    return () => {
      cancelled = true
    }
  }, [isMuted, tryPlay])

  useEffect(
    () => () => {
      window.clearTimeout(startTimerRef.current)
      playerRef.current?.destroy()
      playerRef.current = null
    },
    [],
  )

  // Con el autoplay bloqueado, la primera interacción en cualquier parte de la página inicia la música.
  useEffect(() => {
    if (status !== 'blocked' || isMuted) return
    const handleActivation = (event: Event) => {
      if (event.target instanceof Element && event.target.closest(`[${MUSIC_CONTROL_ATTR}]`)) return
      activationTriedRef.current = true
      tryPlay()
    }
    ACTIVATION_EVENTS.forEach((name) => document.addEventListener(name, handleActivation, true))
    return () => ACTIVATION_EVENTS.forEach((name) => document.removeEventListener(name, handleActivation, true))
  }, [status, isMuted, tryPlay])

  const setMuted = useCallback((muted: boolean) => {
    mutedRef.current = muted
    setIsMuted(muted)
    writeStorage(MUTED_KEY, String(muted))
  }, [])

  const close = useCallback(() => {
    window.clearTimeout(startTimerRef.current)
    startTimerRef.current = undefined
    setMuted(true)
    playerRef.current?.pauseVideo()
    setNeedsPlayerTap(false)
    setStatus((current) => (current === 'unavailable' ? current : 'idle'))
  }, [setMuted])

  const toggle = useCallback(() => {
    if (status === 'unavailable') return
    if (isMuted) {
      setMuted(false)
      tryPlay()
    } else if (status === 'playing') {
      close()
    } else {
      // Sin sonido todavía: para quien hace click, este botón significa "activar".
      activationTriedRef.current = true
      tryPlay()
    }
  }, [close, isMuted, setMuted, status, tryPlay])

  return {
    hostRef,
    isPlaying: status === 'playing' && !isMuted,
    isPlayerVisible: !isMuted && status !== 'unavailable',
    needsActivation: status === 'blocked' && !isMuted,
    needsPlayerTap: needsPlayerTap && !isMuted,
    isUnavailable: status === 'unavailable',
    toggle,
    close,
  }
}
