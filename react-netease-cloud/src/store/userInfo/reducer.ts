import { IAction } from 'store'
import { UPDATE_USER_INFO } from './actionTypes'

const initState = {
  username: '',
  avatar: '',
  token: '',
  authRoutes: [],
}

export const userInfoReducer = (state = initState, action: IAction) => {
  switch (action.type) {
    // 更新用户信息
    case UPDATE_USER_INFO:
      return { ...state, ...action.payload }

    default:
      return state
  }
}
