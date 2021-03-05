// 视频相关
import { axios } from './axios'

/**
 * 获取mv详情
 * 必选参数 : id: mv的id
 *
 */
const getMVDetail = (id: string) => axios.get(`/mv/detail?mvid=${id}`)

/**
 * 获取 mv 地址
 * 必选参数 : id: mv的id
 * 可选参数 : r: 分辨率,默认1080,可从 /mv/detail 接口获取分辨率列表
 */
const getMVUrl = (params: { id: string; r?: number }) => axios.get('/mv/url', { params })

const videoApi = {
  getMVDetail,
  getMVUrl,
}
export default videoApi
