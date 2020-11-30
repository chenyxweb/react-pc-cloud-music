// 朋友

import React from 'react'

interface IProps {}

interface IState {}

class Friend extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {}
  }

  // state: IState = {}

  render() {
    return <div>Friend</div>
  }
}

export default Friend
