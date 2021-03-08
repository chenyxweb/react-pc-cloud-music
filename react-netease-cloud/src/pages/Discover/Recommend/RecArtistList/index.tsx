// 发现音乐 - 推荐 - 热门歌手列表

import React, { FC, memo, useEffect, useState } from 'react'
import LazyLoad from 'react-lazyload'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import http from 'service/http'

import styles from './index.module.scss'

interface IProps extends RouteComponentProps {}

const RecArtistList: FC<IProps> = (props) => {
  const [list, setList] = useState<any[]>([]) // 歌手列表
  // 获取热门歌手列表
  useEffect(() => {
    http.homeApi
      .getArtistList({ limit: 10 })
      .then((res) => {
        if (res.data.code === 200) {
          setList(res.data.artists || [])
        }
      })
      .catch(() => {})
  }, [])

  // 点击歌手项
  const handleListItemClick = (id: number) => {
    id && props.history.push(`/discover/artist-detail/${id}`)
  }

  return (
    <div className={styles.RecArtistList}>
      <div className="title">
        <span>热门歌手</span>
        <span onClick={() => props.history.push('/discover/artist/signed/')}>查看全部{' >'}</span>
      </div>
      {/* 列表 */}
      <div className="list">
        {list.map((item) => {
          return (
            <div className="list-item" key={item.id} onClick={() => handleListItemClick(item.id)}>
              <LazyLoad height={62}>
                <img src={item.img1v1Url + '?param=62y62'} alt="" />
              </LazyLoad>
              <div className="desc">
                <div className="name">{item.name}</div>
                <div className="type">热门歌手</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

RecArtistList.defaultProps = {}

export default memo(withRouter(RecArtistList))
