import type { ReactNode } from 'react'
import React from 'react'
interface OTdProps {
  width?: string
  children?: ReactNode
}
const CTh = ({ children, width = 'auto' }: OTdProps) => {
  return (
    <th className="c-table--th" style={{ width }}>
      {children}
    </th>
  )
}

export default CTh
