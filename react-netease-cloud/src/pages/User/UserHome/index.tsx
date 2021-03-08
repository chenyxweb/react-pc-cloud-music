// user - 主页
import PlayListItem from 'components/PlayListItem'
import React, { FC, memo, useCallback, useEffect, useState } from 'react'
import { RouteConfigComponentProps } from 'react-router-config'
import http from 'service/http'
import RecordList from '../components/RecordList'
import LazyLoad from 'react-lazyload'
import styles from './index.module.scss'

interface IProps {}

const UserHome: FC<IProps & RouteConfigComponentProps<{ userId: string }>> = (props) => {
  const uid = Number(props.match.params?.userId)

  // const [hasMore, setHasMore] = useState(true) // 是否有更多分页数据
  const [createList, setCreateList] = useState<any[]>([]) // 创建的歌单
  const [collectList, setCollectList] = useState<any[]>([]) // 收藏的歌单
  const [profile, setProfile] = useState<any>() // 用户信息

  // console.log(props)

  // 获取用户信息
  useEffect(() => {
    if (!uid) return
    http.userApi.getUserDetail(uid).then((res) => {
      console.log(res)
      if (res.data.code === 200) {
        const { profile } = res.data || {}
        setProfile(profile || {})
      }
    })
  }, [uid])

  // 获取用户歌单
  useEffect(() => {
    if (!uid) return

    http.userApi
      .getUserSongList({ uid, limit: 1000 })
      .then((res) => {
        if (res.data.code === 200) {
          const { more, playlist } = res.data || {}
          // setHasMore(more ?? true)

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
          setCollectList(collectList)
        }
      })
      .catch(() => {})
  }, [uid])

  // 渲染profile
  const renderProfile = () => {
    return (
      <div className={styles.userProfile}>
        <div className="avatar">
          <img src={profile?.avatarUrl + '?param=182y182'} alt="" />
        </div>
        <div className="detailInfo">
          <div className="detailInfo-top">{profile?.nickname}</div>

          <div className="detailInfo-bot"></div>
        </div>
      </div>
    )
  }

  // 渲染歌单
  const renderPlayList = useCallback((list: any[], title: string) => {
    return list?.length ? (
      <div className={styles.playlist}>
        <div className={styles.playlistTitle}>
          {title}（{list.length}）
        </div>
        <div className={styles.playlistContent}>
          {list.map((item) => {
            return (
              <div className={styles.itemWrapper} key={item.id}>
                <LazyLoad height={140}>
                  <PlayListItem item={item}></PlayListItem>
                </LazyLoad>
              </div>
            )
          })}
        </div>
      </div>
    ) : null
  }, [])

  // console.log(props)
  return (
    <div className={styles.UserHome}>
      {/* 渲染profile */}
      {renderProfile()}

      {/* 听歌排行 */}
      <RecordList showMoreBtn></RecordList>

      {/* 我创建的歌单 */}
      {renderPlayList(createList, '我创建的歌单')}

      {/* 我收藏的歌单 */}
      {renderPlayList(collectList, '我收藏的歌单')}
    </div>
  )
}

UserHome.defaultProps = {}

export default memo(UserHome)
