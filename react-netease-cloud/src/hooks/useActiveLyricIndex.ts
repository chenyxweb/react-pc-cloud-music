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
