// 集中管理接口
import { axios } from './axios'

// 搜索
const search = (keywords: string) => axios.get(`/search?keywords=${keywords}`)

// --------------------------- 发现音乐 - 推荐 ---------------------------------------------------

/**
 * banner轮播图
 */
const banner = () => axios.get('/banner')

/**
 * 热门推荐
 * @param limit 查询条数
 */
const hotRecommend = (limit: number) => axios.get(`/personalized?limit=${limit}`)

/**
 * 推荐歌单
 * @param limit 查询条数
 */
const recommendPlaylist = (limit: number) => axios.get(`/personalized?limit=${limit}`)

/**
 * 新碟上架
 */
const newDisk = () => axios.get('/album/newest')

// 统一导出
const http = {
  search,
  banner,
  hotRecommend,
  recommendPlaylist,
  newDisk,
}

export default http
