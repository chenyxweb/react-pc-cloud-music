// 音乐播放条
import React, { FC } from 'react'

import styles from './index.module.scss'

interface IProps {}

const PlayBar: FC<IProps> = () => {
  return <div className={styles.PlayBar}>PlayBar</div>
}

PlayBar.defaultProps = {}

export default PlayBar
