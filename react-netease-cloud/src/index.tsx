// 入口文件
import React from 'react'
import ReactDom from 'react-dom'
// import { ConfigProvider } from 'antd'
// import zhCN from 'antd/es/locale/zh_CN'
import App from './App'
// import 'moment/locale/zh-cn'
import './index.scss'
import configStore from './store/index'
import { Provider } from 'react-redux'

const store = configStore()

// ReactDom.render(
//   <ConfigProvider locale={zhCN}>
//       <App />
//   </ConfigProvider>,
//   document.getElementById('root')
// )

ReactDom.render(
  <Provider store={store}>
    <App />
  </Provider>,

  document.getElementById('root')
)

console.log('env: ', process.env)
