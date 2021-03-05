import { IAction } from 'store'
import { TypeSearch } from 'utils/types'
import { UPDATE_INPUT_VALUE, UPDATE_SEARCH_TYPE } from './actionTypes'

interface IState {
  inputValue: string
  searchType: TypeSearch
}

export const searchReducer = (state: IState = { inputValue: '陈', searchType: '1' }, action: IAction) => {
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
