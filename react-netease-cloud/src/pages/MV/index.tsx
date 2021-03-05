// MV页
import React, { FC, memo, useEffect, useState } from 'react'
import { RouteConfigComponentProps } from 'react-router-config'
import { withRouter } from 'react-router-dom'
import http from 'service/http'
import styles from './index.module.scss'

interface IProps {}

const MV: FC<IProps & RouteConfigComponentProps<{ id: string }>> = (props) => {
  const id = props.match.params.id // mv id

  // state
  const [mvDetail, setMvDetail] = useState<any>({}) // mv详情
  const [mvUrlInfo, setMvUrlInfo] = useState<any>({}) // mv详情

  console.log('mvDetail: ', mvDetail)
  console.log('mvUrlInfo: ', mvUrlInfo)

  useEffect(() => {
    if (!id) return

    // 获取mv详情
    http.videoApi
      .getMVDetail(id)
      .then((res) => {
        if (res.data.code === 200) {
          setMvDetail(res.data?.data || {})
        }
      })
      .catch(() => {})
  }, [id])

  useEffect(() => {
    if (!id) return

    // 获取mv url
    http.videoApi
      .getMVUrl({ id })
      .then((res) => {
        if (res.data.code === 200) {
          setMvUrlInfo(res.data?.data || {})
        }
      })
      .catch(() => {})
  }, [id])

  return (
    <div className={`${styles.MV} w980`}>
      {/* 左 */}
      <div className={styles.left}>
        <div className="mv">
          <div className="mv-title">
            <div className="mv-icon">MV</div>
            <div className="mv-name ellipsis-1">{mvDetail?.name}</div>
            <div className="mv-author">{mvDetail?.artistName}</div>
          </div>
          <div className="mv-video-wrapper">
            <video className="mv-video" autoPlay controls src={mvUrlInfo?.url}></video>
          </div>
        </div>
      </div>
      {/* 右 */}
    </div>
  )
}

MV.defaultProps = {}

export default withRouter(memo(MV))
