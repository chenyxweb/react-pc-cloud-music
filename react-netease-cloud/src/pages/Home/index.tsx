import { SearchOutlined } from '@ant-design/icons'
import Discover from 'pages/Discover'
import Download from 'pages/Download'
import Friend from 'pages/Friend'
import Mall from 'pages/Mall'
import Musician from 'pages/Musician'
import My from 'pages/My'
import React, { FC } from 'react'
import { Route, RouteComponentProps } from 'react-router-dom'
import constants from 'utils/constants'
import styles from './index.module.scss'

interface IProps extends RouteComponentProps {}

const Home: FC<IProps> = props => {
  const pathname = props.location.pathname

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
                <input type='text' className='input' placeholder='音乐/视频/电台/用户' />
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

      <Route path='/' component={Discover} exact></Route>
      <Route path='/discover' component={Discover}></Route>
      <Route path='/my' component={My}></Route>
      <Route path='/friend' component={Friend}></Route>
      <Route path='/mall' component={Mall}></Route>
      <Route path='/musician' component={Musician}></Route>
      <Route path='/download' component={Download}></Route>

      {/* 播放条 */}
      <PlayBar></PlayBar>
    </div>
  )
}

Home.defaultProps = {}

export default Home
