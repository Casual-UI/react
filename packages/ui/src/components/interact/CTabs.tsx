import type { ReactNode } from 'react'
import React, { createRef, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import type { CSize } from '@casual-ui/types'
import { CCarousel, useSize } from '@casual-ui/react'
import type { CCarouselRef } from '../carousel/CCarousel'

type ReactNodeWithSetName = (toName: (name: string) => void) => ReactNode
interface CTabItem {
  /**
   * The name
   * @zh 名称
   */
  name: string
  /**
   * The panel content
   * @zh 面板内容
   */
  content?: ReactNode | ReactNodeWithSetName
  /**
   * Customize the header content
   * @zh 自定义头部
   */
  header?: ReactNode
}

interface CTabsProps {
  /**
   * Tab panels config
   * @zh 面板项配置
   */
  items: CTabItem[]
  /**
   * Current active tab name.
   * @zh 当前激活的面板项名称
   */
  activeTab: string
  /**
   * Emit when the active name change.
   * @zh 面板项切换时触发事件
   */
  onTabChange?: (tab: string) => void
  /**
   * The size
   * @zh 尺寸
   */
  size?: CSize
  /**
   * Determine whether the panel has padding.
   * @zh 面板是否具有根据跟随size的内边距
   */
  panelPadding?: boolean
  /**
   * Customize the body style.
   * @zh 自定义面板体样式
   */
  bodyStyle?: React.CSSProperties
  /**
   * Customize the header content.
   * @zh 自定义头部部分
   */
  customHeader?: ReactNode | ReactNodeWithSetName

  /**
   * Used for [CCarousel](/components/basic/carousel) isFlow prop
   * @zh 用于 [CCarousel](/components/basic/carousel) isFlow prop
   */
  isFlow?: boolean
}
const CTabs = ({
  items,
  onTabChange,
  size,
  panelPadding = true,
  bodyStyle,
  isFlow,
  activeTab,
  customHeader,
}: CTabsProps) => {
  const realSize = useSize(size)
  const carouselRef = createRef<CCarouselRef>()

  const [activeBarLeft, setActiveBarLeft] = useState('0')
  const [activeBarWidth, setActiveBarWidth] = useState('0')
  const initialIndex = items.findIndex(item => item.name === activeTab)
  const [activeTabIndex, setActiveTabIndex] = useState(initialIndex === -1 ? 0 : initialIndex)

  const header = useRef<HTMLDivElement>(null)

  const toName = (name: string) => {
    carouselRef.current?.toIndex(items.findIndex(item => item.name === name))
    onTabChange?.(name)
  }

  useEffect(() => {
    if (!header.current)
      return
    const activeItem = header.current.querySelector<HTMLDivElement>(
      '.c-tabs--header-item-active',
    )
    if (!activeItem)
      return
    setActiveBarLeft(`${activeItem.offsetLeft}px`)
    setActiveBarWidth(`${activeItem.offsetWidth}px`)
  }, [activeTabIndex])

  return (
    <div className={clsx('c-tabs')}>
      {customHeader
        ? (typeof customHeader === 'function' ? customHeader(toName) : customHeader)
        : (
        <div
          ref={header}
          className="c-tabs--header c-row c-items-center"
        >
          {items.map((item, i) => (
            <div
              key={item.name}
              className={clsx(
                'c-tabs--header-item',
                `c-h-${realSize}`,
                `c-font-${realSize}`,
                `c-px-${realSize}`,
                activeTabIndex === i && 'c-tabs--header-item-active',
              )}
              onClick={() => toName(item.name)}
            >
              {item.header ? item.header : item.name}
            </div>
          ))}
          <div
            className="c-tabs--header-active-bar"
            style={{
              left: activeBarLeft,
              width: activeBarWidth,
            }}
          ></div>
        </div>
          )}
      <div
        style={bodyStyle}
        className={clsx('c-tabs--body', panelPadding && `c-pa-${realSize}`)}
      >
        <CCarousel
          ref={carouselRef}
          activeIndex={activeTabIndex}
          arrowTiming="never"
          onActiveIndexChange={setActiveTabIndex}
          showIndicators={false}
          isFlow={isFlow}
        >
          {items.map(({ content }) => typeof content === 'function' ? content(toName) : content)}
        </CCarousel>
      </div>
    </div>
  )
}
export default CTabs
export type { CTabsProps }
