// 歌曲列表

import { PlayCircleOutlined } from '@ant-design/icons'
import Authors from 'components/Authors'
import dayjs from 'dayjs'
import React, { FC, memo } from 'react'
import { connect, DispatchProp } from 'react-redux'
import { RouteConfigComponentProps } from 'react-router-config'
import { withRouter } from 'react-router-dom'
import { change_current_song_info } from 'store/currentSongInfo/actions'
import { start_is_play } from 'store/playBarState/actions'
import { add_song_list_item } from 'store/songList/actions'
import styles from './index.module.scss'

interface IProps {
  list: any[]
}

const SongList: FC<IProps & RouteConfigComponentProps & DispatchProp> = (props) => {
  const { list } = props

  const handlePlay = (item: any) => {
    if (!item?.id) return
    props.dispatch(add_song_list_item(item))
    props.dispatch(change_current_song_info(item))
    props.dispatch(start_is_play())
  }

  const handleClickAlbumName = (id: number) => id && props.history.push(`/discover/album-detail/${id}`)

  const handleClickName = (id: number) => id && props.history.push(`/discover/song/${id}`)

  return (
    <div className={styles.SongList}>
      {list?.map((item, index) => {
        return (
          <div className={`${styles.SongListItem} ${index % 2 ? styles.bg : ''}`} key={index}>
            <div className="play-btn">
              <PlayCircleOutlined title="播放" className="icon" onClick={() => handlePlay(item)} />
            </div>
            <div className="name ellipsis-1" title={item?.name}>
              <span onClick={() => handleClickName(item?.id)}>{item?.name}</span>
            </div>
            <div className="author ellipsis-1">
              <Authors list={item?.ar || []}></Authors>
            </div>
            <div className="album ellipsis-1" title={item?.al?.name}>
              <span onClick={() => handleClickAlbumName(item?.al?.id)}>
                {item?.al?.name ? `《${item?.al?.name}》` : ''}
              </span>
            </div>
            <div className="time">{item?.dt ? dayjs(item?.dt).format('mm:ss') : ''}</div>
          </div>
        )
      })}
    </div>
  )
}

SongList.defaultProps = {}

export default connect()(withRouter(memo(SongList)))
