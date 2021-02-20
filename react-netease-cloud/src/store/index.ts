// 配置store

import { combineReducers, createStore, applyMiddleware } from 'redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

// 导入初始化数据
import initialData from 'assets/data/data.json'

// 导入所有reducer
import { songListReducer } from './songList/reducer'
import { currentSongInfoReducer } from './currentSongInfo/reducer'
import constants from 'utils/constants'
import { playBarStateReducer } from './playBarState/reducer'
import { userInfoReducer } from './userInfo/reducer'

export interface IAction {
  type: string
  payload?: any
}

// store 的数据类型
export interface ICombineState {
  songList: any[]
  currentSongInfo: any
  playBarState: { isPlay: boolean }
  userInfo: { isLogin: boolean; profile: any; account: any }
}

// 将创建好的中间件或者第三方的中间件，作为参数传递给 applyMiddleware
const middlewares = process.env.NODE_ENV === 'production' ? applyMiddleware(thunk) : applyMiddleware(logger, thunk)

const configStore = () => {
  // 合并reducer
  const reducer = combineReducers({
    songList: songListReducer,
    currentSongInfo: currentSongInfoReducer,
    playBarState: playBarStateReducer,
    userInfo: userInfoReducer,
  })

  // 拿本地存储
  const songList = JSON.parse(localStorage.getItem(constants.SONG_LIST) || '[]')
  const currentSongInfo = JSON.parse(localStorage.getItem(constants.CURRENT_SONG_INFO) || '{}')
  const userInfo = JSON.parse(localStorage.getItem(constants.USER_INFO) || '{}')

  // 创建store
  // 参数1 : reducer
  // 参数2 : 初始值, 初始值可以放在每个reducer中, 也可以放在createStore的第二个参数
  // 参数3 : 中间件 将redux-devtool和中间件合并
  const store = createStore(
    reducer,
    {
      songList: songList.length > 0 ? songList : initialData.songList,
      currentSongInfo: currentSongInfo.name ? currentSongInfo : initialData.currentSongInfo,
      playBarState: { isPlay: false },
      userInfo: userInfo,
    },
    composeWithDevTools(middlewares)
  )

  // 监听store的改变, 效率低
  store.subscribe(() => {
    console.log('store当前状态:', store.getState())
    const { songList, currentSongInfo, userInfo } = store.getState()
    // 保存到本地
    localStorage.setItem(constants.SONG_LIST, JSON.stringify(songList))
    localStorage.setItem(constants.CURRENT_SONG_INFO, JSON.stringify(currentSongInfo))
    localStorage.setItem(constants.USER_INFO, JSON.stringify(userInfo))
  })

  // 返回store
  return store
}

export default configStore
