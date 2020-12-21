// 集中管理接口
import { axios } from './axios'

// 搜索建议
const getSearchSuggest = (keywords: string, type?: 'mobile') =>
  axios.get('/search/suggest', { params: { keywords, type } })

// 搜索
const getSearch = (keywords: string) => axios.get(`/cloudsearch?keywords=${keywords}`)

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

/**
 * 获取歌手列表
 */
const getArtistList = (params: {
  limit?: number // 查询条数
  area?: 7 | 96 | 8 | 16 | 0 // 华语,欧美,日本,韩国,其他
  type?: 1 | 2 | 3 // 男,女,乐队
}) => axios.get('/artist/list', { params })

/**
 * 获取歌单详情
 */
const getPlaylistDetail = (params: {
  id?: number // 19723756 | 3779629 | 2884035 | 3778678  // 云音乐飙升榜 | 云音乐新歌榜 | 网易原创歌曲榜 | 热歌榜
}) => axios.get('/playlist/detail', { params })

// 热门主播
// const getDJToplistPopular = () => axios.get('/dj/toplist/popular?limit=5')

/**
 * 获取排行榜
 */
const getTopList = () => axios.get('/toplist')

/**
 * 获取音乐url
 * @param id 歌曲id
 */
const getSongUrl = (id: number) => axios.get(`/song/url?id=${id}`)

//
//
// ------------------------- 统一导出 -------------------------
const http = {
  getSearchSuggest,
  getSearch,
  banner,
  hotRecommend,
  recommendPlaylist,
  newDisk,
  getLyric,
  getArtistList,
  getPlaylistDetail,
  // getDJToplistPopular,
  getTopList,
  getSongUrl,
}

export default http
