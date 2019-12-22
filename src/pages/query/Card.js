/**
 * @module 绑定证件号码
 */

import React, { Component } from 'react'
import '@/sass/query-card.sass'
import Footer from '@/components/Footer'
import { createForm } from 'rc-form'
import { Toast, Modal } from 'antd-mobile'
import { MyInput } from '@/components/MyAntdMobile'

// 表单字段名
const FieldNames = [
  'nationalId', // 证件号
  'identifyCode' // 验证码
]

let first = true

class BindId extends Component {
  constructor(props) {
    super(props)
    this.state = {
      codeImg: '', // 验证码图片
      currentError: '', // 当前错误
      errorMessage: '' // 错误信息
    }
  }

  componentDidMount() {
    this.getSecurityCode()
  }

  // 获取验证码
  getSecurityCode = () => {
    this.$http.post('/contract/getContractCode').then(res => {
      this.setState({
        codeImg: res
      })
    })
  }

  // 确认证件信息
  bindButton = () => {
    const { validateFields, getFieldsError } = this.props.form
    validateFields((err, value) => {
      // 初始化错误信息
      this.setState({
        errorMessage: ''
      })
      if (!err) {
        value[FieldNames[1]] = value[FieldNames[1]].toUpperCase() // identifyCode
        this.$http
          .post('/contract/validNationalId', value)
          .then(res => {
            sessionStorage.unBind = JSON.stringify(res)
            this.props.history.push(`${this.$base}/query-new`)
          })
          .catch(err => {
            setTimeout(this.getSecurityCode, 3000)
          })
      } else {
        // 显示错误信息
        let err = getFieldsError()
        for (let i in err) {
          if (err[i] && err[i].includes('请填写完整信息')) {
            Toast.info('请填写完整信息', 2)
            return
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

  render() {
    const { getFieldProps, getFieldError } = this.props.form
    const { codeImg, currentError, errorMessage } = this.state
    return (
      <div className='view'>
        <div className='view-content'>
          <div className='query-card'>
            <Modal
              visible={this.state.prompt}
              transparent
              maskClosable={true}
              footer={[
                {
                  text: '确定',
                  onPress: () => {
                    this.notionalId.focus()
                    this.setState({
                      prompt: false
                    })
                  }
                }
              ]}
              onClose={() => {
                this.setState({
                  prompt: false
                })
              }}
            >
              <div>
                如果大陆居民证件号末尾为"X", 请大写！
              </div>
            </Modal>
            <div className='cover-wrapper'>
              <div
                className='cover'
                style={{ display: first ? 'block' : 'none' }}
                onClick={() => {
                  first &&
                    this.setState({
                      prompt: true
                    })
                  first = false
                }}
              />
            <MyInput
              type='text'
              className='row-height'
              inputRef={v => {
                this.notionalId = v
              }}
              maxLength={45}
              placeholder='请输入绑定时的证件号码'
              {...getFieldProps(FieldNames[0], {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '请填写完整信息'
                  },
                  {
                    pattern: /^[\u4e00-\u9fa5\dA-z\\(\\)]*$/g,
                    message: '请输入正确格式的证件号码'
                  }
                ]
              })}
              err={
                currentError === FieldNames[0]
                  ? getFieldError(FieldNames[0])
                  : null
              }
            />
            </div>
            <MyInput
              type='text'
              className='row-height'
              placeholder='请输入验证码'
              maxLength={4}
              {...getFieldProps(FieldNames[1], {
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
              extra={
                <img
                  className='security-code'
                  src={codeImg}
                  alt='验证码'
                  onClick={this.getSecurityCode}
                />
              }
              err={
                currentError === FieldNames[1]
                  ? getFieldError(FieldNames[1])
                  : null
              }
            />

            {/* 错误提示 */}
            <p className='error-message'>{errorMessage}</p>
            <button className='submit-btn btn-margin' onClick={this.bindButton}>
              确定
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

export default createForm()(BindId)
