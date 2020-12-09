// 切换页面后回到顶部
// 前置路由守卫

// 类组件写法
// import React from 'react'
// import { RouteComponentProps, withRouter } from 'react-router-dom'

// interface IProps extends RouteComponentProps {}

// class BeforeEach extends React.Component<IProps, {}> {
//   componentDidUpdate(preProps: IProps) {
//     if (this.props.location.pathname !== preProps.location.pathname) {
//       // 滚动到顶部
//       document.querySelector('#root > .app')?.scrollTo(0, 0)
//     }
//   }

//   // state: IState = {}

//   render() {
//     return this.props.children
//   }
// }

// export default withRouter(BeforeEach)

// 函数组件写法
import { FC, ReactElement, useEffect } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'

interface IProps extends RouteComponentProps {}

const BeforeEach: FC<IProps> = props => {
  useEffect(() => {
    // 滚动到顶部
    document.querySelector('#root > .app')?.scrollTo(0, 0)
  }, [props.location.pathname])
  return props.children as ReactElement
}

BeforeEach.defaultProps = {}

export default withRouter(BeforeEach)
