// user

import React, { FC, memo, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config'
import http from 'service/http'
import { ICombineState } from 'store'
import styles from './index.module.scss'

interface IProps {}

const User: FC<IProps & RouteConfigComponentProps & Pick<ICombineState, 'userInfo'>> = props => {
  // console.log(props)
  const { userInfo } = props

  return (
    <div className={[styles.User, 'w980'].join(' ')}>
      {/* profile */}
      <div className={styles.userProfile}>
        <div className='avatar'>
          <img src={userInfo?.profile?.avatarUrl + '?param=182y182'} alt='' />
        </div>
        <div className='detailInfo'>
          <div className='detailInfo-top'>{userInfo?.profile?.nickname}</div>

          <div className='detailInfo-bot'></div>
        </div>
      </div>
      {/* 路由出口 */}
      {renderRoutes(props.route?.routes)}
    </div>
  )
}

User.defaultProps = {}

// map store
const mapStateToProps = (state: ICombineState) => {
  return {
    userInfo: state.userInfo,
  }
}

export default memo(connect(mapStateToProps)(User))
