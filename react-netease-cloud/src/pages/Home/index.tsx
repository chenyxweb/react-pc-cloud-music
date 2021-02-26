import React, { FC, lazy, memo, useCallback, useEffect, useState } from 'react'
import {
  MailOutlined,
  PoweroffOutlined,
  PushpinOutlined,
  SearchOutlined,
  SettingOutlined,
  StarOutlined,
  StockOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config'
import { Avatar, Dropdown, Menu, message, Modal } from 'antd'

import constants from 'utils/constants'
import styles from './index.module.scss'
import useDebounce from 'hooks/useDebounce'
import http from 'service/http'
import MyTransition from 'components/MyTransition'
import utils from 'utils/utils'
import { update_user_info } from 'store/userInfo/actions'
import { connect, DispatchProp } from 'react-redux'
import { ICombineState } from 'store'
import { stop_is_play } from 'store/playBarState/actions'

// 按需加载
const MyFooter = lazy(() => import('components/MyFooter'))
const PlayBar = lazy(() => import('components/PlayBar'))

interface IProps {}

const Home: FC<IProps & Pick<ICombineState, 'userInfo'> & DispatchProp & RouteConfigComponentProps> = (props) => {
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
    http.homeApi
      .getSearchSuggest(debounceInputValue)
      .then((res) => {
        // console.log(res)
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

  // 点击歌曲
  const handleSongsItemClick = (song: any) => {
    // console.log('song: ', song)
    if (song?.id) {
      props.history.push(`/discover/song/${song.id}`)
    }
  }

  // 点击歌手
  const handleArtistsItemClick = (artist: any) => {
    // console.log('artist: ', artist)
    if (artist?.id) {
      props.history.push(`/discover/artist-detail/${artist.id}`)
    }
  }

  // 去登录页
  const go2Login = () => {
    // 暂停歌曲播放
    props.dispatch(stop_is_play())

    // 获取当前页面
    // console.log(props)
    // console.log(window.location.href)
    const href = encodeURIComponent(window.location.href)
    props.history.push(`/login?from=${href}`)
  }

  // 点击专辑
  const handleAlbumsItemClick = (album: any) => {
    // console.log('album: ', album)
    if (album?.id) {
      props.history.push(`/discover/album/${album.id}`)
    }
  }

  // 渲染topBar元素
  const renderTopBar = () => (
    <div className="top-bar">
      <div className="top-bar-top">
        <div className="container">
          {/* logo */}
          <div className="logo" onClick={() => props.history.replace('/')}></div>

          {/* menu */}
          <ul className="menu">
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
          <div className="search">
            <div className="input-wrapper">
              <div className="input-outer">
                <SearchOutlined className="icon" />
                <input
                  onFocus={() => setShowSearchSuggest(true)}
                  onBlur={() => setShowSearchSuggest(false)}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.currentTarget.value.trim())}
                  type="text"
                  className="input"
                  placeholder="音乐/视频/电台/用户"
                />

                {/* 定位搜索建议列表 */}
                <MyTransition in={showSearchSuggest} mode="fade" timeout={300}>
                  <div className="search-suggest-wrapper">
                    {order.length ? (
                      <div className="search-suggest-box" style={{ display: 'block' }}>
                        {/* 搜xx相关用户 */}
                        <div className="search-user">
                          <span>
                            搜“{debounceInputValue}”相关用户{' ＞'}
                          </span>
                        </div>
                        {/* 单曲,歌手,专辑 */}
                        {order.map((item) => {
                          //  --------------------------- 单曲 ------------------------------------------
                          if (item === 'songs') {
                            return (
                              <div className="search-item search-song" key={item}>
                                <div className="search-item-left">
                                  <div className="icon"></div>
                                  <div className="search-item-name">单曲</div>
                                </div>
                                <div className="search-item-right">
                                  {songs.map((i) => (
                                    <div
                                      className="right-item ellipsis-1"
                                      key={i.id}
                                      dangerouslySetInnerHTML={{
                                        __html: utils.replaceTargetStr(
                                          i.name + `-${(i?.artists || []).map((ite: any) => ite.name).join(' ')}`,
                                          debounceInputValue,
                                          `<span>${debounceInputValue}</span>`
                                        ),
                                      }}
                                      onClick={() => handleSongsItemClick(i)}
                                    ></div>
                                  ))}
                                </div>
                              </div>
                            )
                          }

                          // --------------------------- 歌手 ------------------------------------------
                          if (item === 'artists') {
                            return (
                              <div className="search-item search-artist" key={item}>
                                <div className="search-item-left">
                                  <div className="icon"></div>
                                  <div className="search-item-name">歌手</div>
                                </div>
                                <div className="search-item-right">
                                  {artists.map((i) => (
                                    <div
                                      className="right-item ellipsis-1"
                                      key={i.id}
                                      dangerouslySetInnerHTML={{
                                        __html: utils.replaceTargetStr(
                                          i.name,
                                          debounceInputValue,
                                          `<span>${debounceInputValue}</span>`
                                        ),
                                      }}
                                      onClick={() => handleArtistsItemClick(i)}
                                    ></div>
                                  ))}
                                </div>
                              </div>
                            )
                          }

                          // --------------------------- 专辑 ------------------------------------------
                          if (item === 'albums') {
                            return (
                              <div className="search-item search-album" key={item}>
                                <div className="search-item-left">
                                  <div className="icon"></div>
                                  <div className="search-item-name">专辑</div>
                                </div>
                                <div className="search-item-right">
                                  {albums.map((i) => (
                                    <div
                                      className="right-item ellipsis-1"
                                      key={i.id}
                                      dangerouslySetInnerHTML={{
                                        __html: utils.replaceTargetStr(
                                          i.name + `-${i.artist?.name}`,
                                          debounceInputValue,
                                          `<span>${debounceInputValue}</span>`
                                        ),
                                      }}
                                      onClick={() => handleAlbumsItemClick(i)}
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
            <div className="center">
              <div className="content-wrapper">创作者中心</div>
            </div>
            <div className="login">
              {/* 未登录展示 */}
              {/* 登录展示 profile */}
              {props.userInfo?.isLogin ? renderProfile() : <span onClick={go2Login}>登录</span>}
            </div>
          </div>
        </div>
      </div>
      <div className="top-bar-bot" style={{ height: pathname === '/' || pathname.includes('/discover') ? 0 : 5 }}></div>
    </div>
  )

  // logout
  const logout = useCallback(() => {
    Modal.confirm({
      title: '确定退出么?',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        http.loginApi
          .logout()
          .then((res) => {
            console.log(res)
            if (res.data.code === 200) {
              props.dispatch(update_user_info({ account: {}, profile: {}, isLogin: false }))
              // 去首页
              props.history.replace('/')
            } else {
              message.error('系统错误')
            }
          })
          .catch(() => {})
      },
    })
  }, [props])

  // 用户profile
  const renderProfile = useCallback(() => {
    const { account, profile } = props.userInfo || {}
    // console.log(profile)
    return (
      <div className={styles.userProfile}>
        <Dropdown
          // trigger={['click']}
          overlay={
            <Menu>
              <Menu.Item onClick={() => props.history.push(`/user/home/${profile.userId}`)}>
                <UserOutlined />
                我的主页
              </Menu.Item>
              <Menu.Item>
                <MailOutlined />
                我的消息
              </Menu.Item>
              <Menu.Item>
                <StockOutlined />
                我的等级
              </Menu.Item>
              <Menu.Item>
                <StarOutlined />
                VIP会员
              </Menu.Item>
              <Menu.Item>
                <SettingOutlined />
                个人设置
              </Menu.Item>
              <Menu.Item>
                <PushpinOutlined />
                实名认证
              </Menu.Item>
              <Menu.Item onClick={logout}>
                <PoweroffOutlined />
                退出
              </Menu.Item>
            </Menu>
          }
        >
          <Avatar src={profile?.avatarUrl + '?param=30y30'}></Avatar>
        </Dropdown>
      </div>
    )
  }, [logout, props.history, props.userInfo])

  // 判断登录状态, 获取用户数据
  useEffect(() => {
    // http.logout().then(res => {
    //   console.log(res)
    // })
    http.loginApi.getLoginStatus().then((res) => {
      if (res.data?.data?.code === 200) {
        const { account, profile } = res.data.data || {}
        // console.log('account: ', account)
        // console.log('profile: ', profile)

        if (profile?.userId) {
          // 已登录
          // 更新store中数据
          props.dispatch(update_user_info({ account, profile, isLogin: true }))
        } else {
          // 未登录
          // 删除store中用户数据
          // 删除本地用户数据
          props.dispatch(update_user_info({ account: {}, profile: {}, isLogin: false }))
        }
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={styles.Home}>
      {/* 渲染topBar元素 */}
      {renderTopBar()}

      {/* 路由 */}

      <div className={styles.routeWrapper}>
        {/* <Route path='/' component={Discover} exact></Route>
        <Route path='/discover' component={Discover}></Route>
        <Route path='/my' component={My}></Route>
        <Route path='/friend' component={Friend}></Route>
        <Route path='/mall' component={Mall}></Route>
        <Route path='/musician' component={Musician}></Route>
        <Route path='/download' component={Download}></Route>
        <Route path='/test' component={Test}></Route> */}

        {renderRoutes(props.route?.routes)}
      </div>

      {/* Footer */}
      <MyFooter></MyFooter>

      {/* 播放条 */}
      <PlayBar></PlayBar>
    </div>
  )
}

Home.defaultProps = {}

// map store
const mapStateToProps = (state: ICombineState) => {
  // console.log(state)
  return {
    userInfo: state.userInfo,
  }
}

export default memo(connect(mapStateToProps)(Home))
