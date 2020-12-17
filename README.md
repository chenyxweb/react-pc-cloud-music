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



#### 4.9 歌曲列表自动居中当前播放歌曲

#### 4.10 改写歌曲和歌词滚动条

#### 4.11 获取歌词

```
1. 当前歌曲id改变, 获取歌词信息
2. 使用正则方法exec, 获取当前时间戳, 和当前时间戳展示的歌词
```

```ts
/**
 * 转化歌词
 * @param lyrics
 * [00:00.000] 作词 : 无比
 * [00:01.000] 作曲 : PIggy
 * [00:10.442]你看那 月儿 弯弯 有几分似你
 * [00:13.943]耀眼的月光 快照进我心
 * [00:16.693]你说这是最美好的风景
 * [00:21.693]但静 悄悄 距离 却越靠越近
 */
const parseLyric = (lyrics: string) => {
  const parseExp = /\[([0-9]{2}):([0-9]{2})\.([0-9]{2,3})\]/ // 匹配 [00:00.000]
  if (!lyrics) return
  const lineStrings = lyrics.split('\n')
  const lyricList = []
  for (const line of lineStrings) {
    if (line) {
      // line --> [00:00.000] 作词 : 无比
      const result = parseExp.exec(line) as Array<any>
      console.log(result)

      if (!result) continue
      const time1 = result[1] * 60 * 1000 // 分    和第1个子表达式匹配 [0-9]{2}
      const time2 = result[2] * 1000 // 秒   和第2个子表达式匹配 [0-9]{2}
      const time3 = result[3].length > 2 ? result[3] * 1 : result[3] * 1000 // 毫秒  和第3个子表达式匹配 [0-9]{2,3}
      const totalTime = time1 + time2 + time3 // 当前歌曲播放的总时长(毫秒)
      const content = line.replace(parseExp, '').trim()
      const lineObj = { totalTime, content }
      lyricList.push(lineObj)
    }
  }
  return lyricList
}
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
// songList/actions.ts

// actions creator  指挥者(要干什么)

import { ADD_SONG_LIST_ITEM, DEL_SONG_LIST_ITEM, CLEAR_SONG_LIST, REPLACE_SONG_LIST } from './actionTypes'

// 添加一首歌
export const add_song_list_item = (listItem: any) => ({ type: ADD_SONG_LIST_ITEM, payload: listItem })

// 删除一首歌
export const del_song_list_item = (songId: number) => ({ type: DEL_SONG_LIST_ITEM, payload: songId })

// 清空播放列表
export const clear_song_list = () => ({ type: CLEAR_SONG_LIST })

// 替换播放列表
export const replace_song_list = (list: any[]) => ({ type: REPLACE_SONG_LIST, payload: list })

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

### 9 下载音乐

```js
  const handleDownloadMP3 = () => {
    const url = `https://music.163.com/song/media/outer/url?id=${currentSongInfo.id}.mp3`

    let a = document.createElement('a')
    a.target = '_blank'
    a.download = 'aaa.mp3'
    a.href = url
    a.click()
  }
```



### 10 ts中useRef的使用

```ts
const audioRef = useRef<HTMLAudioElement>(null)
```



## 坑

- 删除歌曲冒泡导致点击了歌曲列表项  , 需要清除冒泡 (***), 习惯性清除冒泡