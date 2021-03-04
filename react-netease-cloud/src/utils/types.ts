import constants from './constants'

// 搜索类型key的联合类型
export type TypeSearch = keyof typeof constants.searchTypeEnum

// 新碟区域的联合类型
export type DiskAreaType = keyof typeof constants.diskAreaEnum
