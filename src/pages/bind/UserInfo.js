/**
 * @module 身份绑定
 */

import React, { Component } from 'react'
import Footer from '@/components/Footer'
import Agreement from './Agreement'
import { Link } from 'react-router-dom'
import { createForm } from 'rc-form'
import { Picker, Toast } from 'antd-mobile'
import { MyInput, phoneArea } from '@/components/MyAntdMobile'
import '@/sass/bind-userinfo.sass'

// 表单字段名
const FieldNames = [
  'userName', // 用户名
  'cardNumber', // 证件号
  'phoneNumber', // 手机号
  'identifyCode' // 验证码
]

class BindIdentity extends Component {
  constructor(props) {
    super(props)
    this.state = {
      codeImg: '', // 验证码图片
      cardType: 1, // 当前证件
      // 证件选择框
      cardData: [
        {
          label: '大陆居民证件',
          value: 1
        },
        {
          label: '其他证件',
          value: 2
        }
      ],
      currentError: '', // 当前错误
      errorMessage: '' // 验证错误信息
    }
  }

  componentDidMount() {
    this.getSecurityCode()
    this.clickMenuCnt()
  }

  // 后端统计菜单访问次数
  clickMenuCnt = () => {
    this.$http.post('/menu/menuStatistics', {code : 10001}).then(res => {
    })
  }

  // 提交绑定信息表单
  submit = () => {
    const { validateFields, getFieldsError } = this.props.form
    validateFields((err, value) => {
      // 初始化错误信息
      this.setState({
        errorMessage: ''
      })
      // 表单验证
      if (!err) {
        this.$http
          .post('/user/bind', {
            cardType: +this.state.cardType, // cardType
            [FieldNames[0]]: value[FieldNames[0]], // userName
            [FieldNames[1]]: value[FieldNames[1]], // cardNumber
            [FieldNames[2]]: +value[FieldNames[2]], // phoneNumber
            [FieldNames[3]]: value[FieldNames[3]].toUpperCase() // identifyCode
          })
          .then(res => {
            localStorage.token = ''
            this.$closeWindow()
          })
          .catch(err => {
            setTimeout(this.getSecurityCode, 3000)
          })
      } else {
        // 显示错误信息
        let err = getFieldsError()
        for (let i in err) {
          if (err[i]) {
            if (err[i].includes('请填写完整信息')) {
              Toast.info('请填写完整信息', 2)
              return
            }
            if (err[i].includes('请阅读《绑定协议》并同意')) {
              Toast.info('请阅读《绑定协议》并同意', 2)
              return
            }
          }
        }
        for (let i in err) {
          if (err[i]) {
            this.setState({
              currentError: i,
              errorMessage: '' + err[i]
            })
            return
          }
        }
      }
    })
  }

  // 获取验证码
  getSecurityCode = () => {
    this.$http.post('/user/getBindCode').then(res => {
      this.setState({
        codeImg: res
      })
    })
  }

  render() {
    const { getFieldProps, resetFields, getFieldError } = this.props.form
    const {
      codeImg,
      errorMessage,
      cardType,
      cardData,
      currentError
    } = this.state


    // 不同证件框的渲染
    let maxLength, placeholder, text, options
    switch (cardType) {
      case 1:
        maxLength = 18
        placeholder = '18或15位身份证'
        text = '大陆居民证件'
        options = {
          initialValue: '',
          rules: [
            {
              required: true,
              message: '请填写完整信息'
            },
            {
              pattern: /(^\d{15}$)|(^\d{17}(\d|X|x)$)/,
              message: '请输入正确格式的证件号码'
            }
          ]
        }
        break
      case 2:
        maxLength = 45
        placeholder = '请输入证件号码'
        text = '其他证件'
        options = {
          initialValue: '',
          rules: [
            {
              required: true,
              message: '请填写完整信息'
            },
            {
              pattern: /^[\u4e00-\u9fa5\\(\\)\dA-z]*$/g,
              message: '请输入正确格式的证件号码'
            }
          ]
        }
        break
      default:
        break
    }
    return (
      <div className='view'>
        <div className='view-content'>
          <div className='bind-userinfo'>
            {/* 姓名输入框 */}
            <div className='name'>姓名</div>
            <MyInput
              placeholder='借款人姓名'
              maxLength={20}
              {...getFieldProps(FieldNames[0], {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '请填写完整信息'
                  },
                  {
                    pattern: /^[\u4e00-\u9fa5·A-z]{1,20}$/g,
                    message: '请输入正确格式的姓名'
                  }
                ]
              })}
              err={
                currentError === FieldNames[0]
                  ? getFieldError(FieldNames[0])
                  : null
              }
            />
            {/* 证件输入框 */}
            <MyInput
              className='row-height'
              maxLength={maxLength}
              placeholder={placeholder}
              {...getFieldProps(FieldNames[1], options)}
              err={
                currentError === FieldNames[1]
                  ? getFieldError(FieldNames[1])
                  : null
              }
            >
              <Picker
                data={cardData}
                cols={1}
                value={cardType}
                onChange={cardType => {
                  this.setState({ cardType: +cardType })
                  resetFields(FieldNames[1])
                }}
              >
                <div>
                  <p className='with-arrow'>{text}</p>
                  <div className='arrow' />
                </div>
              </Picker>
            </MyInput>
            {/* 手机输入框 */}
            <MyInput
              type='tel'
              className='row-height'
              placeholder='贷款时预留的手机号码'
              maxLength={11}
              {...getFieldProps(FieldNames[2], {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '请填写完整信息'
                  },
                  {
                    pattern: /^\d{11}$/,
                    message: '请输入正确格式的手机号'
                  }
                ]
              })}
              err={
                currentError === FieldNames[2]
                  ? getFieldError(FieldNames[2])
                  : null
              }
            >
              {phoneArea}
            </MyInput>
            {/* 验证码输入框 */}
            <MyInput
              className='row-height'
              placeholder='请输入验证码'
              maxLength={4}
              {...getFieldProps(FieldNames[3], {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '请填写完整信息'
                  },
                  {
                    pattern: /^[\dA-z]{4}$/g,
                    message: '请输入正确格式的验证码'
                  }
                ]
              })}
              err={
                currentError === FieldNames[3]
                  ? getFieldError(FieldNames[3])
                  : null
              }
              extra={
                <img
                  className='security-code'
                  src={codeImg}
                  alt='验证码'
                  onClick={this.getSecurityCode}
                />
              }
            />
            {/* 错误提示 */}
            <p className='error-message'>{errorMessage}</p>
            {/* 协议勾选框 */}
            <div className='agree-check'>
              <label htmlFor='bindingAgreement'>
                <div className='wrapper'>
                  <input
                    id='bindingAgreement'
                    type='checkbox'
                    className='agree'
                    {...getFieldProps('agree', {
                      rules: [
                        {
                          validator: (rule, value, cb) => {
                            if (value) {
                              cb()
                            } else {
                              cb('请阅读《绑定协议》并同意')
                            }
                          }
                        }
                      ]
                    })}
                  />
                  <span />
                </div>
                &nbsp;&nbsp;同意
              </label>
              <Link
                to={{
                  pathname: this.props.location.pathname,
                  search: `?agreement=true`
                }}
              >
                《服务平台条款与条件》
              </Link>
            </div>
            {/* 提交按钮 */}
            <button className='submit-btn btn-margin' onClick={this.submit}>
              提交
            </button>
            <p className='prompt-grey'>
              温馨提示：每位微信用户每天最多可绑定6次，若6次绑定均失败，则当天不可再绑定，24小时后系统自动解锁，请再次尝试
            </p>
          </div>
        </div>
        <Agreement show={this.$getUrlParams().agreement} />
        <Footer />
      </div>
    )
  }
}

export default createForm()(BindIdentity)
