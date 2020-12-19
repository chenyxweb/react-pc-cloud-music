// 使用throttle函数

import { throttle } from 'lodash-es'
import { useEffect, useRef } from 'react'

const useThrottleFn = (dependence: any, delay: number, callback: Function) => {
  const throttleFn = useRef({
    fn: throttle(() => {
      callback && callback()
    }, delay),
  })

  useEffect(() => {
    throttleFn.current.fn()
  }, [dependence])
}

export default useThrottleFn
