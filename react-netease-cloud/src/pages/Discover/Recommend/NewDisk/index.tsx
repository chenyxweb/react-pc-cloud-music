// 发现 - 推荐 - 新碟上架
import { Carousel } from 'antd'
import React, { FC, memo, useEffect, useRef, useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import http from 'service/http'
import { chunk } from 'lodash-es'

import styles from './index.module.scss'
import DiskItem from 'components/DiskItem'

interface IProps extends RouteComponentProps {}

const NewDisk: FC<IProps> = (props) => {
  const [list, setList] = useState<Array<Array<any>>>([[], []]) // 专辑列表
  const carouselRef = useRef<any>()

  useEffect(() => {
    http.homeApi
      .newDisk()
      .then((res) => {
        if (res.data.code === 200) {
          // 每5项push成一项数组
          const list = res.data.albums || []
          // 取出前十项
          // console.log('list', chunk(list, 5))
          setList(chunk(list, 5).slice(0, 2))
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
          <div className="key" onClick={ToAlbum}>
            新碟上架
          </div>
        </div>
        <div className={styles.right} onClick={ToAlbum}>
          更多
        </div>
      </div>

      {/* disk */}
      <div className={styles.disk}>
        <div className="wrapper">
          <div className="swiper">
            <Carousel className="antd-carousel" autoplay easing="ease-in-out" dots={false} ref={carouselRef}>
              {list.map((item, index) => {
                return (
                  // 页数
                  <div className="carousel-item" key={index}>
                    <div className="swiper-wrapper">
                      {item.map((ite, ind) => {
                        return (
                          // 每一项
                          <div className="disk-item-wrapper" key={ind}>
                            <DiskItem size="small" item={ite}></DiskItem>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </Carousel>

            {/* 左右箭头 */}
            <LeftOutlined className="arrow-left" onClick={() => carouselRef.current?.prev()} />
            <RightOutlined className="arrow-right" onClick={() => carouselRef.current?.next()} />
          </div>
        </div>
      </div>
    </div>
  )
}

NewDisk.defaultProps = {}

export default memo(withRouter(NewDisk))
