import React, { FC, lazy, useEffect, useState } from 'react'
import { Route, RouteComponentProps } from 'react-router-dom'
import { SearchOutlined } from '@ant-design/icons'

// import MyFooter from 'components/MyFooter'
// import PlayBar from 'components/PlayBar'
// import Discover from 'pages/Discover'
// import Download from 'pages/Download'
// import Friend from 'pages/Friend'
// import Mall from 'pages/Mall'
// import Musician from 'pages/Musician'
// import My from 'pages/My'
// import Test from 'pages/Test'

import constants from 'utils/constants'
import styles from './index.module.scss'
import useDebounce from 'hooks/useDebounce'
import http from 'service/http'
import MyTransition from 'components/MyTransition'
import utils from 'utils/utils'

// 按需加载
const MyFooter = lazy(() => import('components/MyFooter'))
const PlayBar = lazy(() => import('components/PlayBar'))
const Discover = lazy(() => import('pages/Discover'))
const Download = lazy(() => import('pages/Download'))
const Friend = lazy(() => import('pages/Friend'))
const Mall = lazy(() => import('pages/Mall'))
const Musician = lazy(() => import('pages/Musician'))
const My = lazy(() => import('pages/My'))
const Test = lazy(() => import('pages/Test'))

interface IProps extends RouteComponentProps {}

const Home: FC<IProps> = props => {
  const pathname = props.location.pathname

  const [inputValue, setInputValue] = useState('') // input的值
  const [songs, setSongs] = useState<any[]>([]) // 单曲列表
  const [artists, setArtists] = useState<any[]>([]) // 歌手列表
  const [albums, setAlbums] = useState<any[]>([]) // 专辑列表
  const [order, setOrder] = useState<('songs' | 'artists' | 'albums')[]>([]) // 单曲,歌手,专辑等...展示排序
  const [showSearchSuggest, setShowSearchSuggest] = useState(false) // 是否展示搜索建议框

  // 获取防抖化后的input值
  const [debounceInputValue] = useDebounce(inputValue, 300)

  // 请求搜索接口
  useEffect(() => {
    // console.log(debounceInputValue)
    if (!debounceInputValue.trim()) return
    http
      .getSearchSuggest(debounceInputValue)
      .then(res => {
        console.log(res)
        if (res.data.code === 200) {
          const { songs, artists, albums, order } = res.data?.result || {}
          setSongs(songs || [])
          setArtists(artists || [])
          setAlbums(albums || [])
          setOrder(order || [])
        }
      })
      .catch(() => {})
  }, [debounceInputValue])

  // 渲染topBar元素
  const renderTopBar = () => (
    <div className='top-bar'>
      <div className='top-bar-top'>
        <div className='container'>
          {/* logo */}
          <div className='logo' onClick={() => props.history.replace('/')}></div>

          {/* menu */}
          <ul className='menu'>
            {constants.topMenu.map((item, index) => {
              return (
                <li
                  key={index}
                  className={
                    // pathname 为 '/' 时特殊处理
                    index === 0
                      ? pathname === '/' || pathname.includes('/discover')
                        ? 'active'
                        : ''
                      : pathname.includes(item.path)
                      ? 'active'
                      : ''
                  }
                  onClick={() => props.history.replace(item.path)}
                >
                  {item.name}
                </li>
              )
            })}
          </ul>

          {/* 搜索 */}
          <div className='search'>
            <div className='input-wrapper'>
              <div className='input-outer'>
                <SearchOutlined className='icon' />
                <input
                  onFocus={() => setShowSearchSuggest(true)}
                  onBlur={() => setShowSearchSuggest(false)}
                  value={inputValue}
                  onChange={e => setInputValue(e.currentTarget.value.trim())}
                  type='text'
                  className='input'
                  placeholder='音乐/视频/电台/用户'
                />

                {/* 定位搜索建议列表 */}
                <MyTransition in={showSearchSuggest} mode='fade' timeout={300}>
                  <div className='search-suggest-wrapper'>
                    {order.length ? (
                      <div className='search-suggest-box' style={{ display: 'block' }}>
                        {/* 搜xx相关用户 */}
                        <div className='search-user'>
                          <span>
                            搜“{debounceInputValue}”相关用户{' ＞'}
                          </span>
                        </div>
                        {/* 单曲,歌手,专辑 */}
                        {order.map(item => {
                          if (item === 'songs') {
                            return (
                              //  单曲
                              <div className='search-item search-song' key={item}>
                                <div className='search-item-left'>
                                  <div className='icon'></div>
                                  <div className='search-item-name'>单曲</div>
                                </div>
                                <div className='search-item-right'>
                                  {songs.map(i => (
                                    <div
                                      className='right-item ellipsis-1'
                                      key={i.id}
                                      dangerouslySetInnerHTML={{
                                        __html: utils.replaceTargetStr(
                                          i.name + `-${(i?.artists || []).map((ite: any) => ite.name).join(' ')}`,
                                          debounceInputValue,
                                          `<span>${debounceInputValue}</span>`
                                        ),
                                      }}
                                    ></div>
                                  ))}
                                </div>
                              </div>
                            )
                          }

                          // 歌手
                          if (item === 'artists') {
                            return (
                              <div className='search-item search-artist' key={item}>
                                <div className='search-item-left'>
                                  <div className='icon'></div>
                                  <div className='search-item-name'>歌手</div>
                                </div>
                                <div className='search-item-right'>
                                  {artists.map(i => (
                                    <div
                                      className='right-item ellipsis-1'
                                      key={i.id}
                                      dangerouslySetInnerHTML={{
                                        __html: utils.replaceTargetStr(
                                          i.name,
                                          debounceInputValue,
                                          `<span>${debounceInputValue}</span>`
                                        ),
                                      }}
                                    ></div>
                                  ))}
                                </div>
                              </div>
                            )
                          }

                          // 专辑
                          if (item === 'albums') {
                            return (
                              <div className='search-item search-album' key={item}>
                                <div className='search-item-left'>
                                  <div className='icon'></div>
                                  <div className='search-item-name'>专辑</div>
                                </div>
                                <div className='search-item-right'>
                                  {albums.map(i => (
                                    <div
                                      className='right-item ellipsis-1'
                                      key={i.id}
                                      dangerouslySetInnerHTML={{
                                        __html: utils.replaceTargetStr(
                                          i.name + `-${i.artist?.name}`,
                                          debounceInputValue,
                                          `<span>${debounceInputValue}</span>`
                                        ),
                                      }}
                                    ></div>
                                  ))}
                                </div>
                              </div>
                            )
                          }

                          return null
                        })}
                      </div>
                    ) : null}
                  </div>
                </MyTransition>
              </div>
            </div>
            <div className='center'>
              <div className='content-wrapper'>创作者中心</div>
            </div>
            <div className='login'>
              <span>登录</span>
            </div>
          </div>
        </div>
      </div>
      <div className='top-bar-bot' style={{ height: pathname === '/' || pathname.includes('/discover') ? 0 : 5 }}></div>
    </div>
  )

  return (
    <div className={styles.Home}>
      {/* 渲染topBar元素 */}
      {renderTopBar()}

      {/* 路由 */}

      <div className={styles.routeWrapper}>
        <Route path='/' component={Discover} exact></Route>
        <Route path='/discover' component={Discover}></Route>
        <Route path='/my' component={My}></Route>
        <Route path='/friend' component={Friend}></Route>
        <Route path='/mall' component={Mall}></Route>
        <Route path='/musician' component={Musician}></Route>
        <Route path='/download' component={Download}></Route>
        <Route path='/test' component={Test}></Route>
      </div>

      {/* Footer */}
      <MyFooter></MyFooter>

      {/* 播放条 */}
      <PlayBar></PlayBar>
    </div>
  )
}

Home.defaultProps = {}

export default Home
