import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import { connect, DispatchProp } from 'react-redux'
import { update_user_info } from 'store/userInfo/actions'
import qs from 'qs'
import styles from './index.module.scss'
import { withRouter } from 'react-router-dom'
import { RouteConfigComponentProps } from 'react-router-config'
import { Button, Form, Input, FormInstance, message } from 'antd'
import qr_login_icon from 'assets/img/qr_login_icon.png'
import md5 from 'md5'
import http from 'service/http'
import { ReloadOutlined } from '@ant-design/icons'

interface IProps {}

const Login: FC<IProps & DispatchProp & RouteConfigComponentProps> = props => {
  const [loginType, setLoginType] = useState<'qrCode' | 'account'>('account') // 二维码 | 账号登录
  const [qrKey, setQrKey] = useState('') // 二维码key
  const [qrImg, setQrImg] = useState('') // 二维码图片
  const [qrCodeStatus, setQrCodeStatus] = useState<number>() // 800为二维码过期, 801为等待扫码, 802为待确认, 803为授权登录成功
  const [refreshTS, setRefreshTS] = useState<number>() // 点击刷新二维码的时间戳

  const formRef = useRef<FormInstance>(null) // 表单ref

  // 获取验证码key
  useEffect(() => {
    if (loginType === 'account') return

    try {
      http.generateQrKey().then(res => {
        if (res.data.code === 200) {
          const { unikey } = res.data.data || {}
          console.log('验证码key: ', unikey)
          setQrKey(unikey)
        }
      })
    } catch (error) {
      message.error(error.message)
    }
  }, [loginType, refreshTS])

  // 获取二维码, 只要qrKey改变 就获取 二维码
  useEffect(() => {
    if (!qrKey) return

    try {
      http.generateQrCode({ key: qrKey, qrimg: 'qrimg' }).then(res => {
        if (res.data.code === 200) {
          const { qrimg } = res.data.data || {}
          console.log(qrimg)
          setQrImg(qrimg)
          // 重置qrCodeStatus 状态 801
          setQrCodeStatus(801)
        }
      })
    } catch (error) {
      message.error(error.message)
    }
  }, [qrKey])

  // 登录成功后处理
  const handleLoginSuccess = useCallback(() => {
    // // 用户信息存store,存localStorage
    // props.dispatch(update_user_info(userInfo))
    // localStorage.setItem('USER_INFO', JSON.stringify(userInfo))

    message.success('登录成功')

    // 登录成功之后回跳from页面
    const search = props.location.search || ''

    const queryObj = qs.parse(search.split('?')[1]) || {}

    if (queryObj.from) {
      // 去from页面
      // props.history.replace(decodeURIComponent(queryObj.from as string))
      window.location.href = decodeURIComponent(queryObj.from as string)
    } else {
      // 去首页
      props.history.replace('/')
    }
  }, [props.history, props.location.search])

  // 轮询获取二维码状态
  useEffect(() => {
    if (!qrKey || loginType === 'account') return

    const timeId = setInterval(() => {
      try {
        http.checkQrStatus({ key: qrKey }).then(res => {
          console.log(res.data?.message)
          // 解释 : 800为二维码过期, 801为等待扫码, 802为待确认, 803为授权登录成功(803状态码下会返回cookies)
          const { code, cookie, message } = res.data || {}

          // 存储二维码状态
          if (code !== qrCodeStatus) {
            setQrCodeStatus(code)
          }

          // 判断
          if (code === 800) {
            // 二维码过期,点击刷新二维码
          } else if (code === 803) {
            // 登录成功, cookie 自动存储, 跳到from页面
            handleLoginSuccess()
          } else if (code === 802) {
            // 扫码完成, 但未确认授权
          }
        })
      } catch (error) {
        message.error(error.message)
      }
    }, 3000)

    // 清除定时器
    return () => {
      clearInterval(timeId)
    }
  }, [handleLoginSuccess, loginType, qrCodeStatus, qrKey])

  // 手机号登录
  const handlePhoneLogin = (data: { phone: string; md5_password: string }) => {
    console.log('手机号登录', data)
    http
      .phoneLogin(data)
      .then(res => {
        console.log(res)
        // 登录成功
        if (res.data.code === 200) {
          handleLoginSuccess()
        } else {
          message.error(res.data?.message || '系统异常')
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  // email登录
  const handleEmailLogin = (data: { email: string; md5_password: string }) => {
    console.log('email登录', data)
    return message.info('暂不支持邮箱登录')
    // http
    //   .emailLogin(data)
    //   .then(res => {
    //     console.log(res)
    //     // 登录成功
    //     handleLoginSuccess()
    //   })
    //   .catch(err => {
    //     console.log(err)
    //   })
  }

  // 校验成功
  const onFinish = (values: any) => {
    let { username, password } = values || {}
    // handleAccountLogin(values)
    const md5_password = md5(password)

    // 判断是手机号还是邮箱
    if (username.includes('@')) {
      // 邮箱登录
      handleEmailLogin({ email: username, md5_password })
    } else {
      // 手机号登录
      handlePhoneLogin({ phone: username, md5_password })
    }
  }

  // 校验失败
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  // 重置表单
  const resetForm = () => {
    formRef.current && formRef.current.resetFields()
  }

  // 刷新二维码
  const refreshQR = () => {
    console.log('哈哈哈')
    // 重置status
    setQrCodeStatus(801)
    // setRefreshTS
    setRefreshTS(Date.now())
  }

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
  }

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  }

  return (
    <div className={styles.Login}>
      <div className={styles.form}>
        <div className={styles.title}>{loginType === 'account' ? '账号登录' : '二维码登录'}</div>
        <div className={styles.content}>
          {/* 账号登录 */}
          {loginType === 'account' ? (
            <div className={styles.accountLogin}>
              <Form
                ref={formRef}
                {...layout}
                name='basic'
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
              >
                <Form.Item label='账号' name='username' rules={[{ required: true, message: '请输入用户名!' }]}>
                  <Input placeholder='请输入手机号' />
                </Form.Item>

                <Form.Item label='密码' name='password' rules={[{ required: true, message: '请输入密码!' }]}>
                  <Input.Password placeholder='请输入密码' />
                </Form.Item>

                <Form.Item {...tailLayout}>
                  <Button type='primary' htmlType='submit'>
                    登录
                  </Button>
                  <Button onClick={resetForm} style={{ marginLeft: 45 }}>
                    重置
                  </Button>
                </Form.Item>
              </Form>

              {/* 二维码图标 */}
              <img
                className={styles.qr_login_icon}
                onClick={() => setLoginType('qrCode')}
                title='二维码登录'
                alt=''
                src={qr_login_icon}
              />
            </div>
          ) : null}

          {/* 二维码登录 */}
          {loginType === 'qrCode' ? (
            <div className={styles.qrLogin}>
              <div className={styles.qrWrapper}>
                {/* 验证码过期展示 */}
                {qrCodeStatus === 800 ? (
                  <div className={styles.outdate}>
                    <span style={{ fontWeight: 700 }}>二维码已失效</span>
                    <Button size='small' style={{ width: 100 }} onClick={refreshQR}>
                      <ReloadOutlined />
                      点击刷新
                    </Button>
                  </div>
                ) : null}

                {/* 验证码 */}
                {qrImg ? <img className={styles.qr} src={qrImg} alt='' /> : null}
              </div>
              <div className={styles.tips}>
                使用{' '}
                <a
                  href='https://music.163.com/#/download'
                  target='_blank
                '
                >
                  网易云音乐APP
                </a>{' '}
                扫码登录
              </div>
              <div className='switch-account-login' onClick={() => setLoginType('account')}>
                账号登录
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

Login.defaultProps = {}

export default withRouter(connect()(Login))
