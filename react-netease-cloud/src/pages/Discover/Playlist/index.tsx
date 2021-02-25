// 发现音乐 - 歌单
import React, { FC, useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import http from 'service/http'
import styles from './index.module.scss'

interface IProps extends RouteComponentProps {}

interface IPlaylistItem {
  id: number
  [key: string]: string | number
}

interface IOption {
  label: string
  value: string
  children?: IOption[]
}

const Playlist: FC<IProps> = () => {
  // 歌单分类
  // 分页相关
  const [cat, setCat] = useState<string>('华语') // 歌单分类
  const [order, setOrder] = useState<'new' | 'hot'>('hot') // 歌单分类
  const [pageCount, setPageCount] = useState(35) // 每页数量
  // offset计算方法: (pageNum-1)*pageCount
  const [pageNum, setPageNum] = useState(1) // 当前页数
  const [total, setTotal] = useState(0) // 总条数
  const [playlist, setPlaylist] = useState<IPlaylistItem[]>() // playlist歌单列表

  // 获取歌单分类
  useEffect(() => {
    http
      .getPlaylistCateList()
      .then((res) => {
        if (res.data.code === 200) {
          const { categories, sub } = res.data || {}
          console.log(categories, sub)
          let cateOptions: IOption[] = []
          if (categories?.[0] && sub?.length) {
            Object.keys(categories).map((key) => ({ label: categories[key], value: categories[key] }))
          }

          console.log(cateOptions)
        }
      })
      .catch(() => {})
  }, [])

  // 获取某类歌单列表
  useEffect(() => {
    http
      .getTopPlayList({ cat, order, limit: pageCount, offset: (pageNum - 1) * pageCount })
      .then((res) => {
        // console.log(res)
        if (res.data.code === 200) {
          const { playlists, total } = res.data || {}
          setPlaylist(playlists)
          setTotal(total)
        }
      })
      .catch(() => {})
  }, [cat, order, pageCount, pageNum])

  return (
    <div className={styles.Playlist}>
      <div className={['w980', styles.PlaylistWrapper].join(' ')}>
        {/* title */}
        <div className={styles.title}>
          {/* Cascader */}
          {/* Select */}
        </div>

        {/* 歌单列表 */}
        <div className={styles.listWrapper}></div>

        {/* 分页器 */}
        <div className={styles.pagination}></div>
      </div>
    </div>
  )
}

export default Playlist
