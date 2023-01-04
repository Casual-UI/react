import React, { forwardRef, useImperativeHandle, useState } from 'react'
import clsx from 'clsx'
import type { CTheme } from '@casual-ui/types'
import type { Ref } from 'react'
import useTheme from '../../hooks/useTheme'

interface CAjaxBarProps {
  /**
   * The color theme of ajax bar
   * @zh 主题色
   */
  theme: CTheme
}

const CAjaxBarWithoutForward = ({
  theme,
}: CAjaxBarProps,
/**
 * The forward ref
 * @zh 转发的 ref 实例
 */
ref: Ref<{
  /**
   * Start the ajax bar
   * @zh 开始加载
   */
  start: () => void
  /**
   * End the ajax bar
   * @zh 结束加载
   */
  end: () => void
}>) => {
  /**
   * The ajax bar width
   */
  const [barWidth, setBarWidth] = useState(0)

  const [startedFlag, setStartedFlag] = useState<ReturnType<typeof setInterval> | null>(null)

  const maybeClear = () => {
    if (startedFlag) {
      clearInterval(startedFlag)
      setStartedFlag(null)
    }
  }

  const start = () => {
    setBarWidth(0)
    maybeClear()
    setStartedFlag(setInterval(() => {
      if (barWidth < 100)
        setBarWidth(bw => bw + 1)

      else
        maybeClear()
    }, 200))
  }

  const end = () => {
    if (barWidth > 0) {
      setBarWidth(100)
      setTimeout(() => {
        setBarWidth(0)
      }, 100)
    }
    maybeClear()
  }
  const contextTheme = useTheme(theme)

  useImperativeHandle(ref, () => {
    return {
      start,
      end,
    }
  })
  return (
    <div
      className={clsx('c-ajax-bar', `c-ajax-bar--theme-${contextTheme}`)}
      style={{
        '--casual-ajax-bar-width': `${barWidth}%`,
      }}
    >
      <div className="c-ajax-bar--progress"></div>
    </div>
  )
}

const CAjaxBar = forwardRef(CAjaxBarWithoutForward)
export default CAjaxBar
export type { CAjaxBarProps }
