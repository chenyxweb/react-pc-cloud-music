// 发现音乐 - 推荐 - 榜单

import { FolderAddOutlined, PlayCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { message } from 'antd'
import React, { FC, memo, useEffect, useState } from 'react'
import LazyLoad from 'react-lazyload'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { Dispatch } from 'redux'
import http from 'service/http'
import { ICombineState } from 'store'
import { change_current_song_info } from 'store/currentSongInfo/actions'
import { change_is_play } from 'store/playBarState/actions'
import { add_song_list_item, replace_song_list } from 'store/songList/actions'
import constants from 'utils/constants'

import styles from './index.module.scss'

interface IProps extends RouteComponentProps {
  dispatch: Dispatch
}

const RecTopList: FC<IProps & ICombineState> = props => {
  const [list1, setList1] = useState<any>({}) // 飙升榜
  const [list2, setList2] = useState<any>({}) // 新歌榜
  const [list3, setList3] = useState<any>({}) // 热歌榜

  const { songList, currentSongInfo, playBarState } = props

  const { isPlay } = playBarState

  // 获取飙升榜
  useEffect(() => {
    http
      .getPlaylistDetail({ id: constants.topListIds.S })
      .then(res => {
        if (res.data.code === 200) {
          setList1(res.data.playlist || [])
        }
      })
      .catch(() => {})
  }, [])

  // 获取新歌榜
  useEffect(() => {
    http
      .getPlaylistDetail({ id: constants.topListIds.N })
      .then(res => {
        if (res.data.code === 200) {
          setList2(res.data.playlist || [])
        }
      })
      .catch(() => {})
  }, [])

  // 获取热歌榜
  useEffect(() => {
    http
      .getPlaylistDetail({ id: constants.topListIds.H })
      .then(res => {
        if (res.data.code === 200) {
          setList3(res.data.playlist || [])
        }
      })
      .catch(() => {})
  }, [])

  // 跳转到排行榜页面
  const ToTopList = (id?: number) =>
    props.history.push(id ? `/discover/toplist/${id}` : `/discover/toplist/${constants.topListIds.S}`)

  // 添加歌曲到播放列表
  const addToSongList = (item: any, event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    event.stopPropagation()
    // 没有就添加
    if (songList.findIndex(i => i.id === item.id) === -1) {
      props.dispatch(add_song_list_item(item))
      message.success('添加成功')
    } else {
      message.warn('请勿重复添加')
    }
  }

  // 播放当前歌曲
  const playCurrentSong = (item: any, event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    event.stopPropagation()
    // console.log(item)
    const audioElement = document.getElementById('audio') as HTMLAudioElement

    if (songList.findIndex(i => i.id === item.id) === -1) {
      // 如果没有当前点击的歌曲

      // 1. 添加歌曲到列表
      props.dispatch(add_song_list_item(item))
      // 2. 设置当前播放歌曲
      props.dispatch(change_current_song_info(item))
      // 3. 重新播放
      if (!isPlay) props.dispatch(change_is_play())
    } else {
      // 如果有当前播放的歌曲,设置当前播放歌曲,  重新播放歌曲
      props.dispatch(change_current_song_info(item))
      audioElement.currentTime = 0
      if (!isPlay) props.dispatch(change_is_play())
    }
  }

  /**
   * 点击播放榜单
   * @param list 榜单歌曲列表
   * @param name 榜单名
   */
  const handleClickPlayTopList = (list: any[], name: string) => {
    const audioElement = document.getElementById('audio') as HTMLAudioElement

    if (list.length) {
      // 拿到榜单数据, 修改 store中的songList
      props.dispatch(replace_song_list(list))

      // 将歌曲切换到当前列表的第一项, 并播放
      const firstItem = list[0]
      props.dispatch(change_current_song_info(firstItem))

      audioElement.currentTime = 0 // 设置播放时间

      // 重新播放
      if (!isPlay) props.dispatch(change_is_play())

      message.success(`开始播放 ${name}`)
    }
  }

  // 点击歌曲
  const handleSongClick = (id: number) => {
    console.log(id)
    id && props.history.push(`/discover/song?id=${id}`)
  }

  // 渲染列表
  const renderList = (list: any) => {
    return (
      <div className={styles.up}>
        {/* logo */}
        <div className='logo'>
          <LazyLoad height={80}>
            <img
              src={list.coverImgUrl + '?param=100y100'}
              alt=''
              title={list.name}
              onClick={() => ToTopList(list.id)}
            />
          </LazyLoad>
          <div className='text'>
            <div className='name' onClick={() => ToTopList(list.id)}>
              {list.name}
            </div>
            <div className='btns'>
              <PlayCircleOutlined
                title='播放榜单'
                className='icon'
                onClick={() => handleClickPlayTopList(list?.tracks || [], list?.name)}
              />
              <FolderAddOutlined title='收藏' className='icon' onClick={() => message.info('暂无收藏功能')} />
            </div>
          </div>
        </div>
        {/* list */}
        <div className='list'>
          {list.tracks?.slice(0, 10).map((item: any, index: number) => {
            return (
              <div className='list-item' key={item.id}>
                <div className={`list-item-num ${index <= 2 ? 'red' : ''}`}>{index + 1}</div>
                <div className='list-item-name ellipsis-1' onClick={() => handleSongClick(item.id)}>
                  {item.name}
                </div>
                <div className='list-item-btns'>
                  <PlayCircleOutlined title='播放' className='icon' onClick={e => playCurrentSong(item, e)} />
                  <PlusOutlined title='添加到播放列表' className='icon' onClick={e => addToSongList(item, e)} />
                  <FolderAddOutlined title='收藏' className='icon' onClick={() => message.info('暂无收藏功能')} />
                </div>
              </div>
            )
          })}
          <div className='list-item'>
            <span className='look-all' onClick={() => ToTopList(list.id)}>
              查看全部{' >'}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.RecTopList}>
      {/* title */}
      <div className={styles.title}>
        <div className={styles.left}>
          <div className='key' onClick={() => ToTopList()}>
            榜单
          </div>
        </div>
        <div className={styles.right} onClick={() => ToTopList()}>
          更多
        </div>
      </div>
      {/* 榜单 */}
      <div className={styles.toplist}>
        {/* 飙升榜 1 */}
        {renderList(list1)}

        {/* 新歌榜 2 */}
        {renderList(list2)}

        {/* 热歌榜 3 */}
        {renderList(list3)}
      </div>
    </div>
  )
}

RecTopList.defaultProps = {}

// 映射store
const mapStateToProps = (state: ICombineState) => {
  return {
    songList: state.songList,
    currentSongInfo: state.currentSongInfo,
    playBarState: state.playBarState,
  }
}

// dispatch 自动映射
export default memo(connect(mapStateToProps)(withRouter(RecTopList)))
