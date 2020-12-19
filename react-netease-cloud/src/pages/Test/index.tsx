// 测试页面
import { Input } from 'antd'
import React, { FC, useState } from 'react'
import useThrottleFn from 'hooks/useThrottleFn'

interface IProps {}

const Test: FC<IProps> = () => {
  const [input, setInput] = useState('')
  const [throttleValue, setThrottleValue] = useState('')

  useThrottleFn(input, 2000, () => {
    console.log('throttle', input)
    setThrottleValue(input)
  })

  return (
    <div>
      Test
      <Input value={input} onChange={event => setInput(event.target.value)}></Input>
      <div>{throttleValue}</div>
    </div>
  )
}

Test.defaultProps = {}

export default Test
