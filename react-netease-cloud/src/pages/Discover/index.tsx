// 发现音乐

import React, { FC, memo } from 'react'
import constants from 'utils/constants'

import styles from './index.module.scss'
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config'

interface IProps extends RouteConfigComponentProps {}

const Discover: FC<IProps> = props => {
  const {
    location: { pathname },
  } = props

  // 计算高亮menu
  const calcActive = (item: { name: string; path: string }, index: number) => {
    if (index === 0) {
      // 发现音乐 - 推荐
      return pathname === '/'
    } else {
      return pathname.includes(item.path)
    }
  }

  // 点击subMenu
  const handleClickSubMenu = (item: { path: string; name: string }) => {
    if (item.path === '/discover/toplist') {
      // 默认到 飙升榜 19723756
      props.history.push('/discover/toplist/19723756')
    } else {
      props.history.push(item.path)
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
                onClick={() => handleClickSubMenu(item)}
              >
                {item.name}
              </div>
            )
          })}
        </div>
      </div>

      {/* ------------------------ 路由  ----------------------- */}
      {/* 推荐 */}
      {/* <Route path='/' component={Recommend} exact></Route> */}
      {/* <Route path='/discover' component={Recommend} exact></Route> */}
      {/* 排行榜 */}
      {/* <Route path='/discover/toplist/:id' component={Toplist}></Route> */}
      {/* 歌单列表 */}
      {/* <Route path='/discover/playlist' component={Playlist}></Route> */}
      {/* 主播电台 */}
      {/* <Route path='/discover/djradio' component={Djradio}></Route> */}
      {/* 歌手列表 */}
      {/* <Route path='/discover/artist' component={Artist}></Route> */}
      {/* 新碟上架 - 专辑列表 */}
      {/* <Route path='/discover/album' component={Album}></Route> */}
      {/* 歌单详情 */}
      {/* <Route path='/discover/playlist-detail' component={PlaylistDetail}></Route> */}
      {/* 专辑详情 */}
      {/* <Route path='/discover/album-detail' component={AlbumDetail}></Route> */}
      {/* 歌手详情 */}
      {/* <Route path='/discover/artist-detail' component={ArtistDetail}></Route> */}
      {/* 歌曲详情页 */}
      {/* <Route path='/discover/song' component={Song}></Route> */}

      {renderRoutes(props.route?.routes)}
    </div>
  )
}

export default memo(Discover)
