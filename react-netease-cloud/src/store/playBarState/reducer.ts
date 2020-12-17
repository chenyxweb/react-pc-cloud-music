import { IAction } from 'store'
import { CHANGE_IS_PLAY } from './actionTypes'

export const playBarStateReducer = (state: any = {}, action: IAction) => {
  switch (action.type) {
    case CHANGE_IS_PLAY:
      return { ...state, isPlay: !state.isPlay }

    default:
      return state
  }
}
