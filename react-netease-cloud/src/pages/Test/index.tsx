// 测试页面
import { Button } from 'antd'
import React, { FC } from 'react'
import { debounce } from 'lodash-es'

interface IProps {}

const Test: FC<IProps> = () => {
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
    </div>
  )
}

Test.defaultProps = {}

export default Test
