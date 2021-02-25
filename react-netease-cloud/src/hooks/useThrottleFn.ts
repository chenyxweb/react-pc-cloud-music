// 使用throttle函数

import { throttle } from 'lodash-es'
import { useEffect, useRef } from 'react'

const useThrottleFn = (dependence: string, delay: number, callback: Function) => {
  const throttleFn = useRef({
    fn: throttle((callback) => {
      callback && callback()
    }, delay),
  })

  useEffect(() => {
    throttleFn.current.fn(callback)
  }, [callback, dependence])
}

export default useThrottleFn
