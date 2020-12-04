// 发现 - 推荐 - 新碟上架
import { Carousel } from 'antd'
import React, { FC, useEffect, useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import http from 'service/http'
import { chunk } from 'lodash-es'

import styles from './index.module.scss'

interface IProps extends RouteComponentProps {}

const NewDisk: FC<IProps> = props => {
  const [list, setList] = useState<Array<Array<any>>>([[], [], []])

  useEffect(() => {
    http
      .newDisk()
      .then(res => {
        if (res.data.code === 200) {
          // 每5项push成一项数组
          const list = res.data.albums || []
          console.log('list', list)
          setList(chunk(list, 5))
        }
      })
      .catch(() => {})
  }, [])

  // 去新碟上架页面
  const ToAlbum = () => props.history.push('/discover/album')

  return (
    <div className={styles.NewDisk}>
      {/* title */}
      <div className={styles.title}>
        <div className={styles.left}>
          <div className='key' onClick={ToAlbum}>
            新碟上架
          </div>
        </div>
        <div className={styles.right} onClick={ToAlbum}>
          更多
        </div>
      </div>

      {/* disk */}
      <div className={styles.disk}>
        <div className='wrapper'>
          <div className='swiper'>
            <Carousel autoplay>
              {/* TODO */}
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  )
}

NewDisk.defaultProps = {}

export default withRouter(NewDisk)
