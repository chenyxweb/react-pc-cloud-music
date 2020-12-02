// 轮播图
import React, { FC, memo, useEffect, useRef, useState } from 'react'
import { Carousel } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import * as http from 'service/http'
import styles from './index.module.scss'

interface IProps {}

const MyCarousel: FC<IProps> = () => {
  const [bannerList, setBannerList] = useState<Array<any>>([]) // 轮播图列表
  const carouselRef = useRef<any>()
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  // 获取轮播图数据
  useEffect(() => {
    http
      .banner()
      .then(res => {
        console.log(res)
        if (res.data.code === 200) {
          setBannerList(res.data.banners || [])
        }
      })
      .catch(() => {})
  }, [])

  // 轮播改变
  const handleBeforeChange = (currentSlide: number, nextSlide: number) => {
    // 设置当前索引-->设置大背景
    setCurrentIndex(nextSlide)
  }

  // 上一张
  const switchToPerv = () => {
    carouselRef?.current?.prev()
  }

  // 下一张
  const switchToNext = () => {
    carouselRef?.current?.next()
  }

  return (
    <div
      className={styles.carousel}
      style={{
        backgroundImage: `url(${bannerList[currentIndex]?.imageUrl}?imageView&blur=40x20)`,
      }}
    >
      <div className='wrapper w980'>
        <Carousel className='carousels' ref={carouselRef} autoplay effect='fade' beforeChange={handleBeforeChange}>
          {bannerList.map(item => (
            <img src={item.imageUrl} alt='' key={item.encodeId} />
          ))}
        </Carousel>

        {/* 左箭头 */}
        <div className='arrow-l' onClick={switchToPerv}>
          <LeftOutlined style={{ color: '#ddd', fontSize: 36 }} />
        </div>

        {/* 右箭头 */}
        <div className='arrow-r' onClick={switchToNext}>
          <RightOutlined style={{ color: '#ddd', fontSize: 36 }} />
        </div>

        <div className='img'></div>
      </div>
    </div>
  )
}

MyCarousel.defaultProps = {}

// 当 props 没有变化时 不进行渲染render  提高性能
// 父组件的更新不会导致 当前组件的更新
export default memo(MyCarousel)
