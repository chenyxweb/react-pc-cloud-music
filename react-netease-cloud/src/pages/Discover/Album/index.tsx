// 发现音乐 - 新碟上架
import { Pagination, Spin } from 'antd'
import DiskItem from 'components/DiskItem'
import React, { FC, useEffect, useState } from 'react'
import { RouteConfigComponentProps } from 'react-router-config'
import http from 'service/http'
import constants from 'utils/constants'
import { DiskAreaType } from 'utils/types'
import styles from './index.module.scss'

interface IProps {}

const Album: FC<IProps & RouteConfigComponentProps> = () => {
  const [hotList, setHotList] = useState([]) // 热门新碟列表

  const [allList, setAllList] = useState([]) // 全部新碟列表
  const [diskArea, setDiskArea] = useState<DiskAreaType>('ALL') // 全部新碟筛选区域
  const [pageSize, setPageSize] = useState(35) // 每页条数
  const [pageNum, setPageNum] = useState(1) // 页数
  const [total, setTotal] = useState(0) // 总数
  const [listLoading, setListLoading] = useState(false) // fetch loading

  // 获取热门新碟
  useEffect(() => {
    http.homeApi
      .newDisk()
      .then((res) => {
        // console.log(res)
        if (res.data.code === 200) {
          const list = res.data?.albums || []
          setHotList(list.slice(0, 10))
        }
      })
      .catch(() => {})
  }, [])

  // 获取全部新碟
  useEffect(() => {
    setListLoading(true)
    http.homeApi
      .getAllNewDisk({ area: diskArea, limit: pageSize, offset: (pageNum - 1) * pageSize })
      .then((res) => {
        // console.log(res)
        if (res.data.code === 200) {
          const { total, albums } = res.data || {}
          setTotal(total)
          setAllList(albums || [])
          setListLoading(false)
        }
      })
      .catch(() => {})
  }, [diskArea, pageNum, pageSize])

  // 分页器改变
  const handlePaginationChange = (page: number, pageSize?: number | undefined) => {
    // console.log(page, pageSize)
    setPageNum(page)
    pageSize && setPageSize(pageSize)

    // 滚动到顶部
    // const app = document.querySelector('#root > .app')
    // app && app.scrollTo(0, 0)
    window.scrollTo(0, 580)
  }

  return (
    <div className={`${styles.Album} w980`}>
      {/* 热门新碟 */}
      <div className={styles.hot}>
        <div className="title common-title">
          <span className="fz-24">热门新碟</span>
        </div>
        <div className="content">
          {hotList.map((item, index) => {
            return (
              <div className="disk-item" key={index}>
                <DiskItem item={item} size="middle"></DiskItem>
              </div>
            )
          })}
        </div>
      </div>

      {/* 全部新碟 */}
      <div className={styles.all}>
        <div className="title common-title">
          <span className="fz-24">全部新碟</span>
          <div className="tabs">
            {Object.keys(constants.diskAreaEnum).map((k) => {
              const key = k as DiskAreaType
              return (
                <div
                  className={['tabs-item', diskArea === key ? 'active' : ''].join(' ')}
                  key={key}
                  onClick={() => {
                    setDiskArea(key)
                    setPageNum(1)
                  }}
                >
                  {constants.diskAreaEnum[key]}
                </div>
              )
            })}
          </div>
        </div>
        {/* list */}
        <Spin spinning={listLoading}>
          <div className="content all-list-content">
            {allList.map((item, index) => {
              return (
                <div className="disk-item" key={index}>
                  <DiskItem item={item} size="middle"></DiskItem>
                </div>
              )
            })}
          </div>
        </Spin>

        {/* 分页器 */}
        <div className={styles.pagination}>
          <Pagination
            total={total}
            pageSize={pageSize}
            pageSizeOptions={['10', '15', '20', '25', '30', '35']}
            showSizeChanger
            showQuickJumper
            current={pageNum}
            onChange={handlePaginationChange}
          ></Pagination>
        </div>
      </div>
    </div>
  )
}

export default Album
