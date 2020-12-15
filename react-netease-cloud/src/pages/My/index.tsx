// 我的音乐

import React from 'react'
import styles from './index.module.scss'

interface IProps {}

interface IState {}

class My extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {}
  }

  // state: IState = {}

  render() {
    return (
      <div className={styles.My}>
        <div className={[styles.wrapper, 'w980'].join(' ')}>
          <div className={styles.img}></div>
        </div>
      </div>
    )
  }
}

export default My
