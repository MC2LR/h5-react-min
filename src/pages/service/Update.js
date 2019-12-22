/**
 * @module 信息修改
 */

import React, { Component } from 'react'
import Footer from '@/components/Footer'
import { createForm } from 'rc-form'
import { Toast,Modal } from 'antd-mobile'
import MyModal from '@/components/MyModal'
import { MyInput, phoneArea } from '@/components/MyAntdMobile'
import '@/sass/service-update.sass'

// 表单字段名
const FieldNames = [
  'cardNumber', // 证件号
  'oldPhoneNumber', // 旧手机号
  'newPhoneNumber', // 新手机号
  'identifyCode', // 验证码
  'smsIdentifyCode' // 短信验证码
]
// 倒计时秒数
const countdownSeconds = 30
let first = true

class UpdateInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataList: [], // 模态框合同列表
      modalTrigger: true, // 模态框开关
      agreementId: '', // 加密合同号
      codeImg: '', // 验证码图片
      currentError: '', // 当前错误
      errorMessage: '', // 错误信息
      countdown: countdownSeconds // 短信验证倒计时
    }
  }

  componentDidMount = () => {
    this.getContractLists()
    this.getSecurityCode()
    this.clickMenuCnt()
  }

  // 后端统计菜单访问次数
  clickMenuCnt = () => {
    this.$http.post('/menu/menuStatistics', {code : 30002}).then(res => {
    })
  }

  componentWillUnmount = () => {
    // 清除定时器
    clearInterval(this.time)
  }

  // 获取合同列表
  getContractLists = () => {
    this.$http.post('/contract/getContractListByPhone').then(res => {
      if (res.length >= 1) {
        this.setState({
          dataList: res
        })
      } else {
        Toast.fail('暂无数据')
      }
    })
  }

  /**
   * 获取合同详情(模态框回调)
   * @param {String} encryptKey 加密合同号
   */
  modalCallBack = encryptKey => {
    this.$http.post('/apply/modifyInformation', {
      agreementId: encryptKey
    })
    this.setState({
      agreementId: encryptKey,
      modalTrigger: false
    })
  }

  // 获取验证码
  getSecurityCode = () => {
    this.$http.post('/apply/getModifyPhoneCode').then(res => {
      this.setState({
        codeImg: res
      })
    })
  }

  // 获取动态验证码
  getMessage = () => {
    const { validateFields } = this.props.form
    validateFields(FieldNames[2], {}, (err, value) => {
      if (!err) {
        this.setState({
          errorMessage: ''
        })
        this.$http
          .post('/apply/getModifyPhoneSmsCode', {
            [FieldNames[2]]: value[FieldNames[2]]
          })
          .then(res => {
            Toast.success('短信已发送')
            const startTime = new Date().getTime()
            this.time = setInterval(() => {
              let time = parseInt((new Date().getTime() - startTime) / 1000)
              if (time < countdownSeconds) {
                this.setState({
                  countdown: countdownSeconds - time
                })
              } else {
                clearInterval(this.time)
                this.setState({
                  countdown: countdownSeconds
                })
              }
            }, 1000)
          })
      } else {
        Toast.info(err[FieldNames[2]].errors[0].message)
        // this.setState({
        //   currentError: FieldNames[2],
        //   errorMessage: err[FieldNames[2]].errors[0].message
        // })
      }
    })
  }

  // 提交信息修改表单
  submitButton = () => {
    const { validateFields, getFieldsError } = this.props.form
    validateFields((err, value) => {
      // 初始化错误信息
      this.setState({
        errorMessage: ''
      })
      // 表单验证
      if (!err) {
        this.$http
          .post('/apply/modifyPhoneNumber', {
            agreementId: this.state.agreementId,
            [FieldNames[0]]: value[FieldNames[0]],
            [FieldNames[1]]: +value[FieldNames[1]],
            [FieldNames[2]]: +value[FieldNames[2]],
            [FieldNames[3]]: value[FieldNames[3]].toUpperCase(),
            [FieldNames[4]]: value[FieldNames[4]]
          })
          .then(res => {
            this.$closeWindow()
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
    const {
      codeImg,
      errorMessage,
      currentError,
      dataList,
      modalTrigger,
      countdown
    } = this.state

    return (
      <div className='view'>
        <div className='view-content'>
          <MyModal
            dataList={dataList}
            modalTrigger={modalTrigger}
            modalCallBack={this.modalCallBack}
          />
          <div className='service-update'>
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
            {/* 证件输入框 */}
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
            {/* 原手机号输入框 */}
            <MyInput
              type='tel'
              className='row-height'
              placeholder='请输入借款人原手机号'
              maxLength={11}
              {...getFieldProps(FieldNames[1], {
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
                currentError === FieldNames[1]
                  ? getFieldError(FieldNames[1])
                  : null
              }
            >
              {phoneArea}
            </MyInput>
            {/* 新手机号输入框 */}
            <MyInput
              type='tel'
              className='row-height'
              placeholder='请输入借款人新手机号'
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
              type='text'
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
            {/* 动态输入框 */}
            <MyInput
              type='text'
              className='row-height'
              placeholder='请输入动态验证码'
              maxLength={6}
              {...getFieldProps(FieldNames[4], {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '请填写完整信息'
                  }
                ]
              })}
              extra={
                countdown <= 0 || countdown === countdownSeconds ? (
                  <button className='get-message' onClick={this.getMessage}>
                    获取验证码
                  </button>
                ) : (
                  <button className='get-message countdown'>
                    {countdown + 's'}
                  </button>
                )
              }
              err={
                currentError === FieldNames[4]
                  ? getFieldError(FieldNames[4])
                  : null
              }
            />
            {/* 错误提示 */}
            <p className='error-message'>{errorMessage}</p>
            <button
              className='submit-btn btn-margin'
              onClick={this.submitButton}
            >
              提交
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

export default createForm()(UpdateInfo)
