import { Button } from 'antd'
import React, { FC } from 'react'
import { connect, DispatchProp } from 'react-redux'
import { update_user_info } from 'store/userInfo/actions'
import qs from 'qs'
import styles from './index.module.scss'
import { withRouter } from 'react-router-dom'
import { RouteConfigComponentProps } from 'react-router-config'

interface IProps {}

const Login: FC<IProps & DispatchProp & RouteConfigComponentProps> = props => {
  // 登录
  const handleLogin = () => {
    const userInfo = {
      username: 'admin',
      avatar: '',
      token: 'AHASDFSJFASNF_13123SDAF',
      authRoutes: [],
    }

    // 用户信息存store,存localStorage
    props.dispatch(update_user_info(userInfo))
    localStorage.setItem('USER_INFO', JSON.stringify(userInfo))

    // 获取from页面
    const search = props.location.search || ''
    const queryObj = qs.parse(search.split('?')[1]) || {}

    if (queryObj.from) {
      // 去from页面
      props.history.replace(queryObj.from as string)
    } else {
      // 去首页
      props.history.replace('/')
    }
  }

  return (
    <div className={styles.Login}>
      Login
      <Button onClick={handleLogin}>登录</Button>
    </div>
  )
}

Login.defaultProps = {}

export default withRouter(connect()(Login))
