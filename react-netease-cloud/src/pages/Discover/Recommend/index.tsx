// 发现音乐 - 推荐
import React, { FC, useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import * as http from 'service/http'
import styles from './index.module.scss'

interface IProps extends RouteComponentProps {}

const Recommend: FC<IProps> = () => {
  // 获取轮播图列表
  useEffect(() => {
    http.banner().then(res => {
      console.log(res)
    })
    http.search('陈奕迅').then(res => {
      console.log(res)
    })
  }, [])

  return <div className={styles.Recommend}>Recommend</div>
}

export default Recommend
