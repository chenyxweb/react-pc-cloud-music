// 测试页面
import React, { FC } from 'react'
import styles from './index.module.scss'

interface IProps {}

const Test: FC<IProps> = () => {
  return <div className={styles.Test}>test</div>
}

Test.defaultProps = {}

export default Test
