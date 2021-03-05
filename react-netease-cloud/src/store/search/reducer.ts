import { IAction } from 'store'
import { UPDATE_INPUT_VALUE, UPDATE_SEARCH_TYPE } from './actionTypes'

export const searchReducer = (state = { inputValue: '陈', searchType: '1014' }, action: IAction) => {
  switch (action.type) {
    case UPDATE_INPUT_VALUE:
      return {
        ...state,
        inputValue: action.payload,
      }

    case UPDATE_SEARCH_TYPE:
      return {
        ...state,
        searchType: action.payload,
      }

    default:
      return { ...state }
  }
}
