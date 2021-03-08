// 歌手列表
import { UserOutlined } from '@ant-design/icons'
import React, { FC, memo } from 'react'
import LazyLoad from 'react-lazyload'
import { RouteComponentProps, withRouter } from 'react-router'
import styles from './index.module.scss'

interface IProps {
  list: any[]
}

const ArtistList: FC<IProps & RouteComponentProps> = (props) => {
  console.log('list: ', props)
  const { list } = props

  // 去歌手页
  const go2Artist = (id: number) => {
    id && props.history.push(`/discover/artist-detail/${id}`)
  }

  // 去用户页
  const go2User = (id: number) => {
    id && props.history.push(`/user/home/${id}`)
  }

  return (
    <div className={styles.ArtistList}>
      {list?.map((item, index) => {
        return (
          <div className={styles.ArtistListItemWrapper} key={index}>
            <div className={styles.ArtistListItem}>
              <LazyLoad height={156}>
                <img src={item?.picUrl + '?param=130y130'} alt="" onClick={() => go2Artist(item?.id)} />
              </LazyLoad>
              <div className="bot">
                <div className="user-name">{item?.name}</div>
                {item?.accountId ? <UserOutlined className="icon" onClick={() => go2User(item?.accountId)} /> : null}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

ArtistList.defaultProps = {}

export default withRouter(memo(ArtistList))
