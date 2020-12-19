// 工具函数

// 格式化--万
const formatTenThousand = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(0) + '万'
  }
  return num
}

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
  const parseExp = /\[([0-9]{2}):([0-9]{2})\.([0-9]{1,3})\]/ // 匹配 [00:00.000]
  if (!lyrics) return
  const lineStrings = lyrics.split('\n')
  let lyricList = []
  for (const line of lineStrings) {
    if (line) {
      // line --> [00:00.000] 作词 : 无比
      const result = parseExp.exec(line) as Array<any>

      if (!result) continue
      const time1 = result[1] * 60 * 1000 // 分    和第1个子表达式匹配 [0-9]{2}
      const time2 = result[2] * 1000 // 秒   和第2个子表达式匹配 [0-9]{2}
      // const time3 = result[3].length > 2 ? result[3] * 1 : result[3] * 1000  和第3个子表达式匹配 [0-9]{2,3}
      const time3 = Number('0.' + String(result[3])) * 1000 // 毫秒
      const totalTime = time1 + time2 + time3 // 当前歌曲播放的总时长(毫秒)
      const content = line.replace(parseExp, '').trim()
      const lineObj = { totalTime, content }
      lyricList.push(lineObj)
    }
  }

  // 排序
  lyricList = lyricList.sort((a, b) => a.totalTime - b.totalTime)
  console.log(lineStrings, lyricList)

  return lyricList
}

// 获取歌手字符串 'aaa/bbb/ccc'
const getArtistStr = (list: any[]) => {
  return (list || [])
    .map((item: any, index: number) => {
      if (index === 0) return item.name
      return '/' + item.name
    })
    .join('')
}

const utils = {
  formatTenThousand,
  parseLyric,
  getArtistStr,
}

export default utils
