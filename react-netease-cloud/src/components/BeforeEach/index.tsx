// 切换页面后回到顶部
// 前置路由守卫
import routes from 'config/routes'
import { matchRoutes } from 'react-router-config'

import React from 'react'
import { FC, ReactElement, useEffect } from 'react'
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

interface IProps {
  userInfo: any
}

const BeforeEach: FC<IProps & RouteComponentProps> = props => {
  const {
    children,
    location: { pathname },
    userInfo,
  } = props

  // 滚动到顶部
  useEffect(() => {
    // console.log(props)
    document.querySelector('#root > .app')?.scrollTo(0, 0)
  }, [pathname])

  //
  // 获取要访问页面的路由信息
  const route = matchRoutes(routes, pathname).find(item => item.route.path === pathname)

  console.log('所有匹配到的路由: ', matchRoutes(routes, pathname))
  console.log('根据pathname匹配到的路由: ', route)

  // 访问login,和needAuth为false或空的页面放行
  if (route?.route?.path === '/login' || !route?.route?.meta?.requiresAuth) {
    return children as ReactElement
  }

  // // 访问needAuth为true的页面,判断是否登录,然后用户对应角色是否有该页面访问权限
  if (route?.route?.meta?.requiresAuth) {
    if (!userInfo.token) {
      return <Redirect to={`/login?from=${route.route.path}`}></Redirect>
    } else {
      return children as ReactElement
    }
  }

  return null
}

BeforeEach.defaultProps = {}

// map store
const mapStateToProps = (state: any) => {
  return {
    userInfo: state.userInfo,
  }
}

export default withRouter(connect(mapStateToProps)(BeforeEach))
