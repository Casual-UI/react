import type { ReactNode } from 'react'

interface CCarouselSliderProps {
  /**
   * The content
   * @zh 内容
   */
  children?: ReactNode
}

const CCarouselSlider = ({ children }: CCarouselSliderProps) => children

export default CCarouselSlider
export { CCarouselSliderProps }
