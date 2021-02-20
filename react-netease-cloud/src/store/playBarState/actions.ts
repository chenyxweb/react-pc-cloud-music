// action creator

import { IAction } from 'store'
import { CHANGE_IS_PLAY, START_IS_PLAY, STOP_IS_PLAY } from './actionTypes'

export const change_is_play = (): IAction => ({ type: CHANGE_IS_PLAY })
export const start_is_play = (): IAction => ({ type: START_IS_PLAY })
export const stop_is_play = (): IAction => ({ type: STOP_IS_PLAY })
