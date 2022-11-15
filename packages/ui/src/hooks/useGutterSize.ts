import type { CSize } from '@casual-ui/types'
import { createContext, useContext, useMemo } from 'react'
const defaultSize: CSize = 'md'

const CGutterSizeContext = createContext<CSize>(defaultSize)

const useGutterSize = (size?: CSize) => {
  const contextSize = useContext(CGutterSizeContext)

  return useMemo(() => (size || contextSize), [size, contextSize])
}
export default useGutterSize

export { CGutterSizeContext }
