import { useEffect, useRef, useState } from 'react'

export default function useTimer(cb: (...params: any) => any, delay: number) {
  const countdownFlag = useRef<number | null>(null)

  const [start, setStart] = useState(Date.now())

  const [remain, setRemain] = useState(delay)

  const clearCountdown = () => {
    if (countdownFlag.current) {
      clearTimeout(countdownFlag.current)
      countdownFlag.current = null
    }
  }

  const reset = () => {
    clearCountdown()
    setStart(Date.now())
    setRemain(delay)
  }

  const begin = () => {
    if (delay < 1)
      return
    setRemain(delay)
    setStart(Date.now())
    countdownFlag.current = setTimeout(cb, delay)
  }

  const resume = () => {
    if (remain < 1)
      return
    clearCountdown()
    countdownFlag.current = setTimeout(cb, remain)
  }

  const pause = () => {
    clearCountdown()
    setRemain(remain - (Date.now() - start))
  }

  useEffect(() => () => clearCountdown(), [])

  return {
    clearCountdown,
    reset,
    begin,
    resume,
    pause,
    countdownFlag,
    remain,
    start,
  }
}
