// user - 主页
import { PlayCircleOutlined } from '@ant-design/icons'
import { Select } from 'antd'
import PlayListItem from 'components/PlayListItem'
import React, { FC, memo, useCallback, useEffect, useState } from 'react'
import { RouteConfigComponentProps } from 'react-router-config'
import http from 'service/http'
import styles from './index.module.scss'

interface IProps {}

const UserHome: FC<IProps & RouteConfigComponentProps<{ userId: string }>> = props => {
  const [hasMore, setHasMore] = useState(true) // 是否有更多分页数据
  const [createList, setCreateList] = useState<any[]>([]) // 创建的歌单
  const [collectList, setCollectList] = useState<any[]>([]) // 收藏的歌单
  const [recordType, setRecordType] = useState<1 | 0>(1) // 1 最近一周, 0 所有时间
  const [recordList, setRecordList] = useState<any[]>([]) // 播放记录列表

  // console.log(props)

  // 获取用户歌单
  useEffect(() => {
    const uid = Number(props.match.params?.userId)
    if (!uid) return

    http
      .getUserSongList({ uid, limit: 100 })
      .then(res => {
        if (res.data.code === 200) {
          const { more, playlist } = res.data || {}
          setHasMore(more ?? true)

          const createList: any[] = []
          const collectList: any[] = []
          if (playlist?.length) {
            // 如果歌单的创建者id和自己的相等 --> 则为自己创建的歌单
            playlist.forEach((item: any) => {
              if (item?.creator?.userId === uid) {
                createList.push(item)
              } else {
                collectList.push(item)
              }
            })
          }

          setCreateList(createList)
          console.log('createList: ', createList)
          setCollectList(collectList)
          console.log('collectList: ', collectList)
        }
      })
      .catch(() => {})
  }, [props.match.params?.userId])

  // 获取用户 播放记录
  useEffect(() => {
    const uid = Number(props.match.params?.userId)
    if (!uid) return

    http.getUserRecord({ uid, type: recordType }).then(res => {
      console.log(res)
      if (res.data.code === 200) {
        const { weekData, allData } = res.data || {}
        const list = recordType === 1 ? weekData : allData
        setRecordList(list?.slice(0, 10) || [])
      }
    })
  }, [props.match.params?.userId, recordType])

  // 渲染歌单
  const renderPlayList = useCallback((list: any[]) => {
    return (
      <div className={styles.playlist}>
        <div className={styles.playlistTitle}>我创建的歌单（{list.length}）</div>
        <div className={styles.playlistContent}>
          {list.map(item => {
            return (
              <div className={styles.itemWrapper} key={item.id}>
                <PlayListItem item={item}></PlayListItem>
              </div>
            )
          })}
        </div>
      </div>
    )
  }, [])

  // 渲染听歌排行
  const renderRecordList = useCallback(
    (list: any[]) => {
      return (
        <div className={styles.recordList}>
          <div className={styles.recordListTitle}>
            <span className='text'>听歌排行</span>
            <Select value={recordType} bordered={false} onChange={value => setRecordType(value)}>
              <Select.Option value={1}>最近一周</Select.Option>
              <Select.Option value={0}>所有时间</Select.Option>
            </Select>
          </div>
          <div className={styles.recordListWrapper}>
            <div className={styles.recordListItem}>
              {/* 排名序号 */}
              <div className={styles.rank}>1. </div>

              {/* 播放按钮 */}
              <PlayCircleOutlined className={styles.playBtn} style={{ marginLeft: 15 }} />

              {/* 歌曲信息 */}
              <div className={styles.songInfo}>
                <strong className={styles.songName}>爱情废材</strong>
                <span> - </span>
                <span className={styles.author}>
                  周杰伦
                </span>
              </div>

              {/* 播放次数 */}
              <div className={styles.count}>
                83次
                {/* 蓝条 */}
                <div className={styles.blueBar} style={{ width: '80%' }}></div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    [recordType]
  )

  // console.log(props)
  return (
    <div className={styles.UserHome}>
      {/* 听歌排行 */}
      {renderRecordList(recordList)}

      {/* 我创建的歌单 */}
      {renderPlayList(createList)}

      {/* 我收藏的歌单 */}
      {renderPlayList(collectList)}
    </div>
  )
}

UserHome.defaultProps = {}

export default memo(UserHome)
