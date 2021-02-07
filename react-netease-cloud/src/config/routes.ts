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
