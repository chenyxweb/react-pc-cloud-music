// 主播电台列表

import React, { FC } from 'react'
import styles from './index.module.scss'

interface IProps {
  list: any[]
}

const DJList: FC<IProps> = () => {
  return <div className={styles.DJList}>DJList</div>
}

DJList.defaultProps = {}

export default DJList
