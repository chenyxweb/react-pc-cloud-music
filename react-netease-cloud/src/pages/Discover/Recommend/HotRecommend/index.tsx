// 发现 - 推荐 - 热门推荐
import { CustomerServiceOutlined, PlayCircleOutlined } from '@ant-design/icons'
import React, { FC, useEffect, useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import * as http from 'service/http'

import styles from './index.module.scss'

interface IProps extends RouteComponentProps {}

const HotRecommend: FC<IProps> = props => {
  const [list, setList] = useState<any[]>([]) // 推荐列表

  // 获取热门推荐列表
  useEffect(() => {
    http
      .recommendPlaylist(8)
      .then(res => {
        console.log(res)
        if (res.data.code === 200) {
          setList(res.data.result || [])
        }
      })
      .catch(() => {})
  }, [])

  // 点击热门推荐分类
  const handleClickTitle = (cat: string) => props.history.push(`/discover/playlist?cat=${cat}`)

  return (
    <div className={styles.HotRecommend}>
      {/* title */}
      <div className={styles.title}>
        <div className={styles.left}>
          <div className='key'>热门推荐</div>
          <div className='list'>
            <span onClick={() => handleClickTitle('华语')}>华语</span>
            <span className='line'>|</span>
            <span onClick={() => handleClickTitle('流行')}>流行</span>
            <span className='line'>|</span>
            <span onClick={() => handleClickTitle('摇滚')}>摇滚</span>
            <span className='line'>|</span>
            <span onClick={() => handleClickTitle('民谣')}>民谣</span>
            <span className='line'>|</span>
            <span onClick={() => handleClickTitle('电子')}>电子</span>
          </div>
        </div>
        <div className={styles.right} onClick={() => handleClickTitle('')}>
          更多
        </div>
      </div>

      {/* 热门推荐列表 */}
      <div className={styles.recommendList}>
        {list.map(item => {
          return (
            <div className={styles.recommendListItem} key={item.id} title={item.name}>
              <div className='img-wrapper'>
                <img src={item.picUrl} alt='' />

                {/* 定位元素 */}
                <div className='play-bar'>
                  <div className='play-num'>
                    <CustomerServiceOutlined />
                    <span style={{ fontSize: 12, paddingLeft: 4 }}>12万</span>
                  </div>
                  <PlayCircleOutlined className='play' />
                </div>
              </div>
              <div className='name'>{item.name}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

HotRecommend.defaultProps = {}

export default withRouter(HotRecommend)
