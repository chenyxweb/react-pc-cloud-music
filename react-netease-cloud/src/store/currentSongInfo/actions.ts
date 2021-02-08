import { IAction } from 'store'
import { CHANGE_CURRENT_SONG_INFO } from './actionTypes'

export const change_current_song_info = (item: any): IAction => ({ type: CHANGE_CURRENT_SONG_INFO, payload: item })
