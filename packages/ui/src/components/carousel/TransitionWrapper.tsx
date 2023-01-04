import React, { useCallback, useContext, useRef } from 'react'
import { animated, config, useTransition } from 'react-spring'
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

  const isFirst = useRef(true)

  const { hovering, pauses, resumes, setSliding, setCurrentItemHeight, setCurrentItemWidth } = useContext(CarouselContext)

  pauses.push(
    useCallback(() => {
      if (activeIndex === currentIndex)
        pause()
    }, [activeIndex, currentIndex, pause]),
  )
  resumes.push(
    useCallback(() => {
      if (activeIndex === currentIndex)
        resume()
    }, [activeIndex, currentIndex, resume]),
  )

  const transition = useTransition(activeIndex === currentIndex, {
    from: {
      x: direction === 'forward' ? 100 : -100,
    },
    delay: 0,
    config: config.default,
    enter: {
      x: 0,
    },
    leave: {
      x: direction === 'forward' ? -100 : 100,
    },
    onStart: () => {
      setSliding(true)
    },
    onRest({ value: { x } }: any) {
      reset()
      if (x !== 0 || activeIndex !== currentIndex)
        return

      if (!hovering)
        begin()
      if (isFirst.current)
        isFirst.current = false

      setSliding(false)
      if (container.current) {
        setCurrentItemHeight?.(container.current.offsetHeight)
        setCurrentItemWidth?.(container.current.offsetWidth)
      }
    },
  })

  return transition(
    ({ x }, item) =>
      item && (
        <animated.div
          ref={container}
          style={{
            transform: x.to(x => `translate${vertical ? 'Y' : 'X'}(${x}%)`),
            ...((x.isAnimating && !isFirst.current)
              ? {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }
              : {}),
          }}
        >
          {children}
        </animated.div>
      ),
  )
}

export default TransitionWrapper
