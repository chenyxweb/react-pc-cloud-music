# react-netease-cloud

## 相关

官方网站 : https://music.163.com/#

参考网站 : [www.wanguancs.top](http://www.wanguancs.top/)

参考api地址 : https://binaryify.github.io/NeteaseCloudMusicApi/#/?id=neteasecloudmusicapi

掘金接口地址 : http://123.57.176.198:3000/

本地服务接口地址 : http://localhost:2333/

## 技术点

### 1 轮播背景实现

```css
// imageUrl+?imageView&blur=40x20 获取模糊背景, 设置背景样式
background: url() center center/6000px   // 背景位置/背景大小
```

### 2 React.memo 

```
// 性能优化
如果你的组件在相同 props 的情况下渲染相同的结果，那么你可以通过将其包装在 React.memo 中调用，以此通过记忆组件渲染结果的方式来提高组件的性能表现。这意味着在这种情况下，React 将跳过渲染组件的操作并直接复用最近一次渲染的结果

// 和  React.pureComponent 类似

// 区别
类组件 - pureComponent - state 和 props
函数组件 - memo - props

// 当props和state较为简单时才使用, 比较好, 因为仅仅做浅层对比
```

### 3 跳转页面回到顶端功能

```tsx
// 定义组件

// 切换页面后回到顶部
// 前置路由守卫

import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'

interface IProps extends RouteComponentProps {}

class BeforeEach extends React.Component<IProps, {}> {
  componentDidUpdate(preProps: IProps) {
    if (this.props.location.pathname !== preProps.location.pathname) {
      // 滚动到顶部
      document.querySelector('#root > .app')?.scrollTo(0, 0)
    }
  }

  // state: IState = {}

  render() {
    return this.props.children
  }
}

export default withRouter(BeforeEach)

```

```tsx
// 使用组件

<Router>
  <BeforeEach>
    <Route path='/' component={Home}></Route>
  </BeforeEach>
</Router>
```

### 4 歌曲播放相关功能

https://blog.csdn.net/gongstrong123/article/details/50339249

歌曲时长  dt 字段

#### 4.1 歌曲播放暂停

```js
  // 播放和暂停
  useEffect(() => {
    if (isPlay) {
      audioRef.current?.play()
    } else {
      audioRef.current?.pause()
    }
  }, [isPlay])
```

#### 4.2 显示播放进度

```tsx
  <audio
    ref={audioRef}
    onTimeUpdate={handleOnTimeUpdate}
    // autoPlay
    preload='auto'
    src={`https://music.163.com/song/media/outer/url?id=${currentSongInfo.id}.mp3`}
  ></audio>

  // 当前播放时间发生改变的时候, 同步播放进度
  const handleOnTimeUpdate = (event: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    // console.log(event)
    const currentTime = event.currentTarget.currentTime // 当前播放时间 s
    // currentSongInfo.dt // ms
    const percent = +((currentTime * 1000) / currentSongInfo.dt).toFixed(3)
    if (percent === process) return // 两次时间相同
    console.log('播放进度:', percent)
    setProcess(percent)
  }
```

#### 4.3 调节播放进度

```ts
<Slider
  value={process}
  min={0}
  max={1}
  step={0.001}
  tooltipVisible={false}
  onChange={handleProcessSliderDrag}
/> 

  // audio播放 -> 设置process bar -> 通过useEffect监听process改变设置audio播放进度  反向设置的时候不准确,这种方式不合理导致声音卡顿, 使用如下方式设置监听bar的拖拽
  // 拖拽进度条
  const handleProcessSliderDrag = (value: number) => {
    console.log(value)
    // 1 设置当前播放进度
    setProcess(value)
    // 2 设置audio的播放时间
    // currentSongInfo.dt 总时长 ms
    const time = (value * currentSongInfo.dt) / 1000
    if (audioRef.current) {
      audioRef.current.currentTime = time
    }
  }
```

#### 4.4 调节播放音量

```tsx
<Slider
    min={0}
    max={1}
    step={0.01}
    vertical
    value={volume}
    tipFormatter={(value?: number | undefined) => (value && value * 100)?.toFixed(0)}
    onChange={(value: number) => setVolume(value)}
  />

  // 设置audio的音量以及初始音量 mounted 和 update
  useEffect(() => {
    // 设置audio的音量
    if (audioRef.current) {
      audioRef.current.volume = volume
      console.log('audio音量: ', audioRef.current.volume)
    }
  }, [volume])
```

#### 4.5 重新播放功能

```tsx
  // 重新播放当前歌曲
  const handleRePlay = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play()
    }
  }
```

#### 4.6 顺序播放/随机播放/单曲循环功能

```tsx
  <audio
    ref={audioRef}
    onTimeUpdate={handleOnTimeUpdate} // 播放时间更新时触发
    onEnded={handleOnEnded} // 播放结束时触发
    // autoPlay
    preload='auto'
    src={`https://music.163.com/song/media/outer/url?id=${currentSongInfo.id}.mp3`}
  ></audio>

```

#### 4.7 切换歌曲逻辑

```
1. 修改audio的src
2. 监听onCanPlay事件 缓冲至目前可以播放的状态, 
调用 isPlay &&  audioRef.current.play()  // 过早的play会导致音乐没有准备号报错
```

#### 4.8 本地存储歌曲列表

```ts
// 存数据

// 监听store的改变
  store.subscribe(() => {
    // console.log('store当前状态:', store.getState())
    const { songList, currentSongInfo } = store.getState()
    // 保存到本地
    localStorage.setItem(constants.SONG_LIST, JSON.stringify(songList))
    localStorage.setItem(constants.CURRENT_SONG_INFO, JSON.stringify(currentSongInfo))
  })
```

```tx
  // 拿本地存储
  const songList = JSON.parse(localStorage.getItem(constants.SONG_LIST) || '[]')
  const currentSongInfo = JSON.parse(localStorage.getItem(constants.CURRENT_SONG_INFO) || '{}')
```

#### 4.9 快捷键

```ts
  // 上/下一曲 播放暂停快捷键
  // onkeypress  字母数字键才会触发
  // 每次更新都需要重新运行useEffect , 不然记住的是以前的数据
  useEffect(() => {
    window.onkeyup = (e: KeyboardEvent) => {
      // console.log(e)
      if (e.ctrlKey && e.code === 'ArrowRight') {
        // ctrl + → 下一首
        console.log('下一首')
        handleClickNextBtn()
      }

      if (e.ctrlKey && e.code === 'ArrowLeft') {
        // ctrl + ← 上一首
        console.log('上一首')
        handleClickPrevBtn()
      }

      if (e.code === 'KeyP') {
        console.log('播放/暂停')
        props.change_is_play()
      }
    }
	
    // 每次需要清除事件
    return () => {
      window.onkeyup = null
    }
  })
```

#### 4.9 歌曲,歌词切换时列表自动居中当前播放歌曲

```js
  // 歌曲列表当前项滚动居中
  useEffect(() => {
    const songListItemElement = document.querySelector('.songList-content .songList-item.active')
    if (songListItemElement) {
      songListItemElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [currentSongInfo.id])
```

#### 4.10 改写歌曲和歌词滚动条

```scss
  :global {
    // 自定义滚动条
    .custom-scroll-bar {
      /*修改滚动条样式*/
      &::-webkit-scrollbar {
        width: 6px; // 横向滚动条宽度
        height: 6px; // 纵向滚动条高度
        background-clip: padding-box;
      }
      &::-webkit-scrollbar-track {
        background: #000;
        border-radius: 2px;
      }
      &::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 3px;
      }
      &::-webkit-scrollbar-thumb:hover {
        background: #aaa;
      }
    }
  }
```

#### 4.11 点击playBar外部, 自动隐藏歌词和歌曲列表

```ts
// 封装hook

// 点击传入的组件外时触发回调的hook
import { useEffect, RefObject } from 'react'

const useClickOutsideComponent = (ref: RefObject<HTMLElement>, callback: Function) => {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // console.log(e.target)
      // 如果 dom 中没有这个节点 或者这个节点包括了点击的这个元素 return
      if (!ref.current || ref.current.contains(e.target as HTMLElement)) return
      callback()
    }

    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [callback, ref])
}

export default useClickOutsideComponent

```

```tsx
  // 点击playBar外部
  useClickOutsideComponent(playBarRef, () => {
    // 关闭歌词和歌曲列表
    listBoxShow && setListBoxShow(false)
  })
```

#### 4.13 获取歌词高亮项

```scss
// 歌词渐变    
.lyric-item {
      padding: 0 15px;
      height: 32px;
      text-align: center;
      color: #989898;
      line-height: 32px;
      font-size: 12px;
      overflow: hidden;
      transition: font-size 0.5s, color 1s;

      &.active {
        color: #fff;
        font-size: 14px;
      }
    }
```

```ts
// // 封装hook
// 获取当前高亮歌词索引 的 hook

import { LyricArrType } from 'components/PlayBar'
import { throttle } from 'lodash-es'
import { useEffect, useRef, useState } from 'react'

/**
 * 获取当前高亮歌词索引
 * @param currentTime 当前播放时间 s
 * @param totalTime 歌曲总时间 ms
 * @param lyricArr 歌词数组
 * @returns [index] 当前高亮歌词索引
 */
const useActiveLyricIndex = (currentTime: number, totalTime: number, lyricArr: LyricArrType) => {
  const [index, setIndex] = useState(0) // 当前激活的歌词索引

  // 节流 方法一
  // const throttleFn = useCallback(
  //   throttle(callback => {
  //     callback && callback()
  //   }, 300),
  //   []
  // )

  // 节流 方法二
  // 保持每次更新节流函数不变
  const throttleFnRef = useRef({
    fn: throttle(callback => {
      callback && callback()
    }, 500),
  })

  useEffect(() => {
    throttleFnRef.current.fn(() => {
      if (!lyricArr.length) return

      const tempIndex = lyricArr.findIndex(item => item.totalTime >= currentTime * 1000)

      // 如果找到的index>0 或者找到的index和原来的index不相等 就设置新的index
      if (tempIndex > 0 && tempIndex - 1 !== index) {
        // console.log(index)
        setIndex(tempIndex - 1)
      }
    })
  }, [currentTime, totalTime, lyricArr, index])

  // 返回currentActiveIndex
  return [index]
}

export default useActiveLyricIndex

```

#### 4.14 歌曲无法播放时, 自动下一首

```tsx
// 给audio注册onError事件  //  当在元素加载期间发生错误时运行脚本

  const handleOnError = (event: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    message.error('歌曲无法播放')
    handleClickNextBtn() // 点击下一首按钮
  }
```

#### 4.15 歌单歌词列表背景图片

```tsx
style={{background:`rgba(31, 31, 31, 0.9)  url('${currentSongInfo?.al?.picUrl}') no-repeat center center/986px `}} // 居中 宽度撑满
```



### 5 资源访问

```
js内  使用@访问根目录
css内 使用~访问根目录

```
### 6 封装Transition 动画组件
```tsx
// index.tsx
// 动画组件

import React, { FC } from 'react'
import { CSSTransition } from 'react-transition-group'
import { CSSTransitionProps } from 'react-transition-group/CSSTransition'
import './index.scss'

interface IProps {
  /** 动画名称 */
  mode?: 'scale' | 'fade'
}

const MyTransition: FC<IProps & CSSTransitionProps> = props => {
  const { mode, children, ...restProps } = props
  return (
    <CSSTransition classNames={`transition-${mode}`} {...restProps}>
      {children}
    </CSSTransition>
  )
}

MyTransition.defaultProps = {
  mode: 'fade',
}

export default MyTransition


```

```scss
// index.scss

// 动画
// 当 in 属性指定成 true 时, 目标元素先添加 -enter 类名, 随后马上添加 -enter-active ; 
// timeout 时间结束后, 删除 -enter 和 -enter-active 类名
// 当 in 属性设置成 false 时, 同理...

// -enter -enter-active
// -enter-done
// -exit -exit-active
// exit-done

// scale 动画
.transition-scale-enter {
  display: block !important;
  opacity: 0;
  transform: scale(0.8);
}

.transition-scale-enter-active {
  opacity: 1;
  transform: translateX(0);
  transition: opacity 300ms, transform 300ms;
}

.transition-scale-enter-done {
  display: block !important;
}

.transition-scale-exit {
  display: block !important;
  opacity: 1;
}

.transition-scale-exit-active {
  opacity: 0;
  transform: scale(0.8);
  transition: opacity 300ms, transform 300ms;
}

// fade动画
.transition-fade-enter {
  display: block !important;
  opacity: 0;
}
.transition-fade-enter-active {
  opacity: 1;
  transition: opacity 300ms;
}
.transition-fade-enter-done {
  display: block !important;
}
.transition-fade-exit {
  display: block !important;
  opacity: 1;
}
.transition-fade-exit-active {
  opacity: 0;
  transition: opacity 300ms;
}

```
```tsx
// 使用

// 控制 voiceBarShow 的 true 或 false

<MyTransition mode="scale" in={voiceBarShow} timeout={300}>
  <div className='voice-bar'>
    <div style={{ height: 110 }}>
      <Slider vertical />
    </div>
  </div>
</MyTransition>
```

### 7 使用dayjs格式化歌曲时长

```js
// 由于 new Date(0) // 为 Thu Jan 01 1970 08:00:00 GMT+0800 (中国标准时间)
// 可以传入毫秒数进行格式化歌曲时长
dayjs(item.dt).format('mm:ss')
```

###  8 redux标准使用 (以网易云音乐为例)
#### 1 安装
```bash
npm i redux react-redux redux-devtools-extension redux-logger redux-thunk
```

#### 2 目录结构

根据角色划分reducer 歌单列表, 当前歌曲信息 ...
```
-- store
    -- songList
        -- reducer.ts // 执行者 (如何操作数据)
        -- actions.ts // 指挥者 (操作什么数据)
        -- actionTypes.ts
    -- currentSongInfo
        -- reducer.ts
        -- actions.ts
        -- actionTypes.ts
    -- index.ts // 配置store
```

#### 3 定义store

- store/songList文件夹 歌曲列表
```ts
// songList/actionTypes.ts

export const ADD_SONG_LIST_ITEM = 'ADD_SONG_LIST_ITEM' // 添加一首歌 --> 点击页面+号, 点击播放歌曲
export const DEL_SONG_LIST_ITEM = 'DEL_SONG_LIST_ITEM' // 删除一首歌
export const CLEAR_SONG_LIST = 'CLEAR_SONG_LIST' // 清空播放列表 --> 点击清空按钮
export const REPLACE_SONG_LIST = 'REPLACE_SONG_LIST' // 替换播放列表 --> 点击播放歌单

```

```ts
// songList/reducer.ts

// reducer 执行者(怎么干)

import { IAction } from 'store'
import { ADD_SONG_LIST_ITEM, DEL_SONG_LIST_ITEM, CLEAR_SONG_LIST, REPLACE_SONG_LIST } from './actionTypes'

export const songListReducer = (state: any[] = [], action: IAction) => {
  switch (action.type) {
    case ADD_SONG_LIST_ITEM: // 添加一首歌 --> 点击页面+号, 点击播放歌曲
      return [...state, action.payload]

    case DEL_SONG_LIST_ITEM:
      return state.filter(item => item.id !== action.payload)

    case CLEAR_SONG_LIST: // 清空播放列表 --> 点击清空按钮
      return []

    case REPLACE_SONG_LIST: // 替换播放列表 --> 点击播放歌单
      return action.payload

    default:
      return state
  }
}

```

```ts
// actions creator  指挥者(要干什么)

import http from 'service/http'
import { change_current_song_info } from 'store/currentSongInfo/actions'
import { ADD_SONG_LIST_ITEM, DEL_SONG_LIST_ITEM, CLEAR_SONG_LIST, REPLACE_SONG_LIST } from './actionTypes'

// 添加一首歌
export const add_song_list_item = (listItem: any) => ({ type: ADD_SONG_LIST_ITEM, payload: listItem })

// 删除一首歌
export const del_song_list_item = (songId: number) => ({ type: DEL_SONG_LIST_ITEM, payload: songId })

// 清空播放列表
export const clear_song_list = () => ({ type: CLEAR_SONG_LIST })

// 替换播放列表
export const replace_song_list = (list: any[]) => ({ type: REPLACE_SONG_LIST, payload: list })

/**
 * 根据歌单id获取歌单列表,并替换原来的列表;
 * redux-thunk 的使用
 * @param id 歌单id
 */
export const replace_song_list_async = (id: number, callback?: Function) => {
  return (dispatch: any) => {
    // 异步操作
    http
      .getPlaylistDetail({ id })
      .then(res => {
        if (res.data.code === 200) {
          const list = res.data.playlist?.tracks || []
          // ...
          // 同步的dispatch
          dispatch(replace_song_list(list)) // 修改songList
          if (list.length) {
            dispatch(change_current_song_info(list[0])) // 修改当前播放歌曲为第一项

            callback && callback(list)
          }
        }
      })
      .catch(() => {})
  }
}


```

- store/currentSongInfo文件夹 当前播放歌曲信息

```ts
// currentSongInfo/actionTypes.ts
export const CHANGE_CURRENT_SONG_INFO = 'CHANGE_CURRENT_SONG_INFO' // 修改当前歌曲信息

```

```ts
// currentSongInfo/reducer.ts

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

```

```ts
// currentSongInfo/actions.ts

import { CHANGE_CURRENT_SONG_INFO } from './actionTypes'

export const change_current_song_info = (item: any) => ({ type: CHANGE_CURRENT_SONG_INFO, payload: item })


```
- store/index.ts文件
```ts
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

export interface IAction {
  type: string
  payload: any
}

export interface ICombineState {
  songList: any[]
  currentSongInfo: any
}

// 将创建好的中间件或者第三方的中间件，作为参数传递给 applyMiddleware
const middlewares = applyMiddleware(logger, thunk)

const configStore = () => {
  // 合并reducer
  const reducer = combineReducers({
    songList: songListReducer,
    currentSongInfo: currentSongInfoReducer,
  })

  // 创建store
  // 参数1 : reducer
  // 参数2 : 初始值, 初始值可以放在每个reducer中, 也可以放在createStore的第二个参数
  // 参数3 : 中间件 将redux-devtool和中间件合并
  const store = createStore(
    reducer,
    {
      songList: initialData.songList || [],
      currentSongInfo: initialData.currentSongInfo || {},
    },
    composeWithDevTools(middlewares)
  )

  // 监听store的改变
  store.subscribe(() => {
    console.log('store当前状态:', store.getState())
  })

  // 返回store
  return store
}

export default configStore

```

#### 4 页面或组件中使用

```tsx
// PlayBar/index.tsx
import { clear_song_list, del_song_list_item } from 'store/songList/actions'
// ...

interface IProps {
  clear_song_list: () => any
  del_song_list_item: (songId: number) => any
}

const PlayBar: FC<IProps & ICombineState> = props => {


  // 清空播放列表
  const handleClearSongList = () => {
    if (!songList.length) return
    props.clear_song_list()
    message.success('列表已清空')
  }

  // 删除一首歌曲
  const delSongListItem = (songId: number) => {
    props.del_song_list_item(songId)
    message.success('删除成功')
  }
  
  // ......
  
  
  
  return <div>...</div>

}


// redux 映射 (或者将redux映射工作提取到容器组件里面去 PlayBar/index.container.tsx)
// 映射state
const mapStateToProps = (state: ICombineState) => {
  // console.log(state)
  return {
    songList: state.songList,
    currentSongInfo: state.currentSongInfo,
  }
}

// 映射dispatch
const mapDispatchToProps = (dispatch: Dispatch) => {
  // console.log(dispatch)

  return {
    clear_song_list: () => dispatch(clear_song_list()), // 清空歌曲列表
    del_song_list_item: (songId: number) => dispatch(del_song_list_item(songId)), // 删除一首歌
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayBar)

```

#### 5 redux-thunk的使用

> dispatch之后, 有回调或者有异步操作的时候, 可以使用此方式

```tsx
  /**
   * 点击播放按钮
   * @param id 歌单或榜单id
   */
  const handleClickPlay = (id: number) => {
    // 提交异步的action 修改songList
    props.dispatch(
      replace_song_list_async(id, (list: any[]) => {
        const audio = document.getElementById('audio') as HTMLAudioElement
        if (audio) {
          audio.currentTime = 0 // 设置audio播放时间为0
        }

        // isPlay 为false 就改成true
        const { isPlay } = props.playBarState
        if (!isPlay) props.dispatch(change_is_play())

        message.success('开始播放热门推荐歌单')
      })
    )
  }
```



### 9 下载音乐

```js
  // 下载MP3
  let handleDownloadMP3 = () => {
    const songId = currentSongInfo.id
    if (songId) {
      // 1. 下载歌曲url
      http
        .getSongUrl(songId)
        .then(res => {
          if (res.data.code === 200) {
            const url = res.data?.data[0]?.url || ''
            // console.log('url: ', url)
            if (url) {
              // 2. 根据url下载blob
              axios
                .get(url, { responseType: 'blob' })
                .then(res => {
                  if (res.status === 200) {
                    const blob = res.data
                    // 3. 使用file-saver下载mp3文件
                    console.log('blob: ', blob, currentSongInfo)
                    const name = currentSongInfo?.name || '' // 歌名
                    const author = currentSongInfo?.ar[0]?.name // 作者
                    FileSaver.saveAs(blob, `${name} - ${author}.mp3`)
                  }
                })
                .catch(() => {})
            } else {
              // 4. 如果没有获取到url, 创建a标签
              const a = document.createElement('a')
              a.href = `https://music.163.com/song/media/outer/url?id=${songId}.mp3`
              a.target = '_blank'
              a.click()
            }
          }
        })
        .catch(() => {})
    }
  }
```

```js
  // 防抖化
  const handleDownloadMP3 = useCallback(debounce(_handleDownloadMP3, 5000, { leading: true, trailing: false }), [
    currentSongInfo.id,
  ])
```



### 10 ts中useRef的使用

```ts
const audioRef = useRef<HTMLAudioElement>(null)
```

### 11 搜索功能

### 12 排行榜页



### 13 react路由集中管理

https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config

#### 安装

```bash
npm i react-router-config @types/react-router-config
```

#### 添加配置文件

```ts
// src/config/routes.ts

// 路由配置
import { lazy } from 'react'
import { RouteConfig } from 'react-router-config'

// 导入页面路由组件
const Login = lazy(() => import('pages/Login'))

const Home = lazy(() => import('pages/Home'))
const Discover = lazy(() => import('pages/Discover'))
const Download = lazy(() => import('pages/Download'))
const Friend = lazy(() => import('pages/Friend'))
const Mall = lazy(() => import('pages/Mall'))
const Musician = lazy(() => import('pages/Musician'))
const My = lazy(() => import('pages/My'))
const Test = lazy(() => import('pages/Test'))

const Recommend = lazy(() => import('pages/Discover/Recommend'))
const Toplist = lazy(() => import('pages/Discover/Toplist'))
const Playlist = lazy(() => import('pages/Discover/Playlist'))
const Djradio = lazy(() => import('pages/Discover/Djradio'))
const Artist = lazy(() => import('pages/Discover/Artist'))
const Album = lazy(() => import('pages/Discover/Album'))
const PlaylistDetail = lazy(() => import('pages/Discover/PlaylistDetail'))
const AlbumDetail = lazy(() => import('pages/Discover/AlbumDetail'))
const ArtistDetail = lazy(() => import('pages/Discover/ArtistDetail'))
const Song = lazy(() => import('pages/Discover/Song'))

const routes: RouteConfig[] = [
  {
    path: '/login',
    component: Login,
  },

  // 将其他路由放在前面, 可以防止 '/' 直接匹配Home组件的问题,
  // 未使用react-router-config时, 需要配合Switch组件实现
  // react-router-config, 默认实现了Switch组件(仅匹配第一个匹配到的组件)
  {
    path: '/',
    component: Home,
    // routes : 嵌套子路由
    routes: [
      // 发现
      {
        path: '/',
        exact: true,
        component: Discover,
        routes: [
          // 推荐
          { path: '/', exact: true, component: Recommend },
        ],
      },
      {
        path: '/discover',
        component: Discover,
        routes: [
          // { path: '/discover', exact: true, component: Recommend },
          // 排行榜
          { path: '/discover/toplist/:id', component: Toplist },
          // 歌单列表
          { path: '/discover/playlist', component: Playlist },
          // 主播电台
          { path: '/discover/djradio', component: Djradio },
          // 歌手列表
          { path: '/discover/artist', component: Artist },
          // 新碟上架 - 专辑列表
          { path: '/discover/album', component: Album },
          // 歌单详情
          { path: '/discover/playlist-detail', component: PlaylistDetail },
          // 专辑详情
          { path: '/discover/album-detail', component: AlbumDetail },
          // 歌手详情
          { path: '/discover/artist-detail', component: ArtistDetail },
          // 歌曲详情页
          { path: '/discover/song', component: Song },
        ],
      },
      // 我的音乐
      { path: '/my', component: My },
      // 朋友
      { path: '/friend', component: Friend },
      // 商城
      { path: '/mall', component: Mall },
      // 音乐人
      { path: '/musician', component: Musician },
      // 下载客户端
      { path: '/download', component: Download },
      { path: '/test', component: Test, auth: true }, // 可以新增属性,用于权限控制等功能
    ],
  },
]

export default routes


```

#### 使用

- 根路由组件内使用

```tsx
// App.tsx

// renderRoutes 渲染路由
// matchRoutes(routes, pathname)  // 在routes内匹配给定的pathname对应的路由
import { renderRoutes, matchRoutes } from 'react-router-config'
import routes from 'config/routes'

const App = ()=>{
    return (
        <div>
         <Router>
          {/* 路由守卫 */}
          <BeforeEach>
            {/* 渲染根路由 实现原理仍然为渲染成Route组件,只是将路由抽离出来了 */}
            {renderRoutes(routes)}
          </BeforeEach>
        </Router>
        </div>
    )
}
```

- 子路由组件中使用

```tsx
import React, { FC } from 'react'
import styles from './index.module.scss'
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config'

interface IProps {}

const Home: FC<IProps & RouteConfigComponentProps> = props => {
  return (
    <div className={styles.Home}>
      Home
      {/* 渲染子路由 */}
      {renderRoutes(props.route?.routes)}
    </div>
  )
}

Home.defaultProps = {}

export default Home

```



### 14 首页图片懒加载问题 TODO



## 坑

- 删除歌曲冒泡导致点击了歌曲列表项  , 需要清除冒泡 (***), 习惯性清除冒泡

