import React, { FC, CSSProperties } from 'react'
import { Spin } from 'antd'
import styles from './index.module.scss'
import { SpinIndicator } from 'antd/lib/spin'
import { LoadingOutlined } from '@ant-design/icons'

interface IProps {
  indicator?: SpinIndicator // loading 图标
  text?: string // 文本
  textStyle?: CSSProperties // 文本样式
}

const LoadingPage: FC<IProps> = ({ indicator, text, textStyle }) => {
  return (
    <div className={styles.LoadingPage}>
      <div className={styles.loading}>
        <Spin indicator={indicator}></Spin>
        <div style={textStyle}>{text}</div>
      </div>
    </div>
  )
}

LoadingPage.defaultProps = {
  indicator: <LoadingOutlined style={{ fontWeight: 700, fontSize: 32 }} />,
  text: '页面加载中...',
  textStyle: { fontWeight: 700, fontSize: 14 },
}

export default LoadingPage
