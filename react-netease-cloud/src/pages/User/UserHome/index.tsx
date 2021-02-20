// user - 主页
import PlayListItem from 'components/PlayListItem'
import React, { FC, memo, useEffect, useState } from 'react'
import { RouteConfigComponentProps } from 'react-router-config'
import http from 'service/http'
import styles from './index.module.scss'

interface IProps {}

const UserHome: FC<IProps & RouteConfigComponentProps<{ userId: string }>> = props => {
  const [hasMore, setHasMore] = useState(true) // 是否有更多分页数据
  const [createList, setCreateList] = useState<any[]>([]) // 创建的歌单
  const [collectList, setCollectList] = useState<any[]>([]) // 收藏的歌单

  // console.log(props)

  // 获取用户歌单
  useEffect(() => {
    const uid = props.match.params?.userId
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
              if (item?.creator?.userId === Number(uid)) {
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

  // console.log(props)
  return (
    <div className={styles.UserHome}>
      {/* 听歌排行 */}
      {/* 我创建的歌单 */}
      <div className={styles.playlist}>
        <div className={styles.playlistTitle}>我创建的歌单（{createList.length}）</div>
        <div className={styles.playlistContent}>
          {createList.map(item => {
            return (
              <div className={styles.itemWrapper} key={item.id}>
                <PlayListItem item={item}></PlayListItem>
              </div>
            )
          })}
        </div>
      </div>
      {/* 我收藏的歌单 */}
      <div className={styles.playlist}>
        <div className={styles.playlistTitle}>我收藏的歌单（{collectList.length}）</div>
        <div className={styles.playlistContent}>
          {collectList.map(item => {
            return (
              <div className={styles.itemWrapper} key={item.id}>
                <PlayListItem item={item}></PlayListItem>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

UserHome.defaultProps = {}

export default memo(UserHome)
