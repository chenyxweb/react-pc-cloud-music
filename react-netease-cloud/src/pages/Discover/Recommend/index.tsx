// 发现音乐 - 推荐
import React, { FC, memo } from 'react'
import HotRecommend from './HotRecommend'
import MyCarousel from './MyCarousel'
import NewDisk from './NewDisk'

import styles from './index.module.scss'
import RecTopList from './RecTopList'
import RecArtistList from './RecArtistList'
import { connect, DispatchProp } from 'react-redux'
import { RouteConfigComponentProps } from 'react-router-config'
import { stop_is_play } from 'store/playBarState/actions'
import { ICombineState } from 'store'

interface IProps {}

const Recommend: FC<IProps & RouteConfigComponentProps & DispatchProp & Pick<ICombineState, 'userInfo'>> = (props) => {
  // console.log(props.userInfo)

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

  // 渲染login
  const renderLogin = () => {
    return (
      <div className="login">
        <p>登录网易云音乐，可以享受无限收藏的乐趣，并且无限同步到手机</p>
        <div className="btn" onClick={go2Login}>
          用户登录
        </div>
      </div>
    )
  }

  return (
    <div className={styles.Recommend}>
      {/* 轮播图 */}
      <MyCarousel />

      {/* 页面主体 */}
      <div className={styles.main}>
        <div className={[styles.container, 'w980'].join(' ')}>
          <div className={styles.left}>
            {/* 热门推荐 */}
            <HotRecommend />

            {/* 新碟上架 */}
            <NewDisk />

            {/* 榜单 */}
            <RecTopList />
          </div>
          <div className={styles.right}>
            {/* login */}
            {props?.userInfo?.isLogin ? null : renderLogin()}

            {/* 入驻歌手 */}
            <RecArtistList />
            {/* 热门主播 */}
          </div>
        </div>
      </div>
    </div>
  )
}

// map store
const mapStateToProps = (state: ICombineState) => {
  return {
    userInfo: state.userInfo,
  }
}

export default connect(mapStateToProps)(memo(Recommend))
