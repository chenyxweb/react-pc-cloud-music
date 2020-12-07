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
          setList(chunk(list, 5))
          console.log('list', chunk(list, 5))
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
            <Carousel className='antd-carousel' autoplay>
              {/* TODO */}
              {list.map((item, index) => {
                return (
                  <div className='carousel-item' key={index}>
                    <div className='swiper-wrapper'>
                      {item.map((ite, ind) => {
                        console.log(ite)
                        return (
                          <div className='swiper-item' key={ite.picId}>
                            <div className='img'>
                              <img src={ite.picUrl} alt='' />
                            </div>
                            <p className='song-name'>耗尽</p>
                            <p className='author'>
                              <span>薛之谦</span> / <span>郭聪明</span>
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </Carousel>

            {/* 左右箭头 */}
          </div>
        </div>
      </div>
    </div>
  )
}

NewDisk.defaultProps = {}

export default withRouter(NewDisk)
