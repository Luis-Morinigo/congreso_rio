import { useEffect, useState } from 'react'

export interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  finished: boolean
}

function timeLeftUntil(target: number): TimeLeft {
  const totalSeconds = Math.max(0, Math.floor((target - Date.now()) / 1000))
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    finished: totalSeconds === 0,
  }
}

export function useCountdown(targetIso: string): TimeLeft {
  const target = Date.parse(targetIso)
  const [timeLeft, setTimeLeft] = useState(() => timeLeftUntil(target))

  useEffect(() => {
    const update = () => setTimeLeft(timeLeftUntil(target))
    update()
    const id = window.setInterval(update, 1000)
    return () => window.clearInterval(id)
  }, [target])

  return timeLeft
}
