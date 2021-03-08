// 用户相关信息
import { axios } from './axios'

/**
 * 获取用户详情
 */
const getUserDetail = (uid: number) => axios.get(`/user/detail?uid=${uid}`)

//
/**
 * 获取用户信息 , 歌单，收藏，mv, dj 数量
 */
const getUserInfoCount = () => axios.get('/user/subcount')

/**
 * 获取用户歌单
 * uid: 用户 id
 * limit: 单页数量 默认为 30
 * offset: 偏移数量，用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 */
const getUserSongList = (params: { uid: number; limit?: number; offset?: number }) =>
  axios.get('/user/playlist', { params })

/**
 * 获取用户播放记录
 * uid: 用户 id
 * 可选参数 : type : type=1 时只返回 weekData, type=0 时返回 allData
 */
const getUserRecord = (params: { uid: number; type?: number }) => axios.get('/user/record', { params })

const userApi = { getUserDetail, getUserInfoCount, getUserSongList, getUserRecord }

export default userApi
