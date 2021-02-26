// 发现音乐 - 歌单
import React, { FC, useCallback, useEffect, useState } from 'react'
import { Button, Cascader, Popover, Select, Tag } from 'antd'
import { RouteConfigComponentProps } from 'react-router-config'
import http from 'service/http'
import qs from 'qs'
import styles from './index.module.scss'
import { CascaderOptionType, CascaderValueType } from 'antd/lib/cascader'
import { DownOutlined } from '@ant-design/icons'

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
  console.log(props)

  const qString = qs.parse(props.location.search.split('?')[1])

  const cat = (qString?.cat as string) || '' // 歌单分类
  // 分页相关
  const [order, setOrder] = useState<'new' | 'hot'>('hot') // 歌单分类
  const [pageCount, setPageCount] = useState(35) // 每页数量
  // offset计算方法: (pageNum-1)*pageCount
  const [pageNum, setPageNum] = useState(1) // 当前页数
  const [total, setTotal] = useState(0) // 总条数
  const [playlist, setPlaylist] = useState<IPlaylistItem[]>() // playlist歌单列表
  const [cateOptions, setCateOptions] = useState<IOption[]>() // 歌单分类选项数据

  // 获取歌单分类
  useEffect(() => {
    http.homeApi
      .getPlaylistCateList()
      .then((res) => {
        if (res.data.code === 200) {
          const { categories, sub } = res.data || {}
          console.log(categories, sub)
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

          console.log(cateOptions)
          setCateOptions(cateOptions)
        }
      })
      .catch(() => {})
  }, [])

  // 获取某类歌单列表
  useEffect(() => {
    http.homeApi
      .getTopPlayList({ cat, order, limit: pageCount, offset: (pageNum - 1) * pageCount })
      .then((res) => {
        // console.log(res)
        if (res.data.code === 200) {
          const { playlists, total } = res.data || {}
          setPlaylist(playlists)
          setTotal(total)
        }
      })
      .catch(() => {})
  }, [cat, order, pageCount, pageNum])

  // 点击分类tag
  const handleTagClick = useCallback(
    (item: IOption) => {
      props.history.replace(`/discover/playlist?cat=${encodeURIComponent(item.value)}`)
    },
    [props.history]
  )

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
          <h3 style={{ fontSize: 24, paddingRight: 8 }}>全部</h3>
          <Popover
            trigger="click"
            placement="bottomLeft"
            // align={{ offset: [-50] }}
            content={renderCategory()}
            title={<Button size="small">全部分类</Button>}
          >
            <Button size="small" type="primary">
              选择分类
            </Button>
          </Popover>
          <Select size="small" value={order} className={styles.select}>
            <Select.Option value="hot">热门</Select.Option>
            <Select.Option value="new">最新</Select.Option>
          </Select>
        </div>

        {/* 歌单列表 */}
        <div className={styles.listWrapper}></div>

        {/* 分页器 */}
        <div className={styles.pagination}></div>
      </div>
    </div>
  )
}

export default Playlist
