import { IAction } from 'store'
import { CHANGE_IS_PLAY, START_IS_PLAY, STOP_IS_PLAY } from './actionTypes'

export const playBarStateReducer = (state: any = {}, action: IAction) => {
  switch (action.type) {
    // toggle
    case CHANGE_IS_PLAY:
      return { ...state, isPlay: !state.isPlay }

    // start
    case START_IS_PLAY:
      return { ...state, isPlay: true }

    // stop
    case STOP_IS_PLAY:
      return { ...state, isPlay: false }

    default:
      return state
  }
}
