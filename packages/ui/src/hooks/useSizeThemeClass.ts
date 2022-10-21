import { CSize, CTheme } from '@casual-ui/types'
import { useMemo } from 'react'

export default ({
  size = 'md',
  theme = 'primary',
  prefix,
}: {
  size?: CSize
  theme?: CTheme
  prefix: string
}) => {
  return useMemo(
    () => [prefix, `${prefix}--theme-${theme}`, `${prefix}--size-${size}`],
    [size, theme]
  )
}
