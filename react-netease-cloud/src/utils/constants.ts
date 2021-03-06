import bg_placeholder_img from 'assets/img/bg_white.png'

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
  { name: '推荐', path: '/' },
  { name: '排行榜', path: '/discover/toplist' },
  { name: '歌单', path: '/discover/playlist' },
  { name: '主播电台', path: '/discover/djradio' },
  { name: '歌手', path: '/discover/artist' },
  { name: '新碟上架', path: '/discover/album' },
]

// 搜索类型枚举
const searchTypeEnum = {
  '1': '单曲',
  '100': '歌手',
  '10': '专辑',
  '1014': '视频',
  '1006': '歌词',
  '1000': '歌单',
  '1009': '电台', // 声音主播
  '1002': '用户',
  '1004': 'MV',
  // '1018': '综合',
}

// 新碟查询区域枚举
const diskAreaEnum = {
  ALL: '全部',
  ZH: '华语',
  EA: '欧美',
  KR: '韩国',
  JP: '日本',
}

// 合并
const constants = {
  topMenu,
  subMenu,
  SONG_LIST: 'songList',
  CURRENT_SONG_INFO: 'currentSongInfo',
  USER_INFO: 'user_info',
  topListIds,
  bg_placeholder_img,
  searchTypeEnum,
  diskAreaEnum,
}

export default constants
