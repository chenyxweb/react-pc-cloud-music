// 工具函数

// 格式化--万
const formatTenThousand = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(0) + '万'
  }
  return num
}

// 转化歌词
const parseLyric = (lyrics: string) => {
  const parseExp = /\[([0-9]{2}):([0-9]{2})\.([0-9]{2,3})\]/
  if (!lyrics) return
  const lineStrings = lyrics.split('\n')
  const lyricList = []
  for (const line of lineStrings) {
    if (line) {
      const result = parseExp.exec(line) as Array<any>
      if (!result) continue
      const time1 = result[1] * 60 * 1000
      const time2 = result[2] * 1000
      const time3 = result[3].length > 2 ? result[3] * 1 : result[3] * 1000
      // 当前歌曲播放的总时长(毫秒)
      const totalTime = time1 + time2 + time3
      const content = line.replace(parseExp, '').trim()
      const lineObj = { totalTime, content }
      lyricList.push(lineObj)
    }
  }
  return lyricList
}

const utils = {
  formatTenThousand,
  parseLyric,
}

export default utils
