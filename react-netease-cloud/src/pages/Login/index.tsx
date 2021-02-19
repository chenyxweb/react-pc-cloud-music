import React, { FC, useEffect, useRef, useState } from 'react'
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

interface IProps {}

const Login: FC<IProps & DispatchProp & RouteConfigComponentProps> = props => {
  const [loginType, setLoginType] = useState<'qrCode' | 'account'>('account') // 二维码 | 账号登录
  const [qrKey, setQrKey] = useState('') // 二维码key
  const [qrImg, setQrImg] = useState('') //

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
  }, [loginType])

  // 获取二维码, 只要qrKey改变 就获取 二维码
  useEffect(() => {
    if (!qrKey) return

    try {
      http.generateQrCode({ key: qrKey, qrimg: 'base64' }).then(res => {
        if (res.data.code === 200) {
          const { qrimg } = res.data.data || {}
          console.log(qrimg)
          setQrImg(qrimg)
        }
      })
    } catch (error) {
      message.error(error.message)
    }
  }, [qrKey])

  // 轮询获取二维码状态
  useEffect(() => {
    if (!qrKey) return

    const timeId = setInterval(() => {
      try {
        http.checkQrStatus({ key: qrKey }).then(res => {
          console.log(res)
          // TODO
          
        })
      } catch (error) {
        message.error(error.message)
      }
    }, 3000)

    return () => {
      clearInterval(timeId)
    }
  }, [qrKey])

  // 账号密码登录
  const handleAccountLogin = (values: any) => {
    console.log(values)

    const userInfo = {
      username: 'admin',
      avatar: '',
      token: 'AHASDFSJFASNF_13123SDAF',
      authRoutes: [],
    }

    // 用户信息存store,存localStorage
    props.dispatch(update_user_info(userInfo))
    localStorage.setItem('USER_INFO', JSON.stringify(userInfo))

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
  }

  // 手机号登录
  const handlePhoneLogin = (data: { phone: string; md5_password: string }) => {
    console.log('手机号登录', data)
    http
      .phoneLogin(data)
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  }

  // email登录
  const handleEmailLogin = (data: { email: string; md5_password: string }) => {
    console.log('email登录', data)
    http
      .emailLogin(data)
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  }

  // 校验成功
  const onFinish = (values: any) => {
    const { username, password } = values || {}
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
                  <Input placeholder='手机号' />
                </Form.Item>

                <Form.Item label='密码' name='password' rules={[{ required: true, message: '请输入密码!' }]}>
                  <Input.Password />
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
              <img className={styles.qr} src={qrImg} alt='' />
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
