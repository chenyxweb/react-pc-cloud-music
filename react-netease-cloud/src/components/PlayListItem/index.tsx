// 歌单项

import { CustomerServiceOutlined, PlayCircleOutlined } from '@ant-design/icons'
import { message } from 'antd'
import React, { FC, memo } from 'react'
import { RouteConfigComponentProps } from 'react-router-config'
import { withRouter } from 'react-router-dom'
import utils from 'utils/utils'
import styles from './index.module.scss'
import { change_is_play } from 'store/playBarState/actions'
import { replace_song_list_async } from 'store/songList/actions'
import { connect, DispatchProp } from 'react-redux'
import { ICombineState } from 'store'
import constants from 'utils/constants'

interface IProps {
  item: any
}

const PlayListItem: FC<
  IProps & DispatchProp & RouteConfigComponentProps & Pick<ICombineState, 'playBarState'>
> = props => {
  const { item } = props

  /**
   * 点击播放按钮
   * @param id 歌单或榜单id
   */
  const handleClickPlay = (id: number) => {
    // 提交异步的action 修改songList
    props.dispatch(
      replace_song_list_async(id, (list: any[]) => {
        const audio = document.getElementById('audio') as HTMLAudioElement
        if (audio) {
          audio.currentTime = 0 // 设置audio播放时间为0
        }
        // isPlay 为false 就改成true
        const { isPlay } = props.playBarState
        if (!isPlay) props.dispatch(change_is_play())
        message.success('开始播放 热门推荐歌单')
      })
    )
  }

  return (
    <div className={styles.PlayListItem} title={item.name}>
      <div className='img-wrapper'>
        <img
          // ?param=140y140 降低图片分辨率
          src={
            item.picUrl || item.coverImgUrl
              ? (item.picUrl || item.coverImgUrl) + '?param=140y140'
              : constants.bg_placeholder_img
          }
          alt=''
          onClick={() => props.history.push(`/discover/playlist-detail?id=${item.id}`)}
        />

        {/* 定位元素 */}
        <div className='play-bar'>
          <div className='play-num'>
            <CustomerServiceOutlined />
            <span style={{ fontSize: 12, paddingLeft: 4 }}>{utils.formatTenThousand(item.playCount)}</span>
          </div>
          <PlayCircleOutlined className='play' onClick={() => handleClickPlay(item.id)} />
        </div>
      </div>
      <div className='name'>{item.name}</div>
    </div>
  )
}

PlayListItem.defaultProps = {}

const mapStateToProps = (state: ICombineState) => {
  return {
    playBarState: state.playBarState,
  }
}

export default connect(mapStateToProps)(memo(withRouter(PlayListItem)))
