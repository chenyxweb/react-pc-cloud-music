// 歌词项

import React, { CSSProperties, FC, memo } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import SongInfoItem from 'components/SongInfoItem'
import styles from './index.module.scss'

export interface ILyricItemSongInfo {
  id: number
  /** 歌名 */
  name: string
  /** 歌曲时间 ms */
  dt: number
  /** 歌词数组 */
  lyrics: Array<string>
  /** 专辑信息 */
  al: { id: number; name: string; picUrl: string }
  /** 歌手信息 */
  ar: { id: number; name: string }[]
  /** */
  [key: string]: any
}

interface IProps {
  /** 歌曲信息 */
  songInfo: ILyricItemSongInfo
  /** 标题容器样式 */
  titleStyle?: CSSProperties
}

const LyricItem: FC<IProps & RouteComponentProps> = (props) => {
  const { songInfo, titleStyle } = props

  return (
    <div className={styles.LyricItem}>
      {/* 歌曲信息 */}
      <div className={styles.songInfo} style={titleStyle}>
        <SongInfoItem item={songInfo}></SongInfoItem>
      </div>
      {/* 歌词 */}
      <div className={styles.lyricWrapper}></div>
    </div>
  )
}

LyricItem.defaultProps = {}

export default withRouter(memo(LyricItem))
