// 集中管理接口
import { axios } from './axios'

// 搜索
export const search = (keywords: string) => axios.get(`/search?keywords=${keywords}`)

// --------------------------- 发现音乐 - 推荐
/**
 * 获取banner轮播图
 */
export const banner = () => axios.get('/banner')

/**
 * 获取热门推荐
 * @param limit 查询条数
 */
export const hotRecommend = (limit: number) => axios.get(`/personalized?limit=${limit}`)
