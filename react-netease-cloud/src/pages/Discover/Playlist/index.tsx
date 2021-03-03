// 发现音乐 - 歌单
import React, { FC, useCallback, useEffect, useState } from 'react'
import { Button, Pagination, Popover, Select, Spin, Tag } from 'antd'
import { RouteConfigComponentProps } from 'react-router-config'
import http from 'service/http'
import qs from 'qs'
import PlayListItem from 'components/PlayListItem'
import styles from './index.module.scss'

interface IProps {}

interface IPlaylistItem {
  id: number
  [key: string]: string | number
}

interface IOption {
  label: string
  value: string
  children?: IOption[]
}

const Playlist: FC<IProps & RouteConfigComponentProps> = (props) => {
  // console.log(props)

  const qString = qs.parse(props.location.search.split('?')[1])

  const cat = (qString?.cat as string) || '' // 歌单分类
  // 分页相关
  const [order, setOrder] = useState<'new' | 'hot'>('hot') // 歌单分类
  const [pageSize, setPageSize] = useState(35) // 每页数量
  // offset计算方法: (pageNum-1)*pageSize
  const [pageNum, setPageNum] = useState(1) // 当前页数
  const [total, setTotal] = useState(0) // 总条数
  const [playlist, setPlaylist] = useState<IPlaylistItem[]>([]) // playlist歌单列表
  const [cateOptions, setCateOptions] = useState<IOption[]>() // 歌单分类选项数据

  const [popoverVisible, setPopoverVisible] = useState(false) // 选择分类 popover的显隐
  const [listLoading, setListLoading] = useState(false) // 获取歌单loading

  // 获取歌单分类
  useEffect(() => {
    http.homeApi
      .getPlaylistCateList()
      .then((res) => {
        if (res.data.code === 200) {
          const { categories, sub } = res.data || {}
          // console.log(categories, sub)
          let cateOptions: IOption[] = []
          if (categories?.[0] && sub?.length) {
            cateOptions = Object.keys(categories).map((key) => ({
              label: categories[key],
              value: categories[key],
              children: [],
            }))
            // 添加children
            sub?.forEach((item: any) => {
              const cateOption = cateOptions.find((i) => i.value === categories[item.category])
              cateOption?.children?.push({ label: item?.name, value: item?.name })
            })
          }

          // console.log(cateOptions)
          setCateOptions(cateOptions)
        }
      })
      .catch(() => {})
  }, [])

  // 获取某类歌单列表
  useEffect(() => {
    setListLoading(true)
    http.homeApi
      .getTopPlayList({ cat, order, limit: pageSize, offset: (pageNum - 1) * pageSize })
      .then((res) => {
        // console.log(res)
        if (res.data.code === 200) {
          const { playlists, total } = res.data || {}
          setPlaylist(playlists)
          setTotal(total)
          setListLoading(false)
        }
      })
      .catch(() => {})
  }, [cat, order, pageSize, pageNum])

  // 点击分类tag
  const handleTagClick = useCallback(
    (item: IOption) => {
      // 修改url
      props.history.replace(`/discover/playlist?cat=${encodeURIComponent(item.value)}`)
      // 关闭 popover
      setPopoverVisible(false)
    },
    [props.history]
  )

  // 点击全部分类
  const handleClickAll = () => {
    // 修改url
    props.history.replace(`/discover/playlist?cat=`)
    // 关闭 popover
    setPopoverVisible(false)
  }

  // 分页器改变
  const handlePaginationChange = (page: number, pageSize?: number | undefined) => {
    console.log(page, pageSize)
    setPageNum(page)
    pageSize && setPageSize(pageSize)
  }

  // ----------------------- 渲染元素 -----------------------------
  // 渲染 分类选择器
  const renderCategory = useCallback(() => {
    // console.log('cateOptions', cateOptions)
    return (
      <div className={styles.category}>
        {cateOptions?.map((item) => {
          return (
            <div className={styles.categoryItem} key={item.value}>
              <div className="left">{item.value}</div>
              <div className="right">
                {item.children?.map((i) => (
                  <Tag onClick={() => handleTagClick(i)} className={cat === i.value ? 'active' : ''} key={i.value}>
                    {i.value}
                  </Tag>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }, [cat, cateOptions, handleTagClick])

  return (
    <div className={styles.Playlist}>
      <div className={['w980', styles.PlaylistWrapper].join(' ')}>
        {/* title */}
        <div className={styles.title}>
          <h3 style={{ fontSize: 24, paddingRight: 8 }}>{cat || '全部'}</h3>
          <Popover
            trigger="click"
            placement="bottomLeft"
            // align={{ offset: [-50] }}
            content={renderCategory()}
            title={
              <Button size="small" onClick={handleClickAll}>
                全部分类
              </Button>
            }
            visible={popoverVisible}
            onVisibleChange={(visible) => setPopoverVisible(visible)}
          >
            <Button size="small" type="primary">
              选择分类
            </Button>
          </Popover>
          <Select size="small" value={order} className={styles.select} onChange={(value) => setOrder(value)}>
            <Select.Option value="hot">热门</Select.Option>
            <Select.Option value="new">最新</Select.Option>
          </Select>
        </div>

        {/* 歌单列表 */}
        <Spin spinning={listLoading}>
          <div className={styles.listWrapper}>
            {playlist.map((item, index) => {
              return (
                <div className={styles.itemWrapper} key={index}>
                  <PlayListItem item={item}></PlayListItem>
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

export default Playlist
