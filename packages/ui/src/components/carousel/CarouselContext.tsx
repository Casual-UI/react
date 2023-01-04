import { createContext } from 'react'

interface Context {
  hovering: boolean
  setSliding: (sliding: boolean) => void
  pauses: Function[]
  resumes: Function[]
  setCurrentItemHeight?: (h: number) => void
  setCurrentItemWidth?: (w: number) => void
  isFlow?: boolean
}

const CarouselContext = createContext<Context>({
  hovering: false,
  setSliding: () => {},
  pauses: [],
  resumes: [],
  isFlow: false,
})

export { CarouselContext, Context }
