import { matKeyboardArrowDown } from '@quasar/extras/material-icons'
import clsx from 'clsx'
import type { CSSProperties, ReactNode } from 'react'
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import CIcon from '../basic/icon/CIcon'

interface CExpansionProps {
  /**
   * The icon content.
   * @zh 图标
   */
  icon?: ReactNode
  /**
   * The title
   * @zh 标题
   */
  title?: ReactNode
  /**
   * Customize the arrow
   * @zh 自定义箭头
   */
  arrow?: (expandStatus: boolean) => ReactNode
  /**
   * The expand status.
   * @zh 是否展开
   */
  open?: boolean
  /**
   * Emit when expand status change.
   * @zh 设置展开态
   */
  setOpen?: (openStatus: boolean) => void
  /**
   * The expand content.
   * @zh 折叠内容
   */
  children: ReactNode
  /**
   * Determine whether to expand from top.
   * @zh 是否从上方展开
   */
  reverse?: boolean

  /**
   * Customize the header styles.
   * @zh 自定义展开头部样式
   */
  headerStyle?: CSSProperties
}

const CExpansion = ({
  icon,
  title = '',
  open = false,
  arrow,
  children,
  reverse = false,
  headerStyle,
}: CExpansionProps) => {
  const [innerOpen, setInnerOpen] = useState(true)
  const [initialBodyHeight, setInitialBodyHeight] = useState('auto')

  const realtimeBodyHeigh = useMemo(
    () => (innerOpen ? initialBodyHeight : 0),
    [innerOpen, initialBodyHeight],
  )

  const bodyDom = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setInitialBodyHeight(`${bodyDom.current?.clientHeight}px`)
    setInnerOpen(open)
  }, [open])

  const onHeaderClick = useCallback(() => {
    setInnerOpen(!innerOpen)
  }, [innerOpen])

  return (
    <div
      className={clsx('c-expansion', innerOpen && 'c-expansion--expanded')}
      style={
        {
          '--casual-expansion-height': realtimeBodyHeigh,
        } as CSSProperties
      }
    >
      {reverse && (
        <div
          ref={bodyDom}
          className="c-expansion--body"
        >
          {children}
        </div>
      )}
      <div
        className="c-expansion--header"
        onClick={onHeaderClick}
        style={headerStyle}
      >
        {icon && <div className="c-expansion--icon">{icon}</div>}
        <div className="c-expansion--title">{title}</div>
        <div
          className={clsx(
            'c-expansion--arrow',
            innerOpen && 'c-expansion--arrow-expanded',
          )}
        >
          {arrow ? arrow(innerOpen) : <CIcon content={matKeyboardArrowDown} />}
        </div>
      </div>
      {!reverse && (
        <div
          ref={bodyDom}
          className="c-expansion--body"
        >
          {children}
        </div>
      )}
    </div>
  )
}

export default CExpansion

export type { CExpansionProps }
