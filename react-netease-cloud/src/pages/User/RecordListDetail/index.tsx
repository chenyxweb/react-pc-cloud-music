// 听歌排行详情

import React, { FC } from 'react'
import RecordList from '../components/RecordList'
import styles from './index.module.scss'

interface IProps {}

const RecordListDetail: FC<IProps> = (props) => {
  return (
    <div className={styles.RecordListDetail}>
      {/* 听歌排行 */}
      <RecordList showAll></RecordList>
    </div>
  )
}

RecordListDetail.defaultProps = {}

export default RecordListDetail
