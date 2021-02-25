// 发现音乐 - 排行榜
import { FieldTimeOutlined, PlayCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Spin } from 'antd'
import dayjs from 'dayjs'
import React, { FC, memo, useCallback, useEffect, useState } from 'react'
import LazyLoad from 'react-lazyload'
import { connect, DispatchProp } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import http from 'service/http'
import { change_current_song_info } from 'store/currentSongInfo/actions'
import { start_is_play } from 'store/playBarState/actions'
import { add_song_list_item, replace_song_list } from 'store/songList/actions'
import constants from 'utils/constants'

import styles from './index.module.scss'

// 占位
const listInit = Array(4)
  .fill({})
  .map((_, index) => ({ id: index }))

interface IProps {}

const Toplist: FC<IProps & RouteComponentProps<{ id: string }> & DispatchProp> = (props) => {
  // console.log(props)
  const { match, history } = props
  const [list1, setList1] = useState<any[]>(listInit) // 云音乐特色榜
  const [list2, setList2] = useState<any[]>(listInit) // 全球媒体榜
  const [playlist, setPlaylist] = useState<any>() // 歌单信息
  const [spinning, setSpinning] = useState(false)

  // 获取排行榜
  useEffect(() => {
    http
      .getTopList()
      .then((res) => {
        // console.log(res)
        if (res.data.code === 200) {
          const list = res.data.list || []
          const ToplistType = ['S', 'N', 'O', 'H'] // 云音乐特色榜
          const list1: any[] = []
          const list2: any[] = []

          list.forEach((item: any) => {
            if (ToplistType.includes(item.ToplistType)) {
              list1.push(item)
            } else {
              list2.push(item)
            }
          })

          setList1(list1)
          setList2(list2)
        }
      })
      .catch(() => {})
  }, [])

  // 获取歌单详情
  useEffect(() => {
    const id = match.params?.id
    if (!id) return

    setSpinning(true)
    http
      .getPlaylistDetail({ id: Number(id) })
      .then((res) => {
        setSpinning(false)

        // console.log(res)
        if (res.data.code === 200) {
          const { playlist } = res.data
          setPlaylist(playlist || {})
        }
      })
      .catch(() => {})
  }, [match.params?.id])

  // 点击item
  const handleClickItem = (id: string) => {
    id && history.push(`/discover/toplist/${id}`)
  }

  // 播放歌曲
  const handlePlay = useCallback(
    (item: any) => {
      props.dispatch(add_song_list_item(item))
      props.dispatch(change_current_song_info(item))
    },
    [props]
  )

  // 添加歌曲
  const handleAdd = useCallback(
    (item: any) => {
      props.dispatch(add_song_list_item(item))
    },
    [props]
  )

  // renderList
  const renderList = (list: any[]) => {
    return list.map((item) => {
      return (
        <div
          className={`list-item ${Number(match.params?.id) === item?.id ? 'active' : ''}`}
          key={item.id}
          onClick={() => handleClickItem(item.id)}
        >
          <LazyLoad height={40} overflow>
            <img className="list-item-img" src={item.coverImgUrl + '?param=40y40'} alt="" title={item.description} />
          </LazyLoad>
          <div className="list-item-desc">
            <p className="list-item-desc-t ellipsis-1">{item.name}</p>
            <p className="list-item-desc-b ellipsis-1">{item.updateFrequency}</p>
          </div>
        </div>
      )
    })
  }

  // 渲染歌曲列表
  const renderTipList = useCallback(
    (list: any[]) => {
      return list.map((item: any, index: any) => {
        return (
          <div
            key={item.id}
            className={[styles.topListItem, index <= 2 ? styles.top : '', index % 2 ? styles.dark : ''].join(' ')}
          >
            <div className={styles.rank}>{index + 1}</div>
            <div className={styles.title}>
              {index <= 2 ? <img src={item?.al?.picUrl + '?param=50y50'} alt="" /> : null}
              <PlayCircleOutlined title="播放当前歌曲" className="icon" onClick={() => handlePlay(item)} />
              <span className="song-name ellipsis-1">{item?.name}</span>
              <PlusOutlined title="添加到歌单" className="plus-icon" onClick={() => handleAdd(item)}></PlusOutlined>
            </div>
            <div className={styles.time}>{item?.dt ? dayjs(item?.dt).format('mm:ss') : ''}</div>
            <div className={[styles.author, 'ellipsis-1'].join(' ')}>{item?.ar?.[0]?.name || ''}</div>
          </div>
        )
      })
    },
    [handleAdd, handlePlay]
  )

  // 播放榜单
  const playTopList = () => {
    const list = playlist?.tracks || []
    console.log(list)
    if (list?.length) {
      // 切换歌曲列表
      props.dispatch(replace_song_list(list))

      // 修改当前播放歌曲
      props.dispatch(change_current_song_info(list[0]))

      // 开始播放
      props.dispatch(start_is_play())
    }
  }

  return (
    <div className={[styles.Toplist, 'w980'].join(' ')}>
      <div className={styles.ToplistList}>
        {/* 云音乐特色榜 */}
        <h3>云音乐特色榜</h3>
        <div className="list1">{renderList(list1)}</div>

        {/* 全球媒体榜 */}
        <h3>全球媒体榜</h3>
        <div className="list2">{renderList(list2)}</div>
      </div>
      <div className={styles.ToplistContent}>
        {/* 歌单信息展示 */}
        <div className={styles.topListInfo}>
          <img
            className="logo"
            src={playlist?.coverImgUrl ? `${playlist?.coverImgUrl}?param=158y158` : constants.bg_placeholder_img}
            alt=""
          />
          <div className="content">
            <h1>{playlist?.name}</h1>
            <p>
              <FieldTimeOutlined /> 最近更新：
              {playlist?.updateTime ? dayjs(playlist?.updateTime).format('MM月DD日') : ''}
            </p>
            <div className="btns">
              <Button className="btn" type="primary" onClick={playTopList}>
                <PlayCircleOutlined />
                播放榜单
              </Button>
              {/* <Button className='btn' type='primary'>
                <PlusOutlined />
                添加到播放列表
              </Button> */}
              <Button className="btn" disabled>
                收藏
              </Button>
            </div>
          </div>
        </div>

        {/* 歌单列表展示 */}
        <div className={styles.topListWrapper}>
          <div className={styles.topListTitle}>
            <h3>歌曲列表</h3>
            <span className="songCount">{playlist?.tracks?.length}首歌</span>
            <div className="playCount">
              播放：<strong style={{ color: '#c20c0c' }}>{playlist?.playCount}</strong>次
            </div>
          </div>

          <Spin spinning={spinning}>
            <div className={styles.topListItemWrapper}>
              {/* 排名 标题 时长 歌手 */}
              <div className={[styles.topListItem, 'list-title'].join(' ')}>
                <div className={styles.rank}></div>
                <div className={styles.title}>标题</div>
                <div className={styles.time}>时长</div>
                <div className={styles.author}>歌手</div>
              </div>
              {/* list */}
              {renderTipList(playlist?.tracks || [])}
            </div>
          </Spin>
        </div>
      </div>
    </div>
  )
}

export default connect()(memo(Toplist))
