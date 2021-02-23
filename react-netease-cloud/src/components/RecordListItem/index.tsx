// 听歌排行item

import { PlayCircleOutlined, PlusOutlined } from '@ant-design/icons'
import React, { CSSProperties, FC, memo } from 'react'
import { connect, DispatchProp } from 'react-redux'
import { RouteConfigComponentProps } from 'react-router-config'
import { withRouter } from 'react-router-dom'
import { change_current_song_info } from 'store/currentSongInfo/actions'
import { start_is_play } from 'store/playBarState/actions'
import { add_song_list_item } from 'store/songList/actions'
import styles from './index.module.scss'

interface IProps {
  item: any // 歌曲信息
  index: number // 排名
  /** wrapper 样式 */
  style?: CSSProperties
}

const RecordListItem: FC<IProps & DispatchProp & RouteConfigComponentProps> = props => {
  const { style, item, index, history } = props

  // 点击播放按钮
  const handleClickPlayBtn = () => {
    if (item?.song) {
      // 添加歌曲到播放列表
      props.dispatch(add_song_list_item(item.song))

      // 修改当前播放歌曲信息
      props.dispatch(change_current_song_info(item.song))

      // 将播放状态修改 成 play
      props.dispatch(start_is_play())
    }
  }

  // 点击添加按钮
  const handleClickPlusBtn = () => {
    if (item?.song) {
      // 添加歌曲到播放列表
      props.dispatch(add_song_list_item(item.song))
    }
  }

  // 点击歌名
  const handleClickSongName = (item: any) => {
    // /discover/song?id=1810021934
    const songId = item?.song?.id
    songId && history.push(`/discover/song?id=${songId}`)
  }

  // 点击歌手
  const handleClickAuthor = (item: any) => {
    // /discover/artist?id=7395
    const authorId = item?.song?.ar[0]?.id
    authorId && history.push(`/discover/artist?id=${authorId}`)
  }

  return (
    <div className={styles.RecordListItem} style={style}>
      {/* 排名序号 */}
      <div className={styles.rank}>{index}. </div>

      {/* 播放按钮 */}
      <PlayCircleOutlined
        title='播放当前歌曲'
        className={styles.playBtn}
        style={{ marginLeft: 15 }}
        onClick={handleClickPlayBtn}
      />

      {/* 歌曲信息 */}
      <div className={styles.songInfo}>
        <strong className={styles.songName} onClick={() => handleClickSongName(item)}>
          {item?.song?.name}
        </strong>
        <span> - </span>
        <span onClick={() => handleClickAuthor(item)} className={styles.author}>
          {item?.song?.ar?.[0]?.name}
        </span>

        {/* 添加到播放列表按钮 */}
        <PlusOutlined
          title='添加歌曲到歌单'
          className={[styles.playBtn, styles.plusBtn].join(' ')}
          style={{ marginLeft: 15 }}
          onClick={handleClickPlusBtn}
        />
      </div>

      {/* 播放次数 */}
      <div className={styles.count}>
        <span>{item?.playCount}次</span>
        <div className={styles.blueBar} style={{ width: item?.score + '%' }}></div>
      </div>
    </div>
  )
}

RecordListItem.defaultProps = {}

export default connect()(memo(withRouter(RecordListItem)))
