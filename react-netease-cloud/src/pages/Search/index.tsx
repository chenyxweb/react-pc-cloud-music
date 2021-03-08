import React, { FC, memo, useCallback, useEffect, useRef, useState } from 'react'
import { Empty, Input, Spin, Tabs } from 'antd'
import styles from './index.module.scss'
import constants from 'utils/constants'
import { TypeSearch } from 'utils/types'

import SongList from './SongList'
import ArtistList from './ArtistList'
import AlbumList from './AlbumList'
import MVList from './MVList'
import LyricList from './LyricList'
import PlayList from './PlayList'
import DJList from './DJList'
import UserList from './UserList'
import VideoList from './VideoList'
import http from 'service/http'
import { connect, DispatchProp } from 'react-redux'
import { ICombineState } from 'store'
import { update_input_value, update_search_type } from 'store/search/action'

const { TabPane } = Tabs

const totalTextMapArr = [
  { type: '1', text: '首单曲' },
  { type: '100', text: '位歌手' },
  { type: '10', text: '张专辑' },
  { type: '1014', text: '个视频' },
  { type: '1006', text: '个歌词' },
  { type: '1000', text: '个歌单' },
  { type: '1009', text: '个电台' },
  { type: '1002', text: '个用户' },
  { type: '1004', text: '个MV' },
  // { type: '1018', text: '综合' },
]

interface IProps {}

const Search: FC<IProps & Pick<ICombineState, 'search'> & DispatchProp> = (props) => {
  const {
    search: { inputValue, searchType },
  } = props

  // const [inputValue, setInputValue] = useState('陈') // input value
  // const [searchType, setSearchType] = useState<TypeSearch>('1') // 搜索类别
  const [list, setList] = useState<any[]>([]) // 列表
  const [pageSize, setPageSize] = useState(50)
  const [pageNum, setPageNum] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  // 获取列表信息
  useEffect(() => {
    if (!inputValue.trim()) return

    setLoading(true)
    http.homeApi
      .getSearch({
        keywords: inputValue,
        type: searchType,
        limit: pageSize,
        offset: (pageNum - 1) * pageSize,
      })
      .then((res) => {
        if (res.data.code === 200) {
          switch (searchType) {
            // 单曲
            // 歌词
            case '1':
            case '1006':
              const { songCount, songs } = res.data.result || {}
              setTotal(songCount || 0)
              setList(songs || [])
              break

            // 歌手
            case '100':
              const { artistCount, artists } = res.data.result || {}
              setTotal(artistCount || 0)
              setList(artists || [])
              break

            // 专辑
            case '10':
              const { albumCount, albums } = res.data.result || {}
              setTotal(albumCount || 0)
              setList(albums || [])
              break

            // 视频
            case '1014':
              const { videoCount, videos } = res.data.result || {}
              setTotal(videoCount || 0)
              setList(videos || [])
              break

            // 歌单
            case '1000':
              const { playlistCount, playlists } = res.data.result || {}
              setTotal(playlistCount || 0)
              setList(playlists || [])
              break

            // 电台
            case '1009':
              const { djRadiosCount, djRadios } = res.data.result || {}
              setTotal(djRadiosCount || 0)
              setList(djRadios || [])
              break

            // // 用户
            case '1002':
              const { userprofileCount, userprofiles } = res.data.result || {}
              setTotal(userprofileCount || 0)
              setList(userprofiles || [])
              break

            // MV
            case '1004':
              const { mvCount, mvs } = res.data.result || {}
              setTotal(mvCount || 0)
              setList(mvs || [])
              break

            default:
              break
          }

          setLoading(false)
        }
      })
      .catch(() => {})
  }, [inputValue, pageNum, pageSize, searchType])

  // 初始化展示数据
  useEffect(() => {
    setList([])
    setPageNum(1)
  }, [inputValue, searchType])

  // enter或者点击搜索
  const handleOnSearch = (value: string) => {
    props.dispatch(update_input_value(value))
    // setInputValue(value)
  }

  // tabs改变
  const handleOnTabChange = (activeKey: string) => {
    if (activeKey === searchType) return
    setList([])
    // setSearchType(activeKey as TypeSearch)
    props.dispatch(update_search_type(activeKey as TypeSearch))
  }

  // 渲染组件
  const renderListComponent = useCallback(() => {
    if (!list.length) return <Empty style={{ paddingTop: 100 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />

    switch (searchType) {
      case '1':
        return <SongList list={list} />
      case '100':
        return <ArtistList list={list} />
      case '10':
        return <AlbumList list={list} />
      case '1014':
        return <VideoList list={list} />
      case '1006':
        return <LyricList list={list} />
      case '1000':
        return <PlayList list={list} />
      case '1009':
        return <DJList list={list} />
      case '1002':
        return <UserList list={list} />
      case '1004':
        return <MVList list={list} />
      default:
        return null
    }
  }, [list, searchType])

  return (
    <div className={`${styles.Search} w980`}>
      {/* 搜索 */}
      <div className={styles.searchBox}>
        <Input.Search
          defaultValue={inputValue}
          allowClear
          size="large"
          placeholder="请输入关键词"
          onSearch={handleOnSearch}
        ></Input.Search>
      </div>

      {/* total text */}
      <div className={styles.totalText}>
        {list?.length ? (
          <span>
            搜索“{inputValue}”，找到 {total} {totalTextMapArr.find((item) => item.type === searchType)?.text}
          </span>
        ) : null}
      </div>

      {/* list */}
      <div className={styles.list}>
        <Tabs type="card" activeKey={searchType} centered onChange={handleOnTabChange}>
          {totalTextMapArr.map((item) => {
            return <TabPane tab={constants.searchTypeEnum[item.type as TypeSearch]} key={item.type}></TabPane>
          })}
        </Tabs>

        {/* list-container */}
        <Spin spinning={loading}>
          <div className={styles.listWrapper}>
            {/* 根据searchType判断渲染什么组件 */}
            {renderListComponent()}
          </div>
        </Spin>
      </div>
    </div>
  )
}

Search.defaultProps = {}

// map state
const mapStateToProps = (state: ICombineState) => {
  return {
    search: state.search,
  }
}

export default connect(mapStateToProps)(memo(Search))
