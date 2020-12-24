// 发现音乐 - 推荐
import React, { FC, memo } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import HotRecommend from './HotRecommend'
import MyCarousel from './MyCarousel'
import NewDisk from './NewDisk'

import styles from './index.module.scss'
import RecTopList from './RecTopList'
import RecArtistList from './RecArtistList'
import { message } from 'antd'

interface IProps extends RouteComponentProps {}

const Recommend: FC<IProps> = () => {
  // 渲染login
  const renderLogin = () => {
    return (
      <div className='login'>
        <p>登录网易云音乐，可以享受无限收藏的乐趣，并且无限同步到手机</p>
        <div className='btn' onClick={() => message.info('暂无登录功能')}>
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
            {renderLogin()}

            {/* 入驻歌手 */}
            <RecArtistList />
            {/* 热门主播 */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(Recommend)
