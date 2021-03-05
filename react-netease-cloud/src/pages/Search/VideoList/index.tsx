// 视频列表

import { VideoCameraOutlined } from '@ant-design/icons'
import Authors from 'components/Authors'
import dayjs from 'dayjs'
import React, { FC, Fragment, memo } from 'react'
import { RouteConfigComponentProps } from 'react-router-config'
import { withRouter } from 'react-router-dom'
import utils from 'utils/utils'
import styles from './index.module.scss'

interface IProps {
  list: any[]
}

const VideoList: FC<IProps & RouteConfigComponentProps> = (props) => {
  const { list } = props
  console.log(props)

  // 去mv页面
  const handleClickImg = (vid: string) => {
    vid && props.history.push(`/mv/${vid}`)
  }

  return (
    <div className={styles.VideoList}>
      {list?.map((item, index) => {
        return (
          <div className={styles.VideoListItemWrapper} key={index}>
            <div className={styles.VideoListItem}>
              <div className="img-wrapper" onClick={() => handleClickImg(item.vid)}>
                <img className="img" src={item?.coverUrl + '?param=159y90'} alt="" />
                <div className="count">
                  <VideoCameraOutlined /> {utils.formatTenThousand(item.playTime)}
                </div>
                <div className="time">{item?.durationms ? dayjs(item?.durationms).format('mm:ss') : ''} </div>
              </div>
              <div className="name">
                <div className="mv">MV</div>
                <p className="title ellipsis-1">{item?.title}</p>
              </div>
              <div className="author ellipsis-1">
                <Authors list={item?.creator}></Authors>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

VideoList.defaultProps = {}

export default withRouter(memo(VideoList))
