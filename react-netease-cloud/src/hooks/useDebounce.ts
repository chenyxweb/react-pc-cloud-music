// 防抖hook

import { debounce } from 'lodash-es'
import { useCallback, useEffect, useState } from 'react'

interface DebounceSettings {

  // 防抖开始运行
  leading?: boolean

  maxWait?: number

  // 防抖结束运行
  trailing?: boolean
}

const useDebounce = (value: string, delay: number, options?: DebounceSettings | undefined) => {
  const [debounceValue, setDebounceValue] = useState(value)

  const debounceFn = useCallback(
    debounce(
      (value: string) => {
        setDebounceValue(value)
      },
      delay,
      options
    ),
    [delay]
  )

  useEffect(() => {
    debounceFn(value)
  }, [value, debounceFn])

  return [debounceValue]
}

export default useDebounce

// //  方法二: 定时器写法
// import { useEffect, useState } from 'react'

// /**
//  * @param value input框的值
//  * @param delay 延时 ms
//  */
// const useDebounce = (value: string, delay: number) => {
//   const [debounceInputValue, setDebounceInputValue] = useState(value)

//   // 当value改变时 触发useEffect
//   useEffect(() => {
//     let timeId = setTimeout(() => {
//       // 如果delay延时消失之后还没有输入操作的话,修改string
//       setDebounceInputValue(value)
//     }, delay)

//     // 每一次重新执行useEffect 都会调用return内的函数
//     return () => {
//       // 如果delay时间隔时间内,有重新输入操作, 重置上一次设置的定时器
//       clearTimeout(timeId)
//     }
//   }, [delay, value])

//   // 返回debounce后的input框的值
//   return [debounceInputValue]
// }

// export default useDebounce
