// 歌单列表

import PlayListSearchItem from 'components/PlayListSearchItem'
import React, { FC, memo } from 'react'
import styles from './index.module.scss'

interface IProps {
  list: any[]
}

const PlayList: FC<IProps> = (props) => {
  const { list } = props

  return (
    <div className={styles.PlayList}>
      {list?.map((item, index) => {
        return <PlayListSearchItem style={{ backgroundColor: index % 2 ? '#f7f7f7' : '' }} key={index} item={item} />
      })}
    </div>
  )
}

PlayList.defaultProps = {}

export default memo(PlayList)
