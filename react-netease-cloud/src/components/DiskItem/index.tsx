// 专辑碟片

import { PlayCircleOutlined } from '@ant-design/icons'
import React, { FC, memo } from 'react'
import LazyLoad from 'react-lazyload'
import { connect, DispatchProp } from 'react-redux'
import { RouteConfigComponentProps } from 'react-router-config'
import { withRouter } from 'react-router-dom'
import http from 'service/http'
import { change_current_song_info } from 'store/currentSongInfo/actions'
import { start_is_play } from 'store/playBarState/actions'
import { replace_song_list } from 'store/songList/actions'
import styles from './index.module.scss'

interface IProps {
  item: { [key: string]: any }
  size: 'small' | 'middle' | 'large' // 100px | 130px | 177px
  showText?: boolean
}

const sizeMap = {
  small: 100,
  middle: 130,
  large: 177,
}

const DiskItem: FC<IProps & DispatchProp & RouteConfigComponentProps> = (props) => {
  const { item, size, showText } = props

  // 去专辑详情页
  const toAlbumDetail = (id: number) => props.history.push(`/discover/album-detail/${id}`)

  // 去歌手详情页
  const toArtistDetail = (id: number) => props.history.push(`/discover/artist-detail/${id}`)

  // playDisk
  const playDisk = () => {
    console.log(item)
    // item.id && props.dispatch(replace_song_list_async(item.id))
    // 获取专辑详情
    if (!item?.id) return
    http.homeApi
      .getAlbumInfo(item.id)
      .then((res) => {
        if (res.data.code === 200) {
          const songs = res.data?.songs || []
          if (!songs?.length) return
          props.dispatch(replace_song_list(songs))
          props.dispatch(change_current_song_info(songs[0]))
          props.dispatch(start_is_play())
        }
      })
      .catch(() => {})
  }

  return (
    <div className={[styles.DiskItem, styles[size]].join(' ')}>
      <div className="img">
        <div className="img-wrapper">
          <LazyLoad height={sizeMap[size]}>
            <img
              src={item.picUrl + `?param=${sizeMap[size]}y${sizeMap[size]}`}
              title={item.name}
              alt=""
              onClick={() => toAlbumDetail(item.id)}
            />
          </LazyLoad>
          {/* 播放按钮 */}
          <div className="play-btn-wrapper">
            <PlayCircleOutlined className="play-btn" onClick={playDisk} />
          </div>
        </div>
      </div>
      {showText ? (
        <>
          {/* 歌名 */}
          <p className="song-name ellipsis-1" onClick={() => toAlbumDetail(item.id)}>
            {item.name}
          </p>
          {/* 歌手 */}
          <p className="author">
            <span onClick={() => toArtistDetail(item.artists[0].id)}>{item.artists[0]?.name}</span>{' '}
            {item.artists?.length >= 2 ? '/' : ''}{' '}
            {item.artists[1]?.name ? (
              <span onClick={() => toArtistDetail(item.artists[1].id)}>{item.artists[1].name}</span>
            ) : (
              ''
            )}{' '}
            {item.artists[2]?.name ? '...' : ''}
          </p>
        </>
      ) : null}
    </div>
  )
}

DiskItem.defaultProps = {
  size: 'small',
  showText: true,
}

export default connect()(memo(withRouter(DiskItem)))
