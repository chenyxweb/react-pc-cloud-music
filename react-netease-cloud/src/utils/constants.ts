// topBar的menu信息
const topMenu = [
  // { name: '发现音乐', path: '/discover' },
  { name: '发现音乐', path: '/' },
  { name: '我的音乐', path: '/my' },
  { name: '朋友', path: '/friend' },
  { name: '商城', path: '/mall' },
  { name: '音乐人', path: '/musician' },
  { name: '下载客户端', path: '/download' },
]

// 榜单对应id
const topListIds = {
  S: 19723756, // 飙升榜
  N: 3779629, // 新歌榜
  O: 2884035, // 原创榜
  H: 3778678, // 热歌榜
}

// sub-menu
const subMenu = [
  { name: '推荐', path: '/discover' },
  { name: '排行榜', path: `/discover/toplist/${topListIds.S}` },
  { name: '歌单', path: '/discover/playlist' },
  { name: '主播电台', path: '/discover/djradio' },
  { name: '歌手', path: '/discover/artist' },
  { name: '新碟上架', path: '/discover/album' },
]

const SONG_LIST = 'songList'
const CURRENT_SONG_INFO = 'currentSongInfo'

// 合并
const constants = {
  topMenu,
  subMenu,
  SONG_LIST,
  CURRENT_SONG_INFO,
  topListIds,
}

export default constants
