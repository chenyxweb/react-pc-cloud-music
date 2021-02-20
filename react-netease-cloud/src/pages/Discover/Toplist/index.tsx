// 发现音乐 - 排行榜
import React, { FC, memo, useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import http from 'service/http'
import constants from 'utils/constants'

import styles from './index.module.scss'

interface IProps {}

const Toplist: FC<IProps & RouteComponentProps<{ id: string }>> = props => {
  console.log(props)
  const { match, location, history } = props
  const [list1, setList1] = useState<any[]>([]) // 云音乐特色榜
  const [list2, setList2] = useState<any[]>([]) // 全球媒体榜

  // 获取排行榜
  useEffect(() => {
    http
      .getTopList()
      .then(res => {
        // console.log(res)
        if (res.data.code === 200) {
          const list = res.data.list || []
          const ToplistType = ['S', 'N', 'O', 'H'] // 云音乐特色榜
          const list1: any[] = []
          const list2: any[] = []

          list.forEach((item: any) => {
            if (ToplistType.includes(item.ToplistType)) {
              list1.push(item)
            } else {
              list2.push(item)
            }
          })

          console.log('list1: ', list1)
          console.log('list2: ', list2)

          setList1(list1)
          setList2(list2)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <div className={[styles.Toplist, 'w980'].join(' ')}>
      <div className={styles.ToplistList}>
        {/* 云音乐特色榜 */}
        <h3>云音乐特色榜</h3>
        <div className='list1'>
          {list1.map(item => {
            return (
              <div className={`list-item ${Number(match.params?.id) === item?.id ? 'active' : ''}`} key={item.id}>
                <img
                  className='list-item-img'
                  src={item.coverImgUrl + '?param=40y40'}
                  alt=''
                  title={item.description}
                />
                <div className='list-item-desc'>
                  <p className='list-item-desc-t ellipsis-1'>{item.name}</p>
                  <p className='list-item-desc-b ellipsis-1'>{item.updateFrequency}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* 全球媒体榜 */}
        <h3>全球媒体榜</h3>
        <div className='list2'>
          {list2.map(item => {
            return (
              <div className='list-item' key={item.id}>
                <img
                  className='list-item-img'
                  src={item.coverImgUrl + '?param=40y40'}
                  alt=''
                  title={item.description}
                />
                <div className='list-item-desc'>
                  <p className='list-item-desc-t ellipsis-1'>{item.name}</p>
                  <p className='list-item-desc-b ellipsis-1'>{item.updateFrequency}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className={styles.ToplistContent}></div>
    </div>
  )
}

export default memo(Toplist)
