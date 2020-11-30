// 封装axios
import Axios from 'axios'
import { message } from 'antd'

// 接口基地址
// export const BASE_URL = 'http://123.57.176.198:3000/'
export const BASE_URL = '/'

// 创建实例
export const axios = Axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
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
    const data = response.data || {}
    if (data.code === 200) {
      // 请求成功,返回数据
      return response.data.result
    } else if (data.code === 402) {
      // 其他状态码的处理
      // 弹框提示
      // 如果登录失效, 引入router实例 跳转到登录页 router.push('/login')
    } else {
      // 弹框提示 系统请求异常
      message.error('系统请求异常')
    }
  },
  function (err) {
    // 处理响应错误
    if (err.message.search('timeout') !== -1) {
      err.message = '请求超时，请保持良好的网络环境。'
    } else {
      err.message = '系统请求异常'
    }
    // 弹框提示
    message.error(err.message)

    return Promise.reject(err)
  }
)
