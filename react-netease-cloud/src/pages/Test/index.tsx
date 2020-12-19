// 测试页面
import { Button, Input } from 'antd'
import React, { FC, useState } from 'react'
import { debounce } from 'lodash-es'

interface IProps {}

const Test: FC<IProps> = () => {
  const [input, setInput] = useState('')

  const log = () => {
    console.log('哈哈哈')
  }

  const handleClick = debounce(log, 1000)

  return (
    <div>
      Test
      <Button type='primary' onClick={handleClick}>
        click
      </Button>
      <Input value={input} onChange={event => setInput(event.target.value)}></Input>
    </div>
  )
}

Test.defaultProps = {}

export default Test
