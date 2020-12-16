# react-netease-cloud

## 起步

官方网站 : https://music.163.com/#

参考网站 : [www.wanguancs.top](http://www.wanguancs.top/)

参考api地址 : https://binaryify.github.io/NeteaseCloudMusicApi/#/?id=neteasecloudmusicapi

掘金接口地址 : http://123.57.176.198:3000/

本地服务接口地址 : http://localhost:2333/

## 技术点

### 轮播背景实现

```css
// imageUrl+?imageView&blur=40x20 获取模糊背景, 设置背景样式
background: url() center center/6000px   // 背景位置/背景大小
```

### React.memo 

```
// 性能优化
如果你的组件在相同 props 的情况下渲染相同的结果，那么你可以通过将其包装在 React.memo 中调用，以此通过记忆组件渲染结果的方式来提高组件的性能表现。这意味着在这种情况下，React 将跳过渲染组件的操作并直接复用最近一次渲染的结果

// 和  React.pureComponent 类似

// 区别
类组件 - pureComponent - state 和 props
函数组件 - memo - props

// 当props和state较为简单时才使用, 比较好, 因为仅仅做浅层对比
```

### 跳转页面回到顶端功能

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

### audio标签相关

https://blog.csdn.net/gongstrong123/article/details/50339249

歌曲时长  dt 字段

### 资源访问

```
js内  使用@访问根目录
css内 使用~访问根目录

```
### 封装Transition 动画组件
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

### 使用dayjs格式化歌曲时长

```js
// 由于 new Date(0) // 为 Thu Jan 01 1970 08:00:00 GMT+0800 (中国标准时间)
// 可以传入毫秒数进行格式化歌曲时长
dayjs(item.dt).format('mm:ss')
```

