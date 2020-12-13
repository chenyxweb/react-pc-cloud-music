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

/**
 * 获取歌词
 * @param id 歌曲id
 */
const getLyric = (id: number) => axios.get(`/lyric?id=${id}`)

interface getArtistListParams {
  limit?: number // 查询条数
  area?: 7 | 96 | 8 | 16 | 0 // 华语,欧美,日本,韩国,其他
  type?: 1 | 2 | 3 // 男,女,乐队
}
/**
 * 获取歌手列表
 *
 */
const getArtistList = (params: getArtistListParams) => axios.get('/artist/list', { params })

//
//
// ------------------------- 统一导出 -------------------------
const http = {
  search,
  banner,
  hotRecommend,
  recommendPlaylist,
  newDisk,
  getLyric,
  getArtistList,
}

export default http
