// 歌词列表

import LyricItem from 'components/LyricItem'
import React, { FC, memo } from 'react'
import styles from './index.module.scss'

interface IProps {
  list: any[]
}

const LyricList: FC<IProps> = (props) => {
  const { list } = props
  console.log('list: ', list)

  return (
    <div className={styles.LyricList}>
      {list?.map((item, index) => {
        return (
          <div className={styles.LyricListItemWrapper} key={index}>
            <LyricItem songInfo={item} titleStyle={{ backgroundColor: '#f7f7f7' }} />
          </div>
        )
      })}
    </div>
  )
}

LyricList.defaultProps = {}

export default memo(LyricList)
