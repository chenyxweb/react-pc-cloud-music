// MV 列表
import React, { FC } from 'react'
import styles from './index.module.scss'

interface IProps {
  list: any[]
}

const MVList: FC<IProps> = () => {
  return <div className={styles.MVList}>MVList</div>
}

MVList.defaultProps = {}

export default MVList
