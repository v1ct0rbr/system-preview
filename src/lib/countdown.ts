import { useEffect, useState } from "react"

export type CountdownParts = {
  days: number
  hours: number
  minutes: number
  seconds: number
  totalSeconds: number
  isLaunched: boolean
}

export function getCountdownParts(
  targetTime: number,
  now = Date.now(),
): CountdownParts {
  const totalSeconds = Math.max(0, Math.ceil((targetTime - now) / 1000))

  return {
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3_600),
    minutes: Math.floor((totalSeconds % 3_600) / 60),
    seconds: totalSeconds % 60,
    totalSeconds,
    isLaunched: totalSeconds <= 0,
  }
}

export function useCountdown(target: Date): CountdownParts {
  const targetTime = target.getTime()
  const [parts, setParts] = useState(() => getCountdownParts(targetTime))

  useEffect(() => {
    const tick = () => setParts(getCountdownParts(targetTime))
    tick()

    const interval = window.setInterval(tick, 250)
    return () => window.clearInterval(interval)
  }, [targetTime])

  return parts
}
