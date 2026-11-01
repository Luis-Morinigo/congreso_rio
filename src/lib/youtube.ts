/** Estados de reproducción de la IFrame Player API de YouTube. */
export const YT_STATE = { ENDED: 0, PLAYING: 1, PAUSED: 2, BUFFERING: 3 } as const

export interface YouTubePlayer {
  playVideo(): void
  pauseVideo(): void
  seekTo(seconds: number, allowSeekAhead: boolean): void
  unMute(): void
  getPlayerState(): number
  destroy(): void
}

interface YouTubePlayerOptions {
  host: string
  videoId: string
  width: number
  height: number
  playerVars: Record<string, string | number>
  events: {
    onReady: () => void
    onStateChange: (event: { data: number }) => void
    onError: () => void
  }
}

export interface YouTubeApi {
  Player: new (target: HTMLElement, options: YouTubePlayerOptions) => YouTubePlayer
}

declare global {
  interface Window {
    YT?: YouTubeApi
    onYouTubeIframeAPIReady?: () => void
  }
}

let apiPromise: Promise<YouTubeApi> | null = null

/** Carga la API una sola vez. Rechaza si el script no llega, por ejemplo con un bloqueador de contenido. */
export function loadYouTubeApi(): Promise<YouTubeApi> {
  apiPromise ??= new Promise((resolve, reject) => {
    window.onYouTubeIframeAPIReady = () => resolve(window.YT as YouTubeApi)
    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    script.async = true
    script.onerror = () => {
      apiPromise = null
      reject(new Error('No se pudo cargar la API de YouTube'))
    }
    document.head.append(script)
  })
  return apiPromise
}
