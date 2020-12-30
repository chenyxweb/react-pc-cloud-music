// 发现音乐

import React, { FC, lazy, memo } from 'react'
import { Route, RouteComponentProps } from 'react-router-dom'
import constants from 'utils/constants'

// import Album from './Album'
// import Artist from './Artist'
// import Djradio from './Djradio'
// import Playlist from './Playlist'
// import Recommend from './Recommend'
// import Toplist from './Toplist'
// import PlaylistDetail from './PlaylistDetail'
// import AlbumDetail from './AlbumDetail'
// import Song from './Song'

import styles from './index.module.scss'
import ArtistDetail from './ArtistDetail'

// 按需引入
const Album = lazy(() => import('./Album'))
const Artist = lazy(() => import('./Artist'))
const Djradio = lazy(() => import('./Djradio'))
const Playlist = lazy(() => import('./Playlist'))
const Recommend = lazy(() => import('./Recommend'))
const Toplist = lazy(() => import('./Toplist'))
const PlaylistDetail = lazy(() => import('./PlaylistDetail'))
const AlbumDetail = lazy(() => import('./AlbumDetail'))
const Song = lazy(() => import('./Song'))

interface IProps extends RouteComponentProps {}

const Discover: FC<IProps> = props => {
  const {
    location: { pathname },
  } = props

  // 计算高亮menu
  const calcActive = (item: { name: string; path: string }, index: number) => {
    if (index === 0) {
      // 发现音乐 - 推荐
      return pathname === '/' || pathname === '/discover'
    } else {
      return pathname.includes(item.path)
    }
  }

  return (
    <div className={styles.Discover}>
      {/* 小menu */}
      <div className='sub-menu'>
        <div className='container'>
          {constants.subMenu.map((item, index) => {
            return (
              <div
                className={['sub-menu-item', calcActive(item, index) ? 'active' : ''].join(' ')}
                key={index}
                onClick={() => props.history.push(item.path)}
              >
                {item.name}
              </div>
            )
          })}
        </div>
      </div>

      {/* ------------------------ 路由  ----------------------- */}
      {/* 推荐 */}
      <Route path='/' component={Recommend} exact></Route>
      <Route path='/discover' component={Recommend} exact></Route>
      {/* 排行榜 */}
      <Route path='/discover/toplist/:id' component={Toplist}></Route>
      {/* 歌单列表 */}
      <Route path='/discover/playlist' component={Playlist}></Route>
      {/* 主播电台 */}
      <Route path='/discover/djradio' component={Djradio}></Route>
      {/* 歌手列表 */}
      <Route path='/discover/artist' component={Artist}></Route>
      {/* 新碟上架 - 专辑列表 */}
      <Route path='/discover/album' component={Album}></Route>
      {/* 歌单详情 */}
      <Route path='/discover/playlist-detail' component={PlaylistDetail}></Route>
      {/* 专辑详情 */}
      <Route path='/discover/album-detail' component={AlbumDetail}></Route>
      {/* 歌手详情 */}
      <Route path='/discover/artist-detail' component={ArtistDetail}></Route>
      {/* 歌曲详情页 */}
      <Route path='/discover/song' component={Song}></Route>
    </div>
  )
}

export default memo(Discover)
