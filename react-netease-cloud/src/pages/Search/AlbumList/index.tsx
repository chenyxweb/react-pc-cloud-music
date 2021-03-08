// 专辑列表
import DiskItem from 'components/DiskItem'
import React, { FC } from 'react'
import styles from './index.module.scss'

interface IProps {
  list: any[]
}

const AlbumList: FC<IProps> = (props) => {
  const { list } = props
  return (
    <div className={styles.AlbumList}>
      {list?.map((item, index) => {
        return (
          <div className={styles.AlbumListWrapper} key={index}>
            <DiskItem item={item} size="middle"></DiskItem>
          </div>
        )
      })}
    </div>
  )
}

AlbumList.defaultProps = {}

export default AlbumList
