// 主页api
import { DiskAreaType, TypeSearch } from 'utils/types'
import { axios } from './axios'

// 搜索建议
const getSearchSuggest = (keywords: string, type?: 'mobile') =>
  axios.get('/search/suggest', { params: { keywords, type } })

/**
 * 搜索(全)
 * keywords 关键词
 * type 搜索类型, 默认 1 单曲;
 * limit 每页条数, 默认 30
 * offset 偏移量 用于分页, 默认 0
 */
const getSearch = (params: { keywords: string; type?: TypeSearch; limit?: number; offset?: number }) =>
  axios.get(`/cloudsearch`, { params })

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
 * 热门新碟上架
 */
const newDisk = () => axios.get('/album/newest')

/**
 * 全部新碟
 * area : ALL:全部,ZH:华语,EA:欧美,KR:韩国,JP:日本
 * limit : 返回数量 , 默认为 30
 * offset : 偏移数量，用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 */
const getAllNewDisk = (params: { area: DiskAreaType; limit?: number; offset?: number }) =>
  axios.get('/album/new', { params })

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
 * 获取歌单分类
 */
const getPlaylistCateList = () => axios.get('/playlist/catlist')

/**
 * 歌单 ( 网友精选碟 )
 * 获取某分类所有歌单
 *
 * order: 可选值为 'new' 和 'hot', 分别对应最新和最热 , 默认为 'hot'
 * cat: 分类信息 默认全部
 * limit: 单页数量 默认为 50
 * offset: 偏移数量，用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 */
const getTopPlayList = (params: { cat?: string; order?: 'new' | 'hot'; limit?: number; offset?: number }) =>
  axios.get('/top/playlist', { params })

/**
 * 获取歌单详情
 */
const getPlaylistDetail = (params: {
  id: number // 19723756 | 3779629 | 2884035 | 3778678  // 云音乐飙升榜 | 云音乐新歌榜 | 网易原创歌曲榜 | 热歌榜
}) => axios.get('/playlist/detail', { params })

/**
 * 获取专辑详情
 */
const getAlbumInfo = (id: number) => axios.get(`/album?id=${id}`)

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

const homeApi = {
  getSearchSuggest, // 搜索建议
  getSearch, // 搜索(全)
  banner, // banner轮播图
  hotRecommend, // 热门推荐
  recommendPlaylist, // 推荐歌单
  newDisk, // 热门新碟
  getAllNewDisk, // 获取全部新碟
  getLyric, // 获取歌词
  getArtistList, // 获取歌手列表
  getPlaylistCateList, // 获取歌单分类
  getTopPlayList, //
  getPlaylistDetail, // 获取歌单详情
  getAlbumInfo, // 获取专辑详情
  getTopList, // 获取排行榜
  getSongUrl, // 获取音乐url
}

export default homeApi
