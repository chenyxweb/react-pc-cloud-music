import React, { FC } from 'react'

import policeImg from 'assets/img/police.png'
import styles from './index.module.scss'

interface IProps {}

const MyFooter: FC<IProps> = () => {
  return (
    <div className={styles.MyFooter}>
      <div className={styles.container}>
        <div className='footer-left'>
          <div className='links'>
            <span className='links-text'> 服务条款 </span>
            <span> | </span>
            <span className='links-text'> 隐私政策 </span>
            <span> | </span>
            <span className='links-text'> 儿童隐私政策 </span>
            <span> | </span>
            <span className='links-text'> 版权投诉指引 </span>
            <span> | </span>
            <span className='links-text'> 意见反馈 </span>
            <span> | </span>
          </div>
          <p className='text'>
            <span>网易公司版权所有©1997-2020</span>
            <span>杭州乐读科技有限公司运营：浙网文[2018]3506-263号</span>
          </p>
          <p className='text'>
            <span>违法和不良信息举报电话：0571-89853516</span>
            <span>举报邮箱：ncm5990@163.com</span>
          </p>
          <p className='text'>
            <span>粤B2-20090191-18</span>
            <span>工业和信息化部备案管理系统网站</span>
            <span>
              <img src={policeImg} alt='' /> 浙公网安备 33010902002564号
            </span>
          </p>
        </div>
        <div className='footer-right'>
          {[1, 2, 3, 4, 5].map((item, index) => (
            <div className='footer-right-item' key={index}>
              <div className='logo'></div>
              <div className='text'></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

MyFooter.defaultProps = {}

export default MyFooter
