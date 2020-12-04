// 发现音乐 - 推荐
import React, { FC, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import HotRecommend from './HotRecommend'
import MyCarousel from './MyCarousel'
import NewDisk from './NewDisk'

import styles from './index.module.scss'

interface IProps extends RouteComponentProps {}

const Recommend: FC<IProps> = () => {
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
          </div>
          <div className={styles.right}>right</div>
        </div>
      </div>
    </div>
  )
}

export default Recommend
