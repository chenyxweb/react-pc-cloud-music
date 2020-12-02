// 发现音乐 - 推荐
import React, { FC, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import styles from './index.module.scss'
import MyCarousel from './MyCarousel'

interface IProps extends RouteComponentProps {}

const Recommend: FC<IProps> = () => {
  const [count, setCount] = useState(0)

  return (
    <div className={styles.Recommend}>
      {/* 轮播图 */}
      <MyCarousel />

      <div>{count}</div>
      <button onClick={() => setCount(prev => prev + 1)}>+1</button>
    </div>
  )
}

export default Recommend
