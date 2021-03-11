import React, { FC, useEffect, useState } from 'react'
import styles from './index.module.scss'

interface IProps {}

const Test: FC<IProps> = () => {
  const [list, setList] = useState([1, 2, 3, 4, 5])
  const [count, setCount] = useState(0)

  useEffect(() => {
    const tempList = list
    tempList.push(6)
    setList(tempList) // 此方式存在地址复用,数据改变之后不会触发视图更新
    // setList([...tempList]) // 正确的方式
  }, [])

  return (
    <div className={styles.Test}>
      {list.map((item, index) => {
        return <div key={index}>{item}</div>
      })}
      {/* 更新后的list, 会在下一次更新时被带出来 */}
      <button onClick={() => setCount((preState) => preState + 1)}>{count}</button>
    </div>
  )
}

Test.defaultProps = {}

export default Test
