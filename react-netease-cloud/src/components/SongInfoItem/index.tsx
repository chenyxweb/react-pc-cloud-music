// 歌曲信息条

import { PlayCircleOutlined, PlusOutlined } from '@ant-design/icons'
import Authors from 'components/Authors'
import React, { FC, memo } from 'react'
import dayjs from 'dayjs'
import { change_current_song_info } from 'store/currentSongInfo/actions'
import { start_is_play } from 'store/playBarState/actions'
import { add_song_list_item } from 'store/songList/actions'
import styles from './index.module.scss'
import { RouteComponentProps, withRouter } from 'react-router'
import { connect, DispatchProp } from 'react-redux'
import { ILyricItemSongInfo } from 'components/LyricItem'

interface IProps {
  /** 歌曲信息 */
  item: ILyricItemSongInfo
}

const SongInfoItem: FC<IProps & RouteComponentProps & DispatchProp> = (props) => {
  const { item } = props

  // 播放
  const handlePlay = (item: any) => {
    if (!item?.id) return
    props.dispatch(add_song_list_item(item))
    props.dispatch(change_current_song_info(item))
    props.dispatch(start_is_play())
  }

  // 添加
  const handleAdd = (item: any) => {
    props.dispatch(add_song_list_item(item))
  }

  // 点击专辑名
  const handleClickAlbumName = (id: number) => id && props.history.push(`/discover/album-detail/${id}`)

  // 点击歌手名
  const handleClickName = (id: number) => id && props.history.push(`/discover/song/${id}`)

  return (
    <div className={styles.SongInfoItem}>
      <div className="play-btn">
        <PlayCircleOutlined title="播放" className="icon" onClick={() => handlePlay(item)} />
      </div>
      <div className="name ellipsis-1" title={item?.name}>
        <span onClick={() => handleClickName(item?.id)}>{item?.name}</span>
        {item?.mv ? <div className="to-mv" onClick={() => props.history.push(`/mv/${item.mv}`)}></div> : null}
        <PlusOutlined title="添加" className="icon-plus" onClick={() => handleAdd(item)} />
      </div>
      <div className="author ellipsis-1">
        <Authors list={item?.ar || []}></Authors>
      </div>
      <div className="album ellipsis-1" title={item?.al?.name}>
        <span onClick={() => handleClickAlbumName(item?.al?.id)}>{item?.al?.name ? `《${item?.al?.name}》` : ''}</span>
      </div>
      <div className="time">{item?.dt ? dayjs(item?.dt).format('mm:ss') : ''}</div>
    </div>
  )
}

SongInfoItem.defaultProps = {}

export default connect()(withRouter(memo(SongInfoItem)))
