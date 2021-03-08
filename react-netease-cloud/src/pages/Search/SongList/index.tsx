// 歌曲列表

import { FC, memo } from 'react'
import SongInfoItem from 'components/SongInfoItem'

import styles from './index.module.scss'

interface IProps {
  list: any[]
}

const SongList: FC<IProps> = (props) => {
  const { list } = props

  return (
    <div className={styles.SongList}>
      {list?.map((item, index) => {
        return (
          <div className={`${styles.SongListItem} ${index % 2 ? styles.bg : ''}`} key={index}>
            <SongInfoItem item={item}></SongInfoItem>
          </div>
        )
      })}
    </div>
  )
}

SongList.defaultProps = {}

export default memo(SongList)
