// 用户列表
import React, { FC } from 'react'
import styles from './index.module.scss'

interface IProps {
  list: any[]
}

const UserList: FC<IProps> = () => {
  return <div className={styles.UserList}>UserList</div>
}

UserList.defaultProps = {}

export default UserList
