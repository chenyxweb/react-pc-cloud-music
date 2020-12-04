# 仿网易云音乐

## 起步

官方网站 : https://music.163.com/#

参考网站 : [www.wanguancs.top](http://www.wanguancs.top/)

参考api地址 : https://binaryify.github.io/NeteaseCloudMusicApi/#/?id=neteasecloudmusicapi

掘金接口地址 : http://123.57.176.198:3000/

本地服务接口地址 : http://localhost:2333/

## 技术点

- 轮播背景实现: imageUrl+?imageView&blur=40x20 获取模糊背景, 设置背景样式

```css
background: url() center center/6000px   // 背景位置/背景大小
```

- React.memo 

```
// 性能优化
如果你的组件在相同 props 的情况下渲染相同的结果，那么你可以通过将其包装在 React.memo 中调用，以此通过记忆组件渲染结果的方式来提高组件的性能表现。这意味着在这种情况下，React 将跳过渲染组件的操作并直接复用最近一次渲染的结果

// 和  React.pureComponent 类似

// 区别
类组件 - pureComponent - state 和 props
函数组件 - memo - props

// 当props和state较为简单时才使用, 比较好, 因为仅仅做浅层对比
```

- 跳转页面回到顶端