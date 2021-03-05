// 歌词列表

import React, { FC } from 'react'
import styles from './index.module.scss'

interface IProps {
  list: any[]
}

const LyricList: FC<IProps> = () => {
  return <div className={styles.LyricList}>LyricList</div>
}

LyricList.defaultProps = {}

export default LyricList
