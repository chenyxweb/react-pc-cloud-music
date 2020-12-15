// 音乐播放条
import React, { FC, useState } from 'react'

import styles from './index.module.scss'

interface IProps {}

const PlayBar: FC<IProps> = () => {
  const [lock, setLock] = useState(false) // 是否锁住
  const [playBarShow, setPlayBarShow] = useState(false) // 是否展示

  let mouseLeaveTimeId: NodeJS.Timeout // 鼠标移出的延时timeId

  // 鼠标移入播放条
  const handleMouseEnter = () => {
    if (lock) return // lock 为true 取消移入移出事件
    clearTimeout(mouseLeaveTimeId) // 每次移入清除定时器, 取消移出效果
    if (!playBarShow) {
      setPlayBarShow(true)
    }
  }

  // 鼠标移出播放条
  const handleMouseLeave = () => {
    if (lock) return // lock 为true 取消移入移出事件
    clearTimeout(mouseLeaveTimeId) // 每次移出清除定时器, 取消移出效果
    mouseLeaveTimeId = setTimeout(() => setPlayBarShow(false), 1000)
  }

  return (
    <div
      className={styles.PlayBar}
      style={{ bottom: lock || playBarShow ? 0 : -46 }}
      onMouseEnter={handleMouseEnter} // 鼠标移入
      onMouseLeave={handleMouseLeave} // 鼠标移出
    >
      <div className={[styles.container, 'w980'].join(' ')}>
        {/* TODO */}
      </div>

      {/* audio */}
      {/* <audio src=""></audio> */}

      {/* 背景图 左边 */}
      <div className={styles['bg-l']}></div>

      {/* 小锁 */}
      <div className={styles.miniLock}>
        <div
          className={[styles.btn, lock ? styles.lock : styles.unlock].join(' ')}
          onClick={() => setLock(!lock)}
        ></div>
      </div>

      {/* 背景图 右边 */}
      <div className={styles['bg-r']}></div>
    </div>
  )
}

PlayBar.defaultProps = {}

export default PlayBar
