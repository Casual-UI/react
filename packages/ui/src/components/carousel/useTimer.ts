import { useCallback, useEffect, useState } from 'react'

export default function useTimer(cb: (...params: any) => any, delay: number) {
  const [flag, setFlag] = useState<ReturnType<typeof setTimeout> | null>(null)

  const [start, setStart] = useState(Date.now())

  const [remain, setRemain] = useState(delay)

  const doClear = useCallback((setFlagNull = true) => {
    if (flag) {
      clearTimeout(flag)
      if (setFlagNull)
        setFlag(null)
    }
  }, [flag])

  useEffect(() => () => doClear(false), [doClear])

  const reset = () => {
    setStart(Date.now())
    setRemain(delay)
    doClear()
  }

  const begin = () => {
    if (delay < 1)
      return
    setRemain(delay)
    setStart(Date.now())
    setFlag(setTimeout(cb, remain))
  }

  const resume = () => {
    if (remain < 1)
      return
    doClear()
    setFlag(setTimeout(cb, remain))
  }

  const pause = () => {
    doClear()
    setRemain(remain - (Date.now() - start))
  }

  return {
    reset,
    begin,
    resume,
    pause,
    flag,
    remain,
    start,
  }
}
