// 音乐播放条
import { DownloadOutlined, RedoOutlined } from '@ant-design/icons'
import React, { FC, useState } from 'react'
import { Slider, Tooltip } from 'antd'

import styles from './index.module.scss'
import MyTransition from 'components/MyTransition'

interface IProps {}

const mode = ['loop', 'shuffle', 'one'] // 顺序播放/随机播放/单曲循环

const PlayBar: FC<IProps> = () => {
  const [lock, setLock] = useState(true) // 是否锁住
  const [playBarShow, setPlayBarShow] = useState(false) // 是否展示
  const [isPlay, setIsPlay] = useState(false) // 是否正在播放
  const [currentMode, setCurrentMode] = useState('loop') // 当前播放模式
  const [voiceBarShow, setVoiceBarShow] = useState(false) // 音量调节的bar是否显示

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

  // 切换播放模式
  const switchCurrentMode = () => {
    setCurrentMode(prevState => {
      let index = mode.findIndex(item => item === prevState)
      index++
      return mode[index % 3]
    })
  }

  // 当前播放模式文字提示
  const currentModeTip = () => {
    switch (currentMode) {
      case 'loop':
        return '顺序播放'

      case 'shuffle':
        return '随机播放'

      case 'one':
        return '单曲循环'

      default:
        return null
    }
  }

  return (
    <div
      className={styles.PlayBar}
      style={{ bottom: lock || playBarShow ? 0 : -46 }}
      onMouseEnter={handleMouseEnter} // 鼠标移入
      onMouseLeave={handleMouseLeave} // 鼠标移出
    >
      <div className={[styles.container, 'w980'].join(' ')}>
        {/* 上一首 暂停/播放 下一首 */}
        <div className='playBtns'>
          <div className='prev' title='上一首'></div>
          <div
            className={isPlay ? 'play' : 'stop'}
            title={isPlay ? '暂停' : '播放'}
            onClick={() => setIsPlay(!isPlay)}
          ></div>
          <div className='next' title='下一首'></div>
        </div>

        {/* 当前播放歌曲信息 */}
        <div className='currentSongInfo'>
          <img src='' alt='' />
          <div className='currentSongInfoRight'>
            <div className='right-t'>
              {/* 歌名 */}
              <div className='songName'>有何不可</div>
              {/* 歌手名 */}
              <div className='songAuthor'>许嵩</div>
            </div>
            {/* 播放进度条 */}
            <div className='right-b'>
              <div className='process-bar'>
                <Slider tooltipVisible={false} />
              </div>
              <div className='time'>
                <span className='play-time'>01:37 </span>
                <span className='total-time'>/ 03:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* 下载和重播 */}
        <div className='leftBtns'>
          <Tooltip title='下载音乐'>
            <DownloadOutlined className='icon' />
          </Tooltip>

          <Tooltip title='重播播放'>
            <RedoOutlined className='icon' />
          </Tooltip>
        </div>

        {/* 声音, 循环模式, 歌曲列表和歌词 */}
        <div className='rightBtns'>
          <div className='btn voice' onClick={() => setVoiceBarShow(!voiceBarShow)}>
            {/* 音量大小bar 定位  */}
            <MyTransition mode='scale' in={voiceBarShow} timeout={300}>
              <div className='voice-bar'>
                <div style={{ height: 110 }}>
                  <Slider vertical />
                </div>
              </div>
            </MyTransition>
          </div>
          <Tooltip title={currentModeTip}>
            <div className={`btn circle-mode ${currentMode}`} onClick={switchCurrentMode}></div>
          </Tooltip>
          <div className='btn song-list'></div>
        </div>
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
