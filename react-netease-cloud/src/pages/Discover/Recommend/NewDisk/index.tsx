// 发现 - 推荐 - 新碟上架
import { Carousel } from 'antd'
import React, { FC, useEffect, useRef, useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import http from 'service/http'
import { chunk } from 'lodash-es'

import styles from './index.module.scss'

interface IProps extends RouteComponentProps {}

const NewDisk: FC<IProps> = props => {
  const [list, setList] = useState<Array<Array<any>>>([[], [], []]) // 专辑列表
  const carouselRef = useRef<any>()

  useEffect(() => {
    http
      .newDisk()
      .then(res => {
        if (res.data.code === 200) {
          // 每5项push成一项数组
          const list = res.data.albums || []
          console.log('list', chunk(list, 5))
          setList(chunk(list, 5))
        }
      })
      .catch(() => {})
  }, [])

  // 去新碟上架页面
  const ToAlbum = () => props.history.push('/discover/album')

  // 去专辑详情页
  const toAlbumDetail = (id: number) => props.history.push(`/discover/album-detail?id=${id}`)

  // 去歌手详情页
  const toArtistDetail = (id: number) => props.history.push(`/discover/artist-detail?id=${id}`)

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
            <Carousel className='antd-carousel' autoplay easing='ease-in-out' dots={false} ref={carouselRef}>
              {/* TODO */}
              {list.map((item, index) => {
                return (
                  // 页数
                  <div className='carousel-item' key={index}>
                    <div className='swiper-wrapper'>
                      {item.map((ite, ind) => {
                        return (
                          // 每一页
                          <div className='swiper-item' key={ite.id}>
                            <div className='img'>
                              <img src={ite.picUrl} title={ite.name} alt='' onClick={() => toAlbumDetail(ite.id)} />
                            </div>
                            {/* 歌名 */}
                            <p className='song-name ellipsis-1' onClick={() => toAlbumDetail(ite.id)}>
                              {ite.name}
                            </p>
                            {/* 歌手 */}
                            <p className='author'>
                              <span onClick={() => toArtistDetail(ite.artists[0].id)}>{ite.artists[0]?.name}</span>{' '}
                              {ite.artists?.length >= 2 ? '/' : ''}{' '}
                              {ite.artists[1]?.name ? (
                                <span onClick={() => toArtistDetail(ite.artists[1].id)}>{ite.artists[1].name}</span>
                              ) : (
                                ''
                              )}{' '}
                              {ite.artists[2]?.name ? '...' : ''}
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
            <LeftOutlined className='arrow-left' onClick={() => carouselRef.current?.prev()} />
            <RightOutlined className='arrow-right' onClick={() => carouselRef.current?.next()} />
          </div>
        </div>
      </div>
    </div>
  )
}

NewDisk.defaultProps = {}

export default withRouter(NewDisk)
