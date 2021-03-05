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
const Search = lazy(() => import('pages/Search'))
const MV = lazy(() => import('pages/MV'))
const Test = lazy(() => import('pages/Test'))

const User = lazy(() => import('pages/User'))
const UserHome = lazy(() => import('pages/User/UserHome'))
const RecordListDetail = lazy(() => import('pages/User/RecordListDetail'))

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
    meta: { requiresAuth: false },
  },

  { path: '/test', component: Test, meta: { requiresAuth: true } }, // 可以新增属性,用于权限控制等功能

  // 将其他路由放在前面, 可以防止 '/' 直接匹配Home组件的问题,
  // 未使用react-router-config时, 需要配合Switch组件实现
  // react-router-config, 默认实现了Switch组件(仅匹配第一个匹配到的组件)
  {
    path: '/',
    component: Home,
    meta: { requiresAuth: false },
    // routes : 嵌套子路由
    routes: [
      // 发现
      {
        path: '/',
        exact: true,
        component: Discover,
        meta: { requiresAuth: false },
        routes: [
          // 推荐
          { path: '/', exact: true, component: Recommend, meta: { requiresAuth: false } },
        ],
      },
      {
        path: '/discover',
        component: Discover,
        routes: [
          // { path: '/discover', exact: true, component: Recommend },
          // 排行榜
          { path: '/discover/toplist/:id', component: Toplist, meta: { requiresAuth: false } },
          // 歌单列表
          { path: '/discover/playlist', component: Playlist, meta: { requiresAuth: false } },
          // 主播电台
          { path: '/discover/djradio', component: Djradio, meta: { requiresAuth: false } },
          // 歌手列表
          { path: '/discover/artist', component: Artist, meta: { requiresAuth: false } },
          // 新碟上架 - 专辑列表
          { path: '/discover/album', component: Album, meta: { requiresAuth: false } },
          // 歌单详情
          { path: '/discover/playlist-detail', component: PlaylistDetail, meta: { requiresAuth: false } },
          // 专辑详情
          { path: '/discover/album-detail', component: AlbumDetail, meta: { requiresAuth: false } },
          // 歌手详情
          { path: '/discover/artist-detail/:id', component: ArtistDetail, meta: { requiresAuth: false } },
          // 歌曲详情页
          { path: '/discover/song/:id', component: Song, meta: { requiresAuth: false } },
        ],
      },
      // 我的音乐
      { path: '/my', component: My, meta: { requiresAuth: false } },
      // 朋友
      { path: '/friend', component: Friend, meta: { requiresAuth: false } },
      // 商城
      { path: '/mall', component: Mall, meta: { requiresAuth: false } },
      // 音乐人
      { path: '/musician', component: Musician, meta: { requiresAuth: false } },
      // 下载客户端
      { path: '/download', component: Download, meta: { requiresAuth: false } },
      // 搜索页
      { path: '/search', component: Search, meta: { requiresAuth: false } },
      // mv
      { path: '/mv/:id', component: MV, meta: { requiresAuth: false } },
      // 用户信息
      {
        path: '/user',
        component: User,
        routes: [
          { path: '/user/home/:userId', component: UserHome },
          { path: '/user/record-list-detail/:userId', component: RecordListDetail },
        ],
      },
    ],
  },
]

export default routes
