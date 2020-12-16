// actions creator  指挥者(要干什么)

import { ADD_SONG_LIST_ITEM, DEL_SONG_LIST_ITEM, CLEAR_SONG_LIST, REPLACE_SONG_LIST } from './actionTypes'

// 添加一首歌
export const add_song_list_item = (listItem: any) => ({ type: ADD_SONG_LIST_ITEM, payload: listItem })

// 删除一首歌
export const del_song_list_item = (songId: number) => ({ type: DEL_SONG_LIST_ITEM, payload: songId })

// 清空播放列表
export const clear_song_list = () => ({ type: CLEAR_SONG_LIST })

// 替换播放列表
export const replace_song_list = (list: any[]) => ({ type: REPLACE_SONG_LIST, payload: list })
