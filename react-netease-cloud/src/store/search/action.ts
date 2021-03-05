import { TypeSearch } from 'utils/types'
import { UPDATE_INPUT_VALUE, UPDATE_SEARCH_TYPE } from './actionTypes'

export const update_input_value = (inputValue: string) => ({ type: UPDATE_INPUT_VALUE, payload: inputValue })
export const update_search_type = (searchType: TypeSearch) => ({ type: UPDATE_SEARCH_TYPE, payload: searchType })
