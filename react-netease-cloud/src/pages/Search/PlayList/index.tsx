// 歌单列表

import React, { FC } from 'react'
import styles from './index.module.scss'

interface IProps {
  list: any[]
}

const PlayList: FC<IProps> = () => {
  return <div className={styles.PlayList}>PlayList</div>
}

PlayList.defaultProps = {}

export default PlayList
