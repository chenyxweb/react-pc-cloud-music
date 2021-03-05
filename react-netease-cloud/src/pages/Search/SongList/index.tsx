// 歌词列表
import React, { FC } from 'react'
import styles from './index.module.scss'

interface IProps {
  list: any[]
}

const SongList: FC<IProps> = () => {
  return <div className={styles.SongList}>SongList</div>
}

SongList.defaultProps = {}

export default SongList
