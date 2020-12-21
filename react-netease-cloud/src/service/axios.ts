// 封装axios
import Axios from 'axios'
import { message } from 'antd'

// 接口基地址设置
let BASE_URL = ''
switch (process.env.REACT_APP_MODE) {
  case 'dev':
  case 'build':
    BASE_URL = 'http://123.57.176.198:3000'
    // BASE_URL = 'http://localhost:2333/musicApi' // 本地
    break

  case 'build_wbj':
    BASE_URL = 'http://www.wbjazy.com:2333/musicApi' // WBJ
    break

  default:
    break
}

export { BASE_URL }

// 创建实例
export const axios = Axios.create({
  baseURL: BASE_URL,
  // timeout: 8000,
})

// 添加请求拦截器
axios.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    if (response.status !== 200) {
      message.destroy()
      message.error('系统错误')
    }

    return response
  },
  function (err) {
    // 处理响应错误
    if (err.message.search('timeout') !== -1) {
      err.message = '请求超时，请保持良好的网络环境。'
    } else {
      err.message = '系统请求异常'
    }
    // 弹框提示
    message.destroy()
    message.error(err.message)

    return Promise.reject(err)
  }
)
