// 发现 - 推荐 - 热门推荐
import PlayListItem from 'components/PlayListItem'
import React, { FC, memo, useEffect, useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import http from 'service/http'

import styles from './index.module.scss'

interface IProps {}

// 占位列表
const tempList = Array(8)
  .fill(1)
  .map((item, index) => ({
    id: index,
  }))

const HotRecommend: FC<IProps & RouteComponentProps> = props => {
  const [list, setList] = useState<any[]>(tempList) // 推荐列表

  // 获取热门推荐列表
  useEffect(() => {
    http
      .recommendPlaylist(8)
      .then(res => {
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
          <div className='key' onClick={() => handleClickTitle('')}>
            热门推荐
          </div>
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
          return <PlayListItem item={item} key={item.id}></PlayListItem>
        })}
      </div>
    </div>
  )
}

HotRecommend.defaultProps = {}

export default withRouter(memo(HotRecommend))
