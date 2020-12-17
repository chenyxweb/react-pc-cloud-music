// 音乐播放条
import { CaretRightOutlined, CloseOutlined, DeleteOutlined, DownloadOutlined, RedoOutlined } from '@ant-design/icons'
import React, { FC, useEffect, useRef, useState } from 'react'
import { message, Slider, Tooltip } from 'antd'
import MyTransition from 'components/MyTransition'
import { connect } from 'react-redux'
import { ICombineState } from 'store'
import { Dispatch } from 'redux'
import dayjs from 'dayjs'
import utils from 'utils/utils'
import { clear_song_list, del_song_list_item } from 'store/songList/actions'
import styles from './index.module.scss'

interface IProps {
  clear_song_list: () => any
  del_song_list_item: (songId: number) => any
}

const mode = ['loop', 'shuffle', 'one'] // 顺序播放/随机播放/单曲循环

type ICurrentMode = 'loop' | 'shuffle' | 'one'

const PlayBar: FC<IProps & ICombineState> = props => {
  // console.log('PlayBar-props: ', props)

  const { songList, currentSongInfo } = props

  const [lock, setLock] = useState(true) // 是否锁住
  const [playBarShow, setPlayBarShow] = useState(false) // 是否展示
  const [isPlay, setIsPlay] = useState(false) // 是否正在播放
  const [currentMode, setCurrentMode] = useState<ICurrentMode>('loop') // 当前播放模式
  const [voiceBarShow, setVoiceBarShow] = useState(false) // 音量调节的bar是否显示
  const [listBoxShow, setListBoxShow] = useState(false) // 歌曲列表和歌词容器的显隐
  const [volume, setVolume] = useState(0.5) // 播放音量 0 ~ 1  刻度 0.01
  const [process, setProcess] = useState(0) // 播放进度 0 ~ 1  刻度 0.01

  let mouseLeaveTimeId: NodeJS.Timeout // 鼠标移出的延时timeId
  const audioRef = useRef<HTMLAudioElement>(null)

  // 播放和暂停
  useEffect(() => {
    if (isPlay) {
      audioRef.current?.play()
    } else {
      audioRef.current?.pause()
    }
  }, [isPlay])

  // 设置audio的音量以及初始音量 mounted 和 update
  useEffect(() => {
    // 设置audio的音量
    if (audioRef.current) {
      audioRef.current.volume = volume
      console.log('audio音量: ', audioRef.current.volume)
    }
  }, [volume])

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
      return mode[index % 3] as ICurrentMode
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

  // 清空播放列表
  const handleClearSongList = () => {
    if (!songList.length) return
    props.clear_song_list()
    message.success('列表清空成功')
  }

  // 删除一首歌曲
  const delSongListItem = (songId: number) => {
    props.del_song_list_item(songId)
    message.success('删除成功')
  }

  // 下载MP3
  const handleDownloadMP3 = () => {
    const url = `https://music.163.com/song/media/outer/url?id=${currentSongInfo.id}.mp3`

    let a = document.createElement('a')
    a.target = '_blank'
    a.download = 'aaa.mp3'
    a.href = url
    a.click()
  }

  // 当前播放时间发生改变的时候, 同步播放进度
  const handleOnTimeUpdate = (event: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    // console.log(event)
    const currentTime = event.currentTarget.currentTime // 当前播放时间 s
    // currentSongInfo.dt // ms
    const percent = +((currentTime * 1000) / currentSongInfo.dt).toFixed(3)
    if (percent === process) return // 两次时间相同
    console.log('播放进度:', percent)
    setProcess(percent)
  }

  // audio播放 -> 设置process bar -> 监听process改变设置audio播放进度  反向设置的时候不准确,这种方式不合理导致声音卡顿, 使用如下方式设置监听bar的拖拽
  // 拖拽进度条
  const handleProcessSliderDrag = (value: number) => {
    console.log(value)
    // 1 设置当前播放进度
    setProcess(value)
    // 2 设置audio的播放时间
    // currentSongInfo.dt 总时长 ms
    const time = (value * currentSongInfo.dt) / 1000
    if (audioRef.current) {
      audioRef.current.currentTime = time
    }
  }

  // audio当前歌曲播放结束
  const handleOnEnded = (event: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    console.log('播放结束')
    // 当前播放模式 currentMode
    switch (currentMode) {
      case 'loop': // 顺序播放
        break
      case 'shuffle': // 随机播放
        break
      case 'one': // 单曲循环
        break

      default:
        break
    }
  }

  return (
    <div
      className={styles.PlayBar}
      style={{ bottom: lock || playBarShow ? 0 : -46 }}
      onMouseEnter={handleMouseEnter} // 鼠标移入
      onMouseLeave={handleMouseLeave} // 鼠标移出
    >
      {/* playBar主体 */}
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
          <img src={currentSongInfo?.al?.picUrl} alt='' />
          <div className='currentSongInfoRight'>
            <div className='right-t'>
              {/* 歌名 */}
              <div className='songName'>{currentSongInfo.name}</div>
              {/* 歌手名 */}
              <div className='songAuthor'>{utils.getArtistStr(currentSongInfo.ar)}</div>
            </div>
            {/* 播放进度条 */}
            <div className='right-b'>
              <div className='process-bar'>
                <Slider
                  value={process}
                  min={0}
                  max={1}
                  step={0.001}
                  tooltipVisible={false}
                  onChange={handleProcessSliderDrag}
                />
              </div>
              <div className='time'>
                {/* 歌曲已播放时长 */}
                <span className='play-time'>{dayjs(process * currentSongInfo.dt).format('mm:ss')} </span>
                {/* 歌曲总时长 */}
                <span className='total-time'>/ {dayjs(currentSongInfo.dt).format('mm:ss')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 下载和重播 */}
        <div className='leftBtns'>
          <Tooltip title='下载音乐'>
            <DownloadOutlined className='icon' onClick={handleDownloadMP3} />
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
                  <Slider
                    min={0}
                    max={1}
                    step={0.01}
                    vertical
                    value={volume}
                    tipFormatter={(value?: number | undefined) => (value && value * 100)?.toFixed(0)}
                    onChange={(value: number) => setVolume(value)}
                  />
                </div>
              </div>
            </MyTransition>
          </div>
          <Tooltip title={currentModeTip}>
            <div className={`btn circle-mode ${currentMode}`} onClick={switchCurrentMode}></div>
          </Tooltip>
          <div className='btn song-list' onClick={() => setListBoxShow(!listBoxShow)}>
            {/* 歌曲数 */}
            <div className='songCount'>{songList?.length || 0}</div>
          </div>
        </div>
      </div>

      {/* audio */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleOnTimeUpdate} // 播放时间更新时触发
        onEnded={handleOnEnded} // 播放结束时触发
        // autoPlay
        preload='auto'
        src={`https://music.163.com/song/media/outer/url?id=${currentSongInfo.id}.mp3`}
      ></audio>

      {/* 播放列表和歌词box */}
      <MyTransition mode='scale' in={listBoxShow} timeout={300}>
        <div className={styles.songListAndLyricWrapper}>
          <div className={styles.songListAndLyric}>
            {/* 歌曲列表容器 */}
            <div className='songList'>
              <div className='songList-title'>
                <div className='songList-title-l'>播放列表({songList?.length || 0})</div>
                <div className='songList-title-r' title='清除播放列表' onClick={handleClearSongList}>
                  <DeleteOutlined className='icon' /> 清除
                </div>
              </div>
              {/* 列表 */}
              <div className='songList-content'>
                {songList.map(item => {
                  return (
                    /* 列表项 */
                    <div className={`songList-item ${currentSongInfo.id === item.id ? 'active' : ''}`} key={item.id}>
                      {/* 红色三角形 */}
                      <div className='redIcon'>
                        <CaretRightOutlined className='icon' />
                      </div>
                      {/* 歌名 */}
                      <div className='songList-item-name ellipsis-1'>{item.name}</div>
                      {/* 按钮 */}
                      <div className='btns'>
                        <DeleteOutlined title='删除' className='icon' onClick={() => delSongListItem(item.id)} />
                      </div>
                      {/* 歌手 */}
                      <div className='songList-item-author ellipsis-1'>{utils.getArtistStr(item.ar)}</div>
                      {/* 歌时长 */}
                      <div className='songList-item-time'>{dayjs(item.dt).format('mm:ss')}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 歌词容器 */}
            <div className='lyric'>
              <div className='lyric-title'>
                {currentSongInfo.name}
                <CloseOutlined title='关闭' onClick={() => setListBoxShow(false)} className='icon' />
              </div>
              <div className='lyric-content'></div>
            </div>
          </div>
        </div>
      </MyTransition>

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

// ------------------------------- redux 映射 -------------------------------------
// 映射state
const mapStateToProps = (state: ICombineState) => {
  // console.log(state)
  return {
    songList: state.songList,
    currentSongInfo: state.currentSongInfo,
  }
}

// 映射dispatch
const mapDispatchToProps = (dispatch: Dispatch) => {
  // console.log(dispatch)

  return {
    clear_song_list: () => dispatch(clear_song_list()), // 清空歌曲列表
    del_song_list_item: (songId: number) => dispatch(del_song_list_item(songId)), // 删除一首歌
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayBar)
