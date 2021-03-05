// 专辑列表
import React, { FC } from 'react'
import styles from './index.module.scss'

interface IProps {
  list: any[]
}

const AlbumList: FC<IProps> = () => {
  return <div className={styles.AlbumList}>AlbumList</div>
}

AlbumList.defaultProps = {}

export default AlbumList
