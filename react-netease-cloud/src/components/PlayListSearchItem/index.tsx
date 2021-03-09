// 搜索页 歌单项

import React, { CSSProperties, FC, memo } from 'react'
import { PlayCircleOutlined } from '@ant-design/icons'
import styles from './index.module.scss'
import { RouteComponentProps, withRouter } from 'react-router'
import { connect, DispatchProp } from 'react-redux'
import { replace_song_list_async } from 'store/songList/actions'
import { start_is_play } from 'store/playBarState/actions'

export interface IPlayListItem {
  id: number
  /** 封面 */
  coverImgUrl: string
  name: string
  /** 歌曲数量 */
  trackCount: number
  /** 创建者 */
  creator: { userId: number; nickname: string; userType: number }
  userId: number
  description: string
  /** 播放次数 */
  playCount: number
  /** 收藏 */
  bookCount: number
}

interface IProps {
  item: IPlayListItem
  style?: CSSProperties
}

const PlayListSearchItem: FC<IProps & RouteComponentProps & DispatchProp> = (props) => {
  const { item, style } = props
  const { id, name, description, coverImgUrl, trackCount, playCount, bookCount, creator } = item || {}

  // 播放歌单
  const play = (id: number) => {
    id &&
      props.dispatch(
        replace_song_list_async(id, () => {
          props.dispatch(start_is_play())
        })
      )
  }

  // 去歌单详情页
  const go2PlayListDetail = (id: number) => {
    id && props.history.push(`/discover/playlist-detail/${id}`)
  }

  // 去用户页
  const go2UserHome = (userId: number) => {
    userId && props.history.push(`/user/home/${userId}`)
  }

  return (
    <div style={style} className={styles.PlayListSearchItem}>
      <PlayCircleOutlined title="播放歌单" className="play-icon" onClick={() => play(id)} />
      <div className="img">
        <img title={description} src={coverImgUrl + '?param=50y50'} alt="" onClick={() => go2PlayListDetail(id)} />
      </div>
      <div className="name">
        <span onClick={() => go2PlayListDetail(id)}>{name}</span>
      </div>
      <div className="trackCount">
        <span>{trackCount}首</span>
      </div>
      <div className="creator">
        <span onClick={() => go2UserHome(creator?.userId)}>by {creator.nickname}</span>
      </div>
      <div className="book">
        <span>收藏：{bookCount}</span>
      </div>
      <div className="play">
        <span>收听：{playCount}</span>
      </div>
    </div>
  )
}

PlayListSearchItem.defaultProps = {}

export default connect()(withRouter(memo(PlayListSearchItem)))
