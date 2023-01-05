import { useEffect, useRef } from 'react'

const useNotFirst = (action: Function, dependencies: any[]) => {
  const isFirst = useRef(true)
  useEffect(() => {
    if (isFirst.current)
      isFirst.current = false
    else
      action()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)
}

export default useNotFirst
