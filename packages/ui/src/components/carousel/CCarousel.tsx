import {
  matNavigateBefore,
  matNavigateNext,
} from '@quasar/extras/material-icons'
import type { CTheme } from '@casual-ui/types'
import clsx from 'clsx'
import type { CSSProperties, ReactNode, Ref } from 'react'
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { animated, useSpringRef, useTransition } from 'react-spring'
import CButton from '../basic/button/CButton'
import CIcon from '../basic/icon/CIcon'
import Fade from '../transition/Fade'
import useTimer from './useTimer'
export interface CCarouselProps {
  /**
   * The height of container.
   * @zh 容器的高度
   */
  height?: string

  /**
   * Determine whether to use fixed height or auto toggle height when the content change.
   * @zh 是否使用固定高度，设置为 `false` 则会每次内容变化重新计算高度
   */
  fixedHeight?: boolean

  /**
   * Tell CCarousel whether the position of the outer container is not static.
   * @zh 告知外部容器是否为脱离文档流，即非 `static` 定位
   */
  isFlow?: boolean

  /**
   * The theme color. It will affect the control arrow and the indicators' style.
   * @zh 主题色，会影响指示器以及箭头控制器的颜色
   */
  theme?: CTheme

  /**
   * The autoplay interval. If the value is larger than 0 will set a autoplay. Notice that the transition time is not counting.
   * @zh 自动播放间隔，若该值大于0会以该值启动自动播放。值得一提的是动画过渡时间并不会算在内
   */
  interval?: number

  /**
   * The current slider index (from 0).
   * @zh 当前激活的轮播下标（从0开始）
   */
  activeIndex?: number

  /**
   * Emit when the current slider index changed.
   * @zh 当前激活的轮播变化时触发
   */
  onActiveIndexChange?: (newIndex: number) => void

  /**
   * Determine whether to show the indicators or not.
   * @zh 是否展示指示器
   */
  showIndicators?: boolean

  /**
   * The horizontal position of the indicators.
   * @zh 指示器的横向位置
   */
  indicatorsPositionHorizontal?: 'start' | 'center' | 'end'

  /**
   * The vertical position of the indicators.
   * @zh 指示器的纵向位置
   */
  indicatorsPositionVertical?: 'start' | 'center' | 'end'

  /**
   * The align direction of indicators.
   * @zh 指示器排列方向
   */
  indicatorsAlignDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse'

  /**
   * Determine whether the transition is vertical or not.
   * @zh 是否纵向过渡
   */
  vertical?: boolean

  /**
   * Determine the carousel can be infinity or not.
   * @zh 是否无限循环
   */
  infinity?: boolean

  /**
   * Determine the arrow shown method.
   * @zh 箭头展示时机
   */
  arrowTiming?: 'always' | 'hover' | 'never'

  /**
   * Customize the indicators content.
   * @zh 自定义指示器内容
   */
  customIndicators?: ReactNode

  /**
   * Customize the to previous control arrow.
   * @zh 自定义前一个箭头控制器
   */
  customArrowPrev?: ReactNode

  /**
   * Customize the to next control arrow.
   * @zh 自定义后一个箭头控制器
   */
  customArrowNext?: ReactNode

  /**
   * Determine whether to pause the autoplay when the carousel is hovered.
   * @zh 鼠标悬浮时是否暂停自动播放
   */
  pauseOnHover?: boolean

  /**
   * The content of carousel. It is recommended to use `CCarouselSlider`
   * @zh 内容，建议使用<code>CCarouselSlider</code>
   */
  children: Array<ReactNode>
}

type Direction = 'forward' | 'backward'
export interface CCarouselRef {
  toIndex: (idx: number) => void
}

const CCarouselWithoutForward = ({
  height = '300px',
  theme = 'primary',
  interval = 0,
  activeIndex = 0,
  onActiveIndexChange,
  indicatorsAlignDirection = 'row',
  indicatorsPositionHorizontal = 'center',
  indicatorsPositionVertical = 'end',
  vertical = false,
  infinity = false,
  arrowTiming = 'always',
  customIndicators,
  customArrowPrev,
  customArrowNext,
  children,
  pauseOnHover = true,
  showIndicators = true,
  fixedHeight = false,
  isFlow = false,
}: CCarouselProps, ref: Ref<CCarouselRef>) => {
  const [direction, setDirection] = useState<Direction>('forward')

  const [showArrow, setShowArrow] = useState(arrowTiming === 'always')

  const showPrevArrow = showArrow && (infinity || activeIndex > 0)

  const showNextArrow = showArrow && (infinity || activeIndex < children.length - 1)

  const [hovering, setHovering] = useState(false)

  const toIndex = (idx: number) => {
    if (idx < activeIndex) {
      setDirection('backward')
      if (idx >= 0) {
        onActiveIndexChange?.(idx)
        return
      }
      if (infinity)
        onActiveIndexChange?.(children.length - 1)

      return
    }
    if (idx > activeIndex) {
      setDirection('forward')
      if (idx < children.length) {
        onActiveIndexChange?.(idx)
        return
      }
      if (infinity)
        onActiveIndexChange?.(0)
    }
  }

  const toPrev = () => toIndex(activeIndex - 1)

  const toNext = () => {
    toIndex(activeIndex + 1)
  }

  const { reset, begin, resume, pause } = useTimer(toNext, interval)

  const handleMouseEnter = () => {
    if (arrowTiming === 'hover')
      setShowArrow(true)

    setHovering(true)
    if (pauseOnHover)
      pause()
  }

  const handleMouseLeave = () => {
    if (arrowTiming === 'hover')
      setShowArrow(false)

    setHovering(false)
    if (pauseOnHover)
      resume()
  }

  const [transitioning, setTransitioning] = useState(false)

  const indicatorAnimationState = ((pauseOnHover && hovering) || transitioning ? 'paused' : 'running')

  const [currentItemHeight, setCurrentItemHeight] = useState(0)
  const [currentItemWidth, setCurrentItemWidth] = useState(0)

  useImperativeHandle(ref, () => ({
    toIndex,
  }))

  const style: CSSProperties = {
    height: fixedHeight ? height : currentItemHeight ? `${currentItemHeight}px` : 'auto',
  }
  if (isFlow && currentItemWidth)
    style.width = `${currentItemWidth}px`

  const springRef = useSpringRef()

  const slidesRef = useRef<HTMLDivElement>(null)

  const transition = useTransition(activeIndex, {
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
      setTransitioning(true)
    },
    onRest(_state, _control, idx) {
      setTransitioning(false)
      if (idx !== activeIndex)
        return
      reset()
      if (interval && !hovering)
        begin()

      if (slidesRef.current) {
        setCurrentItemHeight?.(slidesRef.current.offsetHeight)
        setCurrentItemWidth?.(slidesRef.current.offsetWidth)
      }
    },
  })

  useEffect(() => {
    springRef.start()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex])

  return (
    <div
      className={clsx('c-carousel', vertical && 'c-carousel--vertical')}
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={clsx(
          'c-carousel--indicators',
          'c-flex',
          `c-items-${indicatorsPositionVertical}`,
          `c-justify-${indicatorsPositionHorizontal}`,
        )}
      >
        <div
          className={clsx(
            'c-carousel--indicators-container',
            'c-gutter-xs',
            'c-flex',
            `c-${indicatorsAlignDirection}`,
          )}
        >
          {showIndicators && (customIndicators || children.map((_, i) => {
            const isActive = i === activeIndex
            return (
                  <div key={`indicators-${i}`}>
                    <div
                      className={clsx(
                        'c-carousel--indicator-item',
                        `c-carousel--indicator-item--${theme}`,
                        isActive && 'c-carousel--indicator-item--active',
                      )}
                      onClick={() => toIndex(i)}
                    >
                      <div className="c-carousel--indicator-item--bg"></div>
                      <div
                        className="c-carousel--indicator-item--progress-bar"
                        style={
                          isActive
                            ? {
                                animationPlayState: indicatorAnimationState,
                                animationDuration: `${interval}ms`,
                              }
                            : {}
                        }
                      ></div>
                    </div>
                  </div>
            )
          }))}
        </div>
      </div>
      <Fade show={showPrevArrow}>
        <div
          className="c-carousel--control c-carousel--control--prev"
          onClick={toPrev}
        >
          {customArrowPrev || (
            <CButton
              flat
              icon
              theme={theme}
            >
              <CIcon content={matNavigateBefore} />
            </CButton>
          )}
        </div>
      </Fade>
      <Fade show={showNextArrow}>
        <div
          className="c-carousel--control c-carousel--control--next"
          onClick={toNext}
        >
          {customArrowNext || (
            <CButton
              flat
              icon
              theme={theme}
            >
              <CIcon content={matNavigateNext} />
            </CButton>
          )}
        </div>
      </Fade>
      <div className="c-carousel--sliders" ref={slidesRef}>
        {transition((style, idx) => <animated.div style={style}>
          {children[idx]}
        </animated.div>)}
      </div>
    </div>
  )
}

const CCarousel = forwardRef(CCarouselWithoutForward)

export default CCarousel
