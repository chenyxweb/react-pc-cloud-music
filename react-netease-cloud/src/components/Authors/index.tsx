// 作者们 span

import React, { FC, Fragment, memo } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import styles from './index.module.scss'

interface IProps {
  list: any[]
}

const Authors: FC<IProps & RouteComponentProps> = (props) => {
  const { list } = props
  // console.log('list: ', list)

  // 去歌手页面
  const go2Author = (userId: number) => {
    userId && props.history.push(`/discover/artist-detail/${userId}`)
  }

  return (
    <>
      {list?.map((item: any, index: number) => {
        const name = item?.userName || item?.name
        const id = item?.userId || item?.id
        return (
          <Fragment key={index}>
            <span title={name} className={styles.Authors} onClick={() => go2Author(id)} key={index}>
              {name}
            </span>
            <span>{index <= list?.length - 2 ? ' / ' : ''}</span>
          </Fragment>
        )
      })}
    </>
  )
}

Authors.defaultProps = {}

export default withRouter(memo(Authors))
