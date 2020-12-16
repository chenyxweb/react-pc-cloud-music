// reducer 执行者(怎么干)

import { IAction } from 'store'
import { ADD_SONG_LIST_ITEM, DEL_SONG_LIST_ITEM, CLEAR_SONG_LIST, REPLACE_SONG_LIST } from './actionTypes'

export const songListReducer = (state: any[] = [], action: IAction) => {
  switch (action.type) {
    case ADD_SONG_LIST_ITEM: // 添加一首歌 --> 点击页面+号, 点击播放歌曲
      return [...state, action.payload]

    case DEL_SONG_LIST_ITEM:
      return state.filter(item => item.id !== action.payload)

    case CLEAR_SONG_LIST: // 清空播放列表 --> 点击清空按钮
      return []

    case REPLACE_SONG_LIST: // 替换播放列表 --> 点击播放歌单
      return action.payload

    default:
      return state
  }
}
