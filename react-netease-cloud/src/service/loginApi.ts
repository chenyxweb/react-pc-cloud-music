// login相关

import { axios } from './axios'

/**
 * 手机号登录
 */
const phoneLogin = (data: any) => axios.post('/login/cellphone', data)

/**
 * 邮箱登录 接口登录报错 TODO
 */
const emailLogin = (data: any) => axios.post('/login', data)

// 二维码登录 ---start
// 说明: 二维码登录涉及到3个接口,调用务必带上时间戳,防止缓存***

/**
 * 二维码key生成接口, 拿到key
 */
const generateQrKey = () => axios.get(`/login/qr/key?timestamp=${Date.now()}`)

/**
 * 二维码生成接口, 使用key获取二维码
 * 说明: 调用此接口传入上一个接口生成的key可生成二维码图片的base64和二维码信息,可使用base64展示图片,或者使用二维码信息内容自行使用第三方二维码生产库渲染二维码
 */
const generateQrCode = (params: { key: string; qrimg?: string }) =>
  axios.get(`/login/qr/create?timestamp=${Date.now()}`, { params })

/**
 * 二维码检测扫码状态接口
 * 说明: 轮询此接口可获取二维码扫码状态,800为二维码过期,801为等待扫码,802为待确认,803为授权登录成功(803状态码下会返回cookies)
 */
const checkQrStatus = (params: { key: string }) => axios.get(`/login/qr/check?timestamp=${Date.now()}`, { params })
// 二维码登录 ---end

/**
 * 获取登录状态, 同时可以拿到用户信息
 */
const getLoginStatus = () => axios.get(`/login/status?timestamp=${Date.now()}`)

/**
 * 退出登录
 */
const logout = () => axios.get('/logout')

const loginApi = {
  phoneLogin,
  emailLogin,
  generateQrKey,
  generateQrCode,
  checkQrStatus,
  getLoginStatus,
  logout,
}

export default loginApi
