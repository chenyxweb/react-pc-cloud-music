// 发现音乐 - 歌曲详情页
import React, { FC, memo } from 'react'
import { RouteComponentProps } from 'react-router-dom'

interface IProps extends RouteComponentProps {}

const Song: FC<IProps> = () => {
  return <div>Song</div>
}

export default memo(Song)
