// 歌词项

import React, { CSSProperties, FC, memo, useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import SongInfoItem from 'components/SongInfoItem'
import styles from './index.module.scss'
import { DownOutlined, UpOutlined } from '@ant-design/icons'

export interface ILyricItemSongInfo {
  id: number
  /** 歌名 */
  name: string
  /** mv  */
  mv: number
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
  const [open, setOpen] = useState(false) // 歌词是否展开

  const { songInfo, titleStyle } = props

  // 展开,折叠
  const toggleOpen = () => {
    setOpen((preState) => {
      return !preState
    })
  }

  return (
    <div className={styles.LyricItem}>
      {/* 歌曲信息 */}
      <div className={styles.songInfo} style={titleStyle}>
        <SongInfoItem item={songInfo}></SongInfoItem>
      </div>
      {/* 歌词 */}
      <div className={styles.lyricWrapper}>
        {songInfo?.lyrics?.slice(0, open ? Infinity : 4).map((item, index) => {
          return <p className={styles.lyricsItem} key={index} dangerouslySetInnerHTML={{ __html: item }}></p>
        })}

        {/* 展开折叠按钮 */}
        <div className={styles.openBtn}>
          <span className={styles.span} onClick={toggleOpen}>
            {open ? (
              <>
                折叠 <UpOutlined />
              </>
            ) : (
              <>
                展开 <DownOutlined />
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  )
}

LyricItem.defaultProps = {}

export default withRouter(memo(LyricItem))
