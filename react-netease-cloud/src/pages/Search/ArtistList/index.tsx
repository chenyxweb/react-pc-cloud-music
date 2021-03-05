// 歌手列表
import React, { FC } from 'react'
import styles from './index.module.scss'

interface IProps {
  list: any[]
}

const ArtistList: FC<IProps> = () => {
  return <div className={styles.ArtistList}>ArtistList</div>
}

ArtistList.defaultProps = {}

export default ArtistList
