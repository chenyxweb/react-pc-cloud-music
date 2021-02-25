// user

import React, { FC, memo } from 'react'
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config'
import styles from './index.module.scss'

interface IProps {}

const User: FC<IProps & RouteConfigComponentProps> = (props) => {
  // console.log(props)

  return (
    <div className={[styles.User, 'w980'].join(' ')}>
      {/* 路由出口 */}
      {renderRoutes(props.route?.routes)}
    </div>
  )
}

User.defaultProps = {}

export default memo(User)
