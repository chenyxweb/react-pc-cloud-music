// actions creator  指挥者(要干什么)

import http from 'service/http'
import { change_current_song_info } from 'store/currentSongInfo/actions'
import { ADD_SONG_LIST_ITEM, DEL_SONG_LIST_ITEM, CLEAR_SONG_LIST, REPLACE_SONG_LIST } from './actionTypes'

// 添加一首歌
export const add_song_list_item = (listItem: any) => ({ type: ADD_SONG_LIST_ITEM, payload: listItem })

// 删除一首歌
export const del_song_list_item = (songId: number) => ({ type: DEL_SONG_LIST_ITEM, payload: songId })

// 清空播放列表
export const clear_song_list = () => ({ type: CLEAR_SONG_LIST })

// 替换播放列表
export const replace_song_list = (list: any[]) => ({ type: REPLACE_SONG_LIST, payload: list })

/**
 * 根据歌单id获取歌单列表,并替换原来的列表;
 * redux-thunk 的使用
 * @param id 歌单id
 */
export const replace_song_list_async = (id: number, callback?: Function) => {
  return (dispatch: any) => {
    // 异步操作
    http
      .getPlaylistDetail({ id })
      .then(res => {
        if (res.data.code === 200) {
          const list = res.data.playlist?.tracks || []
          // ...
          // 同步的dispatch
          dispatch(replace_song_list(list)) // 修改songList
          if (list.length) {
            dispatch(change_current_song_info(list[0])) // 修改当前播放歌曲为第一项

            callback && callback(list)
          }
        }
      })
      .catch(() => {})
  }
}
