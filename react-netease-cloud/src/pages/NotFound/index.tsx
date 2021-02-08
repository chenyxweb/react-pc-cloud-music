import React, { FC } from 'react'
import styles from './index.module.scss'

interface IProps {}

const NotFound: FC<IProps> = () => {
  return <div className={styles.NotFound}>NotFound 404</div>
}

NotFound.defaultProps = {}

export default NotFound
