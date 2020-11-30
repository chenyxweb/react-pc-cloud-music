// 我的音乐

import React from 'react'

interface IProps {}

interface IState {}

class My extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {}
  }

  // state: IState = {}

  render() {
    return <div>My</div>
  }
}

export default My
