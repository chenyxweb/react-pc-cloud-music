// 音乐播放条
import { CaretRightOutlined, CloseOutlined, DeleteOutlined, DownloadOutlined, RedoOutlined } from '@ant-design/icons'
import React, { FC, Fragment, memo, useCallback, useEffect, useRef, useState } from 'react'
import { Empty, message, Slider, Tooltip } from 'antd'
import MyTransition from 'components/MyTransition'
import { connect } from 'react-redux'
import { ICombineState } from 'store'
import { Dispatch } from 'redux'
import dayjs from 'dayjs'
import utils from 'utils/utils'
import { debounce, sample } from 'lodash-es'
import { clear_song_list, del_song_list_item } from 'store/songList/actions'
import { change_current_song_info } from 'store/currentSongInfo/actions'
import styles from './index.module.scss'
import { change_is_play } from 'store/playBarState/actions'
import http from 'service/http'
// import { axios } from 'service/axios'
// import FileSaver from 'file-saver'
import useActiveLyricIndex from 'hooks/useActiveLyricIndex'
import useClickOutsideComponent from 'hooks/useClickOutsideComponent'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import constants from 'utils/constants'

interface IProps {
  clear_song_list: () => void
  del_song_list_item: (songId: number) => void
  change_current_song_info: (item: any) => void
  change_is_play: () => void
}

const mode = ['loop', 'shuffle', 'one'] // 顺序播放/随机播放/单曲循环

type CurrentModeType = 'loop' | 'shuffle' | 'one'

// 歌词数组类型
export type LyricArrType = {
  /** 时间节点 */
  totalTime: number
  /** 歌词 */
  content: string
}[]

const PlayBar: FC<
  IProps & Pick<ICombineState, 'songList' | 'currentSongInfo' | 'playBarState'> & RouteComponentProps
> = props => {
  // console.log('PlayBar-props: ', props)

  const { songList, currentSongInfo, playBarState } = props

  const { isPlay } = playBarState

  const [lock, setLock] = useState(true) // 是否锁住
  const [playBarShow, setPlayBarShow] = useState(false) // 是否展示
  // const [isPlay, setIsPlay] = useState(false) // 是否正在播放
  const [currentMode, setCurrentMode] = useState<CurrentModeType>('loop') // 当前播放模式
  const [voiceBarShow, setVoiceBarShow] = useState(false) // 音量调节的bar是否显示
  const [listBoxShow, setListBoxShow] = useState(false) // 歌曲列表和歌词容器的显隐
  const [volume, setVolume] = useState(0.5) // 播放音量 0 ~ 1  刻度 0.01
  const [process, setProcess] = useState(0) // 播放进度 0 ~ 1  刻度 0.01
  const [currentTime, setCurrentTime] = useState(0) // 当前播放时间戳
  const [lyricArr, setLyricArr] = useState<LyricArrType>([]) // 歌词数组

  // let mouseLeaveTimeId: NodeJS.Timeout  // x
  const audioRef = useRef<HTMLAudioElement>(null) //  audio标签
  const playBarRef = useRef<HTMLDivElement>(null) // 歌曲列表和歌词容器

  let mouseLeaveTimeId = useRef<any>({ id: null }) // 鼠标移出的延时timeId

  // useEffect(() => {
  //   console.log('audio: ')
  //   console.dir(audioRef.current)
  // }, [])

  // 播放和暂停
  useEffect(() => {
    if (isPlay) {
      audioRef.current
        ?.play()
        .then(res => {
          // console.log(res)
        })
        .catch(err => {
          // 调用play方法报错
          message.error(err.message)
        })
    } else {
      audioRef.current?.pause()
    }
  }, [isPlay])

  // 设置audio的音量以及初始音量 mounted 和 update
  useEffect(() => {
    // 设置audio的音量
    if (audioRef.current) {
      audioRef.current.volume = volume
      // console.log('audio音量: ', audioRef.current.volume)
    }
  }, [volume])

  // 获取歌词
  useEffect(() => {
    setLyricArr([])
    http
      .getLyric(currentSongInfo.id)
      .then(res => {
        if (res.data.code === 200) {
          const lyricString = res.data.lrc?.lyric || ''
          const lyricArr = utils.parseLyric(lyricString)
          // console.log('获取歌词:', lyricArr || [])
          setLyricArr(lyricArr || [])
        }
      })
      .catch(() => {})
  }, [currentSongInfo.id])

  // 上/下一曲 播放暂停快捷键
  // onkeypress  字母数字键才会触发
  // 每次更新都需要重新运行useEffect , 不然记住的是以前的数据
  useEffect(() => {
    window.onkeyup = (e: KeyboardEvent) => {
      // console.log(e)
      if (e.ctrlKey && e.code === 'ArrowRight') {
        // ctrl + → 下一首
        console.log('下一首')
        handleClickNextBtn()
      }

      if (e.ctrlKey && e.code === 'ArrowLeft') {
        // ctrl + ← 上一首
        console.log('上一首')
        handleClickPrevBtn()
      }

      if (e.code === 'KeyP') {
        console.log('播放/暂停')
        props.change_is_play()
      }

      // 切换模式
      if (e.code === 'KeyM') {
        switchCurrentMode()
      }
    }

    // 每次需要清除事件
    return () => {
      window.onkeyup = null
    }
  })

  // 歌曲列表当前项滚动居中
  useEffect(() => {
    const songListItemElement = document.querySelector('.songList-content .songList-item.active')
    if (songListItemElement) {
      songListItemElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [currentSongInfo.id])

  // 获取激活的歌词索引
  const [activeLyricIndex] = useActiveLyricIndex(currentTime, currentSongInfo.dt, lyricArr)

  // 歌词列表当前项滚动居中
  useEffect(() => {
    const lyricListItemElement = document.querySelector('.lyric-content .lyric-item.active')
    if (lyricListItemElement) {
      lyricListItemElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [activeLyricIndex])

  // 点击playBar外部
  useClickOutsideComponent(playBarRef, () => {
    // 关闭歌词和歌曲列表
    listBoxShow && setListBoxShow(false)
  })

  // 鼠标移入播放条
  const handleMouseEnter = () => {
    if (lock) return // lock 为true 取消移入移出事件
    clearTimeout(mouseLeaveTimeId.current.id) // 每次移入清除定时器, 取消移出效果
    if (!playBarShow) {
      setPlayBarShow(true)
    }
  }

  // 鼠标移出播放条
  const handleMouseLeave = () => {
    if (lock) return // lock 为true 取消移入移出事件
    clearTimeout(mouseLeaveTimeId.current.id) // 每次移出清除定时器, 取消移出效果
    mouseLeaveTimeId.current.id = setTimeout(() => setPlayBarShow(false), 500)
  }

  // 切换播放模式
  const switchCurrentMode = () => {
    setCurrentMode(prevState => {
      let index = mode.findIndex(item => item === prevState)
      index++
      return mode[index % 3] as CurrentModeType
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
  const delSongListItem = (songId: number, e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.stopPropagation() // 阻止冒泡, 防止歌曲列表项被点击 ***** 坑 , 养成习惯清除冒泡行为
    if (currentSongInfo.id === songId) {
      // 删除的是当前播放的歌曲
      // songList.length为1, 直接删除
      if (songList.length > 1) {
        playNextSong()
      }
    }

    // 删除操作提出来
    props.del_song_list_item(songId)
  }

  // 下载MP3
  const _handleDownloadMP3 = () => {
    // console.log('download')
    const songId = currentSongInfo.id
    if (songId) {
      // 1. 下载歌曲url
      http
        .getSongUrl(songId)
        .then(res => {
          if (res.data.code === 200) {
            const url = res.data?.data[0]?.url || ''
            // console.log('url: ', url)
            if (url) {
              // console.log('url: ', url)
              // console.log('songId: ', songId)
              // 打开高清歌曲页面
              window.open(url)
            } else {
              // 打开标清歌曲页面
              window.open(`https://music.163.com/song/media/outer/url?id=${songId}.mp3`)
            }
          }
        })
        .catch(() => {})
    }
  }
  // 防抖化
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDownloadMP3 = useCallback(debounce(_handleDownloadMP3, 5000, { leading: true, trailing: false }), [
    currentSongInfo.id,
  ])

  // 当前播放时间发生改变的时候, 同步播放进度
  const handleOnTimeUpdate = (event: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    // console.log(event)
    const currentTime = event.currentTarget.currentTime // 当前播放时间 s
    // currentSongInfo.dt // ms
    const percent = +((currentTime * 1000) / currentSongInfo.dt).toFixed(3)
    if (percent === process) return // 两次时间相同
    // console.log('播放进度:', (percent * 100).toFixed(1) + '%')
    setCurrentTime(currentTime)
    setProcess(percent)
  }

  // audio播放 -> 设置process bar -> 监听process改变设置audio播放进度  反向设置的时候不准确,这种方式不合理导致声音卡顿, 使用如下方式设置监听bar的拖拽
  // 拖拽进度条
  const handleProcessSliderDrag = (value: number) => {
    // console.log(value)
    // 1 设置当前播放进度
    setProcess(value)
    // 2 设置audio的播放时间
    // currentSongInfo.dt 总时长 ms
    const time = (value * currentSongInfo.dt) / 1000
    if (audioRef.current) {
      audioRef.current.currentTime = time
      // 如果当前为停止播放状态, 就播放
      if (!isPlay) {
        props.change_is_play()
      }
    }
  }

  // 随机播放歌曲
  const randomPlay = () => {
    if (songList.length === 1) {
      // 只有一项, 则循环这一项
      handleRePlay()
    } else if (songList.length > 1) {
      // 如果songList.length>1, 排除当前项, 随机取一项
      const item = sample(songList.filter(i => i.id !== currentSongInfo.id))
      // dispatch 修改store
      props.change_current_song_info(item)
      // 播放
      handleRePlay()
    } else {
      // list为空
      message.info('暂无随机播放歌曲')
    }
  }

  // audio当前歌曲播放结束
  const handleOnEnded = (event: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    console.log('播放结束')
    // setIsPlay(false)
    // 当前播放模式 currentMode
    switch (currentMode) {
      case 'loop': // 顺序播放, 播放列表中下一首歌曲
        // 如果当前播放歌曲在列表上 播放下一首
        playNextSong()
        break
      case 'shuffle': // 随机播放, 随机播放列表中的某一首歌曲
        // songList
        randomPlay()

        // currentSongInfo
        break
      case 'one': // 单曲循环, 循环当前歌曲
        handleRePlay()
        break

      default:
        break
    }
  }

  // audio 加载期间遇到错误, 播放下一首歌曲
  const handleOnError = (event: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    message.destroy()
    message.info('当前歌曲无法播放, 3s 后自动切换下一首')
    setTimeout(() => {
      handleClickNextBtn()
    }, 3000)
  }

  // audio 缓冲至目前可以播放的状态  再播放, 避免无法播放调用了play方法
  const handleOncanplay = () => {
    console.log('canplay')
    if (isPlay && audioRef.current) {
      audioRef.current.play()
    }
  }

  // 重新播放当前歌曲
  const handleRePlay = () => {
    setTimeout(() => {
      if (audioRef.current) {
        // audioRef.current.load()
        audioRef.current.currentTime = 0 // 设置当前播放时间为0
        // audioRef.current.play() // 重新播放
      }
    }, 50)
  }

  // 播放上一首
  const playPrevSong = () => {
    if (songList.length > 1) {
      const currentSongIndex = songList.findIndex(item => item.id === currentSongInfo.id)

      // 当前歌曲时第一项时, 设置当前播放为最后一项
      if (currentSongIndex === 0) {
        props.change_current_song_info(songList[songList.length - 1])
        // isPlay && handleRePlay()
      } else {
        // 当前歌曲不是第一项, 设置当前播放为上一项
        const nextItem = songList[currentSongIndex - 1]
        // props.del_song_list_item(songId)
        props.change_current_song_info(nextItem)
        // isPlay && handleRePlay()
      }
    }
  }

  // 播放下一首
  const playNextSong = () => {
    if (songList.length > 1) {
      // 列表中有其他歌曲
      const currentSongIndex = songList.findIndex(item => item.id === currentSongInfo.id)

      if (currentSongIndex === songList.length - 1) {
        // 当前歌曲是最后一项, 设置当前播放为第一项
        props.change_current_song_info(songList[0])
        isPlay && handleRePlay() // 在播放就播放
      } else {
        // 当前歌曲不是最后一项, 设置当前播放歌曲为下一项
        const nextItem = songList[currentSongIndex + 1]
        // props.del_song_list_item(songId)
        props.change_current_song_info(nextItem)
        isPlay && handleRePlay()
      }
    }
  }

  // 点击上一首按钮
  const handleClickPrevBtn = () => {
    // 单曲,循环模式 --> 播放上一首
    if (currentMode === 'one' || currentMode === 'loop') return playPrevSong()
    // 随机模式 --> 随机播放
    if (currentMode === 'shuffle') return randomPlay()
  }

  // 点击下一首按钮
  const handleClickNextBtn = () => {
    // 单曲,循环模式 --> 播放下一首
    if (currentMode === 'one' || currentMode === 'loop') return playNextSong()
    // 随机模式 --> 随机播放
    if (currentMode === 'shuffle') return randomPlay()
  }

  // 点击播放列表项, 切换歌曲, 开始播放
  const handleClickListItem = (item: any) => {
    if (item.id === currentSongInfo.id) return // 点击同一首 return
    if (!isPlay) {
      // 若暂停, 则自动开始播放
      props.change_is_play()
    }
    props.change_current_song_info(item)
  }

  // 点击歌曲名
  const handleClickSongName = () => {
    currentSongInfo.id && props.history.push(`/discover/song?id=${currentSongInfo.id}`)
  }

  // 点击歌手
  const handleClickAuthorName = (item: any) => {
    item.id && props.history.push(`/discover/artist?id=${item.id}`)
  }

  return (
    <div
      ref={playBarRef}
      className={styles.PlayBar}
      style={{ bottom: lock || playBarShow ? 0 : -46 }}
      onMouseEnter={handleMouseEnter} // 鼠标移入
      onMouseLeave={handleMouseLeave} // 鼠标移出
    >
      {/* playBar主体 */}
      <div className={[styles.container, 'w980'].join(' ')}>
        {/* 上一首 暂停/播放 下一首 */}
        <div className='playBtns'>
          <div className='prev' title='上一首(Ctrl+←)' onClick={handleClickPrevBtn}></div>
          <div
            className={isPlay ? 'play' : 'stop'}
            title={isPlay ? '暂停(P)' : '播放(P)'}
            onClick={() => props.change_is_play()}
          ></div>
          <div className='next' title='下一首(Ctrl+→)' onClick={handleClickNextBtn}></div>
        </div>

        {/* 当前播放歌曲信息 */}
        <div className='currentSongInfo'>
          <img src={currentSongInfo?.al?.picUrl + '?param=35y35'} alt='' />
          <div className='currentSongInfoRight'>
            <div className='right-t'>
              {/* 歌名 */}
              <div className='songName ellipsis-1' onClick={handleClickSongName}>
                {currentSongInfo.name}
              </div>
              {/* 歌手名 */}
              <div className='songAuthor ellipsis-1'>
                {(currentSongInfo?.ar || []).map((item: any, index: number) => {
                  return index === 0 ? (
                    <span className='songAuthor-item' onClick={() => handleClickAuthorName(item)} key={index}>
                      {item.name}
                    </span>
                  ) : (
                    <Fragment key={index}>
                      {' '}
                      /{' '}
                      <span className='songAuthor-item' onClick={() => handleClickAuthorName(item)}>
                        {item.name}
                      </span>
                    </Fragment>
                  )
                })}
              </div>
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

          <Tooltip title='重新播放'>
            <RedoOutlined className='icon' onClick={handleRePlay} />
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
          <Tooltip title={`${currentModeTip()}(M)`}>
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
        id='audio'
        ref={audioRef}
        onTimeUpdate={handleOnTimeUpdate} // 播放时间更新时触发
        onEnded={handleOnEnded} // 播放结束时触发
        // autoPlay
        onError={handleOnError} // 当在元素加载期间发生错误时运行脚本, 此时播放下一首歌
        preload='auto'
        onCanPlay={handleOncanplay} // 缓冲至目前可以播放的状态
        src={`https://music.163.com/song/media/outer/url?id=${currentSongInfo.id}.mp3`}
      ></audio>

      {/* 播放列表和歌词box */}
      <MyTransition mode='scale' in={listBoxShow} timeout={300}>
        <div className={styles.songListAndLyricWrapper}>
          <div
            className={styles.songListAndLyric}
            // //music.163.com/api/img/blur/
            style={{
              // background: `rgba(31, 31, 31, 0.9) url('${currentSongInfo?.al?.picUrl}?param=500y500') no-repeat center center/986px `,
              background: `rgba(31, 31, 31, 0.9) url('//music.163.com/api/img/blur/${currentSongInfo?.al?.pic_str}') no-repeat center center/986px `,
            }}
          >
            {/* 歌曲列表容器 */}
            <div className='songList'>
              <div className='songList-title'>
                <div className='songList-title-l'>播放列表({songList?.length || 0})</div>
                <div className='songList-title-r' title='清除播放列表' onClick={handleClearSongList}>
                  <DeleteOutlined className='icon' /> 清除
                </div>
              </div>
              {/* 列表 */}
              <div className='songList-content custom-scroll-bar'>
                {songList.map(item => {
                  return (
                    /* 列表项 */
                    <div
                      className={`songList-item ${currentSongInfo.id === item.id ? 'active' : ''}`}
                      key={item.id}
                      onClick={() => handleClickListItem(item)}
                    >
                      {/* 红色三角形 */}
                      <div className='redIcon'>
                        <CaretRightOutlined className='icon' />
                      </div>
                      {/* 歌名 */}
                      <div className='songList-item-name ellipsis-1'>{item.name}</div>
                      {/* 按钮 */}
                      <div className='btns'>
                        <DeleteOutlined title='删除' className='icon' onClick={e => delSongListItem(item.id, e)} />
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
              <div className='lyric-content custom-scroll-bar'>
                {/* 渲染歌词列表 */}
                {lyricArr.length
                  ? lyricArr.map((item, index) => {
                      return (
                        <div
                          className={`lyric-item  ellipsis-1 ${activeLyricIndex === index ? 'active' : ''}`}
                          key={index}
                        >
                          {item.content}
                        </div>
                      )
                    })
                  : null}
                {/* 空状态 */}
                {lyricArr.length === 0 ? (
                  <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Empty style={{ color: 'white' }} description='暂无歌词信息' image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </MyTransition>

      {/* 歌词轮播 */}
      {isPlay && lyricArr[activeLyricIndex]?.content ? (
        <div className={[styles['lyric-show-box'], 'ellipsis-1'].join(' ')}>{lyricArr[activeLyricIndex]?.content}</div>
      ) : null}

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
    playBarState: state.playBarState,
  }
}

// 映射dispatch
const mapDispatchToProps = (dispatch: Dispatch) => {
  // console.log(dispatch)

  return {
    clear_song_list: () => dispatch(clear_song_list()), // 清空歌曲列表
    del_song_list_item: (songId: number) => dispatch(del_song_list_item(songId)), // 删除一首歌
    change_current_song_info: (item: any) => {
      // localStorage.setItem(constants.CURRENT_SONG_INFO, JSON.stringify(item))
      dispatch(change_current_song_info(item))
    }, // 修改当前播放歌曲信息
    change_is_play: () => dispatch(change_is_play()),
  }
}

export default memo(connect(mapStateToProps, mapDispatchToProps)(withRouter(PlayBar)))
