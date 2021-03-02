// 测试页面
import React, { FC, useEffect, useRef, useState } from 'react'
import { debounce, throttle } from 'lodash-es'

interface IProps {}

const Test: FC<IProps> = () => {
  const [input, setInput] = useState('')

  const handleThrottle = useRef(
    throttle(() => {
      console.log('throttle', input)
    }, 1000)
  )

  const handleDebounce = useRef(
    debounce((input) => {
      console.log('debounce', input)
    }, 300)
  )

  useEffect(() => {
    if (!input) return
    handleDebounce.current(input)
  }, [input])

  return (
    <div>
      Test
      <input type="text" value={input} onChange={(e) => setInput(e.currentTarget.value)} />
      <button onClick={handleThrottle.current}>throttle</button>
    </div>
  )
}

Test.defaultProps = {}

export default Test
