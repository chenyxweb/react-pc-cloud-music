import React, { FC } from 'react'
import styles from './index.module.scss'

interface IProps {}

const Login: FC<IProps> = () => {
  return <div className={styles.Login}>Login</div>
}

Login.defaultProps = {}

export default Login
