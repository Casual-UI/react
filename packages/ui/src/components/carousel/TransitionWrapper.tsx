import React, { useContext, useEffect, useRef } from 'react'
import { animated, useSpringRef, useTransition } from 'react-spring'
import useTimer from './useTimer'
import { CarouselContext } from './CarouselContext'

type Direction = 'forward' | 'backward'

const TransitionWrapper = ({
  direction,
  activeIndex,
  currentIndex,
  children,
  toNext,
  interval,
  vertical,
}: {
  direction: Direction
  activeIndex: number
  currentIndex: number
  children: any
  toNext: () => void
  interval: number
  vertical: boolean
}) => {
  const container = useRef<HTMLDivElement>(null)
  const { reset, begin, resume, pause } = useTimer(toNext, interval)

  const { hovering, pauses, resumes, setSliding, setCurrentItemHeight, setCurrentItemWidth } = useContext(CarouselContext)

  if (interval) {
    pauses.push(pause)
    resumes.push(resume)
  }

  const springRef = useSpringRef()

  const transition = useTransition(currentIndex, {
    ref: springRef,
    from: { transform: `translate${vertical ? 'Y' : 'X'}(${direction === 'forward' ? 100 : -100}%)` },
    enter: { transform: `translate${vertical ? 'Y' : 'X'}(0%)` },
    leave: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      transform: `translate${vertical ? 'Y' : 'X'}(${direction === 'forward' ? -100 : 100}%)`,
    },
    keys: null,
    onStart: () => {
      setSliding(true)
    },
    onRest({ value: { x } }: any) {
      setSliding(false)
      if (interval)
        reset()
      if (x !== 0)
        return

      if (!hovering && interval)
        begin()

      if (container.current) {
        setCurrentItemHeight?.(container.current.offsetHeight)
        setCurrentItemWidth?.(container.current.offsetWidth)
      }
    },
  })

  useEffect(() => {
    springRef.start()
  }, [activeIndex])

  return transition(
    style => <animated.div
          ref={container}
          style={style}
        >
          {children}
        </animated.div>,
  )
}

export default TransitionWrapper
