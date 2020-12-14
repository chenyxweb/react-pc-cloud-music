// 发现音乐 - 推荐 - 入驻歌手列表

import React, { FC, useEffect, useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import http from 'service/http'

import styles from './index.module.scss'

interface IProps extends RouteComponentProps {}

const RecArtistList: FC<IProps> = props => {
  const [list, setList] = useState<any[]>([]) // 歌手列表
  // 获取入驻歌手列表
  useEffect(() => {
    http
      .getArtistList({ limit: 5 })
      .then(res => {
        if (res.data.code === 200) {
          setList(res.data.artists || [])
        }
      })
      .catch(() => {})
  }, [])

  return (
    <div className={styles.RecArtistList}>
      <div className='title'>
        <span>入驻歌手</span>
        <span onClick={() => props.history.push('/discover/artist/signed/')}>查看全部{' >'}</span>
      </div>
      {/* 列表 */}
      <div className='list'>
        {list.map(item => {
          return (
            <div className='list-item' key={item.id}>
              <img src={item.img1v1Url} alt='' />
              <div className='desc'>
                <div className='name'>{item.name}</div>
                <div className='type'>流行歌手</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

RecArtistList.defaultProps = {}

export default withRouter(RecArtistList)
