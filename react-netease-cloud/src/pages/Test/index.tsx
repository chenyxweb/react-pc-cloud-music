// 测试页面
import React, { FC, useState } from 'react'

interface IProps {}

const Test: FC<IProps> = () => {
  console.log('test')

  const [ts, setTs] = useState<number>()

  return (
    <div>
      Test
      <div>{ts}</div>
      <button
        onClick={() =>
          setTs((preState) => {
            console.log(preState)
            return 111 // 设置相同的数据不会引起reRender
            // return Date.now()
          })
        }
      >
        click
      </button>
    </div>
  )
}

Test.defaultProps = {}

export default Test
