// 发现音乐 - 推荐 - 榜单

import { FolderAddOutlined, PlayCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { message } from 'antd'
import React, { FC, useEffect, useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import http from 'service/http'

import styles from './index.module.scss'

interface IProps extends RouteComponentProps {}

const RecTopList: FC<IProps> = props => {
  const [list1, setList1] = useState<any>({}) // 飙升榜
  const [list2, setList2] = useState<any>({}) // 新歌榜
  const [list3, setList3] = useState<any>({}) // 原创歌曲榜

  // 获取飙升榜
  useEffect(() => {
    http
      .getPlaylistDetail({ id: 19723756 })
      .then(res => {
        if (res.data.code === 200) {
          setList1(res.data.playlist || [])
        }
      })
      .catch(() => {})
  }, [])

  // 获取新歌榜
  useEffect(() => {
    http
      .getPlaylistDetail({ id: 3779629 })
      .then(res => {
        if (res.data.code === 200) {
          setList2(res.data.playlist || [])
        }
      })
      .catch(() => {})
  }, [])

  // 获取原创歌曲榜
  useEffect(() => {
    http
      .getPlaylistDetail({ id: 2884035 })
      .then(res => {
        if (res.data.code === 200) {
          setList3(res.data.playlist || [])
        }
      })
      .catch(() => {})
  }, [])

  // 跳转到排行榜页面
  const ToTopList = (id?: number) => props.history.push(id ? `/discover/toplist?id=${id}` : '/discover/toplist')

  return (
    <div className={styles.RecTopList}>
      {/* title */}
      <div className={styles.title}>
        <div className={styles.left}>
          <div className='key' onClick={() => ToTopList()}>
            榜单
          </div>
        </div>
        <div className={styles.right} onClick={() => ToTopList()}>
          更多
        </div>
      </div>
      {/* 榜单 */}
      <div className={styles.toplist}>
        {/* 飙升榜 1 */}
        <div className={styles.up}>
          {/* logo */}
          <div className='logo'>
            <img src={list1.coverImgUrl} alt='' title={list1.name} onClick={() => ToTopList(list1.id)} />
            <div className='text'>
              <div className='name' onClick={() => ToTopList(list1.id)}>
                {list1.name}
              </div>
              <div className='btns'>
                <PlayCircleOutlined title='播放' className='icon' />
                <FolderAddOutlined title='收藏' className='icon' onClick={() => message.info('暂无此功能')} />
              </div>
            </div>
          </div>
          {/* list */}
          <div className='list'>
            {list1.tracks?.slice(0, 10).map((item: any, index: number) => {
              return (
                <div className='list-item' key={item.id}>
                  <div className={`list-item-num ${index <= 2 ? 'red' : ''}`}>{index + 1}</div>
                  <div className='list-item-name ellipsis-1'>{item.name}</div>
                  <div className='list-item-btns'>
                    <PlayCircleOutlined title='播放' className='icon' />
                    <PlusOutlined title='添加到播放列表' className='icon' />
                    <FolderAddOutlined title='收藏' className='icon' onClick={() => message.info('暂无此功能')} />
                  </div>
                </div>
              )
            })}
            <div className='list-item'>
              <span className='look-all' onClick={() => ToTopList(list1.id)}>
                查看全部{' >'}
              </span>
            </div>
          </div>
        </div>

        {/* 新歌榜 2 */}
        <div className={styles.new}>
          <div className='logo'>
            <img src={list2.coverImgUrl} alt='' title={list2.name} onClick={() => ToTopList(list2.id)} />
            <div className='text'>
              <div className='name' onClick={() => ToTopList(list2.id)}>
                {list2.name}
              </div>
              <div className='btns'>
                <PlayCircleOutlined className='icon' />
                <FolderAddOutlined className='icon' onClick={() => message.info('暂无此功能')} />
              </div>
            </div>
          </div>
          {/* list */}
          <div className='list'>
            {list2.tracks?.slice(0, 10).map((item: any, index: number) => {
              return (
                <div className='list-item' key={item.id}>
                  <div className={`list-item-num ${index <= 2 ? 'red' : ''}`}>{index + 1}</div>
                  <div className='list-item-name ellipsis-1'>{item.name}</div>
                  <div className='list-item-btns'>
                    <PlayCircleOutlined title='播放' className='icon' />
                    <PlusOutlined title='添加到播放列表' className='icon' />
                    <FolderAddOutlined title='收藏' className='icon' onClick={() => message.info('暂无此功能')} />
                  </div>
                </div>
              )
            })}
            <div className='list-item'>
              <span className='look-all active' onClick={() => ToTopList(list2.id)}>
                查看全部{' >'}
              </span>
            </div>
          </div>
        </div>

        {/* 原创歌曲榜 3 */}
        <div className={styles.origin}>
          <div className='logo'>
            <img src={list3.coverImgUrl} alt='' title={list3.name} onClick={() => ToTopList(list3.id)} />
            <div className='text'>
              <div className='name' onClick={() => ToTopList(list3.id)}>
                {list3.name}
              </div>
              <div className='btns'>
                <PlayCircleOutlined className='icon' />
                <FolderAddOutlined className='icon' onClick={() => message.info('暂无此功能')} />
              </div>
            </div>
          </div>
          {/* list */}
          <div className='list'>
            {list3.tracks?.slice(0, 10).map((item: any, index: number) => {
              return (
                <div className='list-item' key={item.id}>
                  <div className={`list-item-num ${index <= 2 ? 'red' : ''}`}>{index + 1}</div>
                  <div className='list-item-name ellipsis-1'>{item.name}</div>
                  <div className='list-item-btns'>
                    <PlayCircleOutlined title='播放' className='icon' />
                    <PlusOutlined title='添加到播放列表' className='icon' />
                    <FolderAddOutlined title='收藏' className='icon' onClick={() => message.info('暂无此功能')} />
                  </div>
                </div>
              )
            })}
            <div className='list-item'>
              <span className='look-all' onClick={() => ToTopList(list3.id)}>
                查看全部{' >'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

RecTopList.defaultProps = {}

export default withRouter(RecTopList)
