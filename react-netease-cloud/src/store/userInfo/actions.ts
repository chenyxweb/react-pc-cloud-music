import { IAction } from 'store'
import { UPDATE_USER_INFO } from './actionTypes'

// 更新用户信息
export const update_user_info = (userInfo: any): IAction => ({ type: UPDATE_USER_INFO, payload: userInfo })
