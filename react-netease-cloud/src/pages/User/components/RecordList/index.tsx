// 听歌排行列表组件

import { message, Select, Spin } from 'antd'
import RecordListItem from 'components/RecordListItem'
import React, { FC, memo, useCallback, useEffect, useState } from 'react'
import { RouteConfigComponentProps } from 'react-router-config'
import { withRouter } from 'react-router-dom'
import http from 'service/http'
import styles from './index.module.scss'

// const recordListInit = Array(10).fill({}) // 占位

interface IProps {
  showAll?: boolean // 是否展示全部列表 , 默认最多展示10条数据
  showMoreBtn?: boolean // 是否展示查看更多按钮
}

const RecordList: FC<IProps & RouteConfigComponentProps<{ userId: string }>> = (props) => {
  const { showMoreBtn, showAll } = props

  const [recordList, setRecordList] = useState<any[]>([]) // 播放记录列表
  const [recordType, setRecordType] = useState<1 | 0>(1) // 1 最近一周, 0 所有时间
  const [fetching, setFetching] = useState(false) // 正在获取播放记录列表

  // 获取用户 播放记录
  useEffect(() => {
    const uid = Number(props.match.params?.userId)
    if (!uid) return

    setFetching(true)

    http.userApi
      .getUserRecord({ uid, type: recordType })
      .then((res) => {
        if (res.data.code === 200) {
          const { weekData, allData } = res.data || {}
          const list = recordType === 1 ? weekData : allData
          if (showAll) {
            // 是否展示全部列表
            setRecordList(list || [])
          } else {
            setRecordList(list?.slice(0, 10) || [])
          }
          setFetching(false)
        } else {
          message.error('无权限访问')
          setFetching(false)
        }
      })
      .catch(() => {
        setFetching(false)
      })
  }, [props.match.params?.userId, showAll, recordType])

  // 查看更多
  const handleMore = useCallback(() => {
    const userId = props.match.params?.userId
    if (!userId) return

    props.history.push(`/user/record-list-detail/${userId}`)
  }, [props.history, props.match.params?.userId])

  return recordList?.length ? (
    <div className={styles.RecordList}>
      <div className={styles.recordListTitle}>
        <span className="text">听歌排行</span>
        <Select value={recordType} bordered={false} onChange={(value) => setRecordType(value)}>
          <Select.Option value={1}>最近一周</Select.Option>
          <Select.Option value={0}>所有时间</Select.Option>
        </Select>
      </div>
      <div className={styles.recordListWrapper}>
        <Spin spinning={fetching}>
          {recordList.map((item, index) => {
            return (
              <RecordListItem
                style={{ backgroundColor: index % 2 ? '#f7f7f7' : '' }}
                key={item?.song?.id || index}
                item={item}
                index={index + 1}
              ></RecordListItem>
            )
          })}
        </Spin>
      </div>

      {/* 查看更多 */}
      {showMoreBtn ? (
        <div className={styles.recordListMore}>
          <span onClick={handleMore}>查看更多{'>'}</span>
        </div>
      ) : null}
    </div>
  ) : null
}

RecordList.defaultProps = {
  showAll: false,
  showMoreBtn: false,
}

export default memo(withRouter(RecordList))
