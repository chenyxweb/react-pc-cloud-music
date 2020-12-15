// 动画组件

import React, { FC } from 'react'
import { CSSTransition } from 'react-transition-group'
import { CSSTransitionProps } from 'react-transition-group/CSSTransition'
import './index.scss'

interface IProps {
  /** 动画名称 */
  mode?: 'scale' | 'fade'
}

const MyTransition: FC<IProps & CSSTransitionProps> = props => {
  const { mode, children, ...restProps } = props
  return (
    <CSSTransition classNames={`transition-${mode}`} {...restProps}>
      {children}
    </CSSTransition>
  )
}

MyTransition.defaultProps = {
  mode: 'fade',
}

export default MyTransition
