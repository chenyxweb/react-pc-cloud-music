// 音乐播放条
import { CaretRightOutlined, CloseOutlined, DeleteOutlined, DownloadOutlined, RedoOutlined } from '@ant-design/icons'
import React, { FC, useState } from 'react'
import { message, Slider, Tooltip } from 'antd'
import MyTransition from 'components/MyTransition'
import { connect } from 'react-redux'
import { ICombineState } from 'store'
import { Dispatch } from 'redux'
import dayjs from 'dayjs'
import utils from 'utils/utils'
import styles from './index.module.scss'
import { clear_song_list, del_song_list_item } from 'store/songList/actions'

interface IProps {
  clear_song_list: () => any
  del_song_list_item: (songId: number) => any
}

const mode = ['loop', 'shuffle', 'one'] // 顺序播放/随机播放/单曲循环

const PlayBar: FC<IProps & ICombineState> = props => {
  console.log('PlayBar-props: ', props)

  const { songList, currentSongInfo } = props

  const [lock, setLock] = useState(true) // 是否锁住
  const [playBarShow, setPlayBarShow] = useState(false) // 是否展示
  const [isPlay, setIsPlay] = useState(false) // 是否正在播放
  const [currentMode, setCurrentMode] = useState('loop') // 当前播放模式
  const [voiceBarShow, setVoiceBarShow] = useState(false) // 音量调节的bar是否显示
  const [listBoxShow, setListBoxShow] = useState(false) // 歌曲列表和歌词容器的显隐
  const [volume, setVolume] = useState(50) // 播放音量

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
                <Slider step={0.1} tooltipVisible={false} />
              </div>
              <div className='time'>
                {/* 歌曲已播放时长 */}
                <span className='play-time'>01:37 </span>
                {/* 歌曲总时长 */}
                <span className='total-time'>/ {dayjs(currentSongInfo.dt).format('mm:ss')}</span>
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
                  <Slider vertical value={volume} onChange={(value: number) => setVolume(value)} />
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
      {/* <audio loop autoPlay src="https://music.163.com/song/media/outer/url?id=65533.mp3"></audio> */}

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
                小娟(化名)
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
