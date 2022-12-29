import type { ReactNode } from 'react'
import React from 'react'
interface OTdProps {
  width?: string
  children?: ReactNode
}

const OTd = ({ children, width = 'auto' }: OTdProps) => {
  return (
    <td className="c-table--td" style={{ width }}>
      {children}
    </td>
  )
}

export default OTd
