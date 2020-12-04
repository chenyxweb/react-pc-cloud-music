// 发现音乐

import React, { FC } from 'react'
import { Route, RouteComponentProps } from 'react-router-dom'
import constants from 'utils/constants'

import Album from './Album'
import Artist from './Artist'
import Djradio from './Djradio'
import Playlist from './Playlist'
import Recommend from './Recommend'
import Toplist from './Toplist'

import styles from './index.module.scss'
import PlaylistPlay from './PlaylistPlay'

interface IProps extends RouteComponentProps {}

const Discover: FC<IProps> = props => {
  const {
    location: { pathname },
  } = props

  return (
    <div className={styles.Discover}>
      {/* 小menu */}
      <div className='sub-menu'>
        <div className='container'>
          {constants.subMenu.map((item, index) => {
            return (
              <div
                className={[
                  'sub-menu-item',
                  (index === 0 && pathname === '/') || pathname === item.path ? 'active' : '',
                ].join(' ')}
                key={index}
                onClick={() => props.history.push(item.path)}
              >
                {item.name}
              </div>
            )
          })}
        </div>
      </div>

      {/* 路由 */}
      <Route path='/' component={Recommend} exact></Route>
      <Route path='/discover' component={Recommend} exact></Route>
      <Route path='/discover/toplist' component={Toplist}></Route>
      <Route path='/discover/playlist' component={Playlist}></Route>
      <Route path='/discover/djradio' component={Djradio}></Route>
      <Route path='/discover/artist' component={Artist}></Route>
      <Route path='/discover/album' component={Album}></Route>
      <Route path='/discover/playlist-play' component={PlaylistPlay}></Route>
    </div>
  )
}

export default Discover
