import { IAction } from 'store'
import { CHANGE_CURRENT_SONG_INFO } from './actionTypes'

export const currentSongInfoReducer = (state: any = {}, action: IAction) => {
  switch (action.type) {
    case CHANGE_CURRENT_SONG_INFO:
      return action.payload

    default:
      return state
  }
}
