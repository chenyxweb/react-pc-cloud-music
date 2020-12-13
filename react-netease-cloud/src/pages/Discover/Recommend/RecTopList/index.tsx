// 发现音乐 - 推荐 - 榜单

import React, { FC } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'

import styles from './index.module.scss'

interface IProps extends RouteComponentProps {}

const RecTopList: FC<IProps> = props => {
  // 跳转到排行榜页面
  const ToTopList = () => props.history.push('/discover/toplist')

  return (
    <div className={styles.RecTopList}>
      {/* title */}
      <div className={styles.title}>
        <div className={styles.left}>
          <div className='key' onClick={ToTopList}>
            榜单
          </div>
        </div>
        <div className={styles.right} onClick={ToTopList}>
          更多
        </div>
      </div>
    </div>
  )
}

RecTopList.defaultProps = {}

export default withRouter(RecTopList)
