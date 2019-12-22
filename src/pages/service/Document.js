/**
 * @module 汇款凭证
 */

import React, { Component } from 'react'
import Footer from '@/components/Footer'
import { List, ImagePicker, Toast, Modal } from 'antd-mobile'
import { MyPicker, MyDatePicker, MyInput } from '@/components/MyAntdMobile'
import { createForm } from 'rc-form'
import { config } from '@/config'
import compressImg from '@/plugins/compressImg'
import MyModal from '@/components/MyModal'
import '@/sass/service-document.sass'

// 表单字段名
const FieldNames = [
  'remitCertifyUrl', // 汇款凭证图片
  'remitCertifyType', // 汇款凭证类型
  'remitName', // 汇款人姓名
  'remitAmount', // 汇款金额
  'remitTime', // 汇款时间
  'identifyCode' // 验证码
]
const { encryption } = config
let first = true

class RemittanceDocument extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {}, // 合同数据
      dataList: [], // 模态框数据列表
      modalTrigger: true, // 模态框开关
      imageModalTrigger: false, // 图片模态框开关
      bigImage: '', // 大图显示
      codeImg: '', // 验证码
      files: [], // 图片列表
      imagesUrl: [], // 图片路径
      agreementId: '', // 加密合同号
      // 汇款类型数据
      remittanceTypeData: [
        {
          label: '提前还款',
          value: 1
        },
        {
          label: '月供还款',
          value: 2
        }
      ],
      currentError: '', // 当前错误
      errorMessage: '' // 错误信息
    }
  }

  componentDidMount = () => {
    this.getData()
    this.getSecurityCode()
    this.clickMenuCnt()
  }

  // 后端统计菜单访问次数
  clickMenuCnt = () => {
    this.$http.post('/menu/menuStatistics', {code : 30003}).then(res => {
    })
  }

  // 获取合同列表
  getData = () => {
    this.$http.post('/contract/getContractListByRemit').then(res => {
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
    this.setState({
      agreementId: encryptKey
    })
    this.$http
      .post('/contract/searchContractByRemit', {
        agreementId: encryptKey
      })
      .then(res => {
        this.setState({
          data: res,
          modalTrigger: false
        })
      })
  }

  // 获取验证码
  getSecurityCode = () => {
    this.$http.post('/apply/getRemitCode').then(res => {
      this.setState({
        codeImg: res
      })
    })
  }

  // 提交汇款凭证表单
  submitButton = () => {
    const { validateFields, getFieldsError } = this.props.form
    validateFields((err, value) => {
      // 初始化错误信息
      this.setState({
        errorMessage: ''
      })
      if (!err) {
        // 提交接口
        this.$http
          .post('/apply/addRemitCertify', {
            agreementId: this.state.agreementId, // agreementId
            [FieldNames[0]]: this.state.imagesUrl, //  remitCertifyUrl
            [FieldNames[1]]: +value[FieldNames[1]], // remitCertifyType
            [FieldNames[2]]: value[FieldNames[2]], // remitName
            [FieldNames[3]]: value[FieldNames[3]], // remitAmount
            [FieldNames[4]]: value[FieldNames[4]]
              ? this.$moment(value[FieldNames[4]]).format('YYYY-MM-DD')
              : '', //remitTime
            [FieldNames[5]]: value[FieldNames[5]].toUpperCase() // identifyCode
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
          if (err[i] && err[i].includes('请选择汇款凭证照片')) {
            Toast.info('请选择汇款凭证照片', 2)
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

  // 图片上传
  uploadImg = file => {
    // 将file文件转换为formdata格式
    const fileData = new FormData()
    fileData.append('file', file)
    // fetch方法请求图片路径接口
    this.$http
      .post('/file/uploadOne', fileData)
      .then(res => {
        const imagesUrl = [...this.state.imagesUrl]
        imagesUrl.push(res)
        this.setState({
          imagesUrl
        })
      })
      .catch(err => {
        Toast.offline('图片上传失败，请稍后再试')
        const files = [...this.state.files]
        files.pop()
        this.setState({
          files
        })
      })
  }

  /**
   * 图片选择
   * @param {Array} files 图片列表
   */
  selectImages = (files, type, index) => {
    this.setState({
      files
    })
    if (type === 'remove') {
      const imagesUrl = [...this.state.imagesUrl]
      imagesUrl.splice(index, 1)
      this.setState({
        imagesUrl
      })
    } else if (type === 'add') {
      let i = files.length - 1
      const pendingCompress = new Promise(resolve => {
        // 图片压缩
        compressImg(files[i].url, base64 => {
          files[i].file = this.dataURLtoFile(
            base64,
            files[i].file.name.replace(/\.\w*/, '.jpeg')
          )
          files[i].url = base64
          resolve()
        })
      })
      pendingCompress.then(res => {
        this.uploadImg(files[i].file)
      })
    }
  }

  /**
   * base64转file格式
   * @param {String} dataurl base64地址
   * @param {String} filename 文件名
   */
  dataURLtoFile = (dataurl, filename) => {
    //将base64转换为文件
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime })
  }

  render() {
    const { getFieldProps, getFieldError } = this.props.form
    const {
      data,
      dataList,
      modalTrigger,
      imageModalTrigger,
      remittanceTypeData,
      bigImage,
      files,
      codeImg,
      currentError,
      errorMessage
    } = this.state
    const {
      agreementId = encryption,
      customerName = encryption,
      nationalId = encryption,
      uploadCnt = 4
    } = data
    const disableButton = Object.keys(data).length === 0
    return (
      <div className='view'>
        <div className='view-content'>
          <MyModal
            dataList={dataList}
            modalTrigger={modalTrigger}
            modalCallBack={this.modalCallBack}
          />
          <div className='service-document'>
            <Modal
              className='service-document-modal'
              visible={imageModalTrigger}
              transparent
              maskClosable={true}
              onClose={() => {
                this.setState({
                  imageModalTrigger: false
                })
              }}
            >
              <img src={bigImage} alt='显示大图' className='image-size' />
            </Modal>
            <Modal
              visible={this.state.prompt}
              transparent
              maskClosable={true}
              footer={[
                {
                  text: '确定',
                  onPress: () => {
                    this.money.focus()
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
                请确保您填写的金额与汇款凭证上显示的金额一致，最终到账金额以我司实际收到的为准
              </div>
            </Modal>
            <div className='contract-info'>
              <div className='contract-info-name'>
                <p>合同号：</p>
                <p>贷款人姓名：</p>
                <p>证件号码：</p>
              </div>
              <div className='contract-info-value'>
                <p>{agreementId}</p>
                <p>{customerName}</p>
                <p>{nationalId}</p>
              </div>
            </div>
            {/* 上传汇款凭证 */}
            <ImagePicker
              length='4'
              className='image-picker'
              files={files}
              // capture="camera"
              // accept='image/jpeg,image/jpg,image/png,image/gif,image/bmp'
              onImageClick={(index, files) => {
                this.setState({
                  bigImage: files[index].url,
                  imageModalTrigger: true
                })
              }}
              selectable={files.length < uploadCnt}
              {...getFieldProps(FieldNames[0], {
                onChange: this.selectImages,
                rules: [
                  {
                    required: true,
                    message: '请选择汇款凭证照片'
                  }
                ]
              })}
            />
            <p className='prompt-orange'>
              为了您的汇款尽快通过审核，请您尽量上传清晰、完整的汇款凭证
            </p>
            <hr className='hr-margin' />
            {/* 汇款凭证类型 */}
            <MyPicker
              data={remittanceTypeData}
              cols={1}
              {...getFieldProps(FieldNames[1], {
                rules: [
                  {
                    required: true,
                    message: '请选择汇款凭证类型'
                  }
                ]
              })}
              err={
                currentError === FieldNames[1]
                  ? getFieldError(FieldNames[1])
                  : null
              }
            >
              <List.Item className='row-height' arrow='horizontal'>
                汇款凭证类型
              </List.Item>
            </MyPicker>
            {/* 汇款人姓名 */}
            <MyInput
              className='right-input row-height'
              placeholder='请输入汇款人姓名'
              maxLength={20}
              {...getFieldProps(FieldNames[2], {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '请输入汇款人姓名'
                  },
                  {
                    pattern: /^[\u4e00-\u9fa5·A-z]{1,20}$/g,
                    message: '汇款人姓名仅可输入英汉字，请您认真核对后重新输入'
                  }
                ]
              })}
              err={
                currentError === FieldNames[2]
                  ? getFieldError(FieldNames[2])
                  : null
              }
            >
              汇款人姓名
            </MyInput>
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
              {/* 汇款金额 */}
              <MyInput
                type='money'
                className='right-input row-height'
                inputRef={v => {
                  this.money = v
                }}
                placeholder='请输入汇款金额'
                maxLength={21}
                {...getFieldProps(FieldNames[3], {
                  rules: [
                    {
                      required: true,
                      message: '请输入汇款金额'
                    }
                  ],
                  normalize: value => {
                    // 只能输入18位整数和2位小数
                    let formatValue = String(value).match(
                      /\d{1,18}(\.[\d]{0,2})?/
                    )
                    return formatValue && formatValue[0]
                  }
                })}
                extra='元'
                err={
                  currentError === FieldNames[3]
                    ? getFieldError(FieldNames[3])
                    : null
                }
              >
                汇款金额
              </MyInput>
            </div>
            {/* 汇款时间 */}
            <MyDatePicker
              mode='date'
              maxDate={new Date()}
              {...getFieldProps(FieldNames[4], {
                rules: [
                  {
                    required: true,
                    message: '请选择汇款时间'
                  }
                ]
              })}
              err={
                currentError === FieldNames[4]
                  ? getFieldError(FieldNames[4])
                  : null
              }
            >
              <List.Item className='row-height' arrow='horizontal'>
                汇款时间
              </List.Item>
            </MyDatePicker>
            <p className='code'>验证码</p>
            {/* 验证码输入框 */}
            <MyInput
              type='text'
              className='row-height'
              placeholder='请输入验证码'
              maxLength={4}
              {...getFieldProps(FieldNames[5], {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '请输入验证码'
                  },
                  {
                    pattern: /^[\dA-z]{4}$/g,
                    message: '请输入正确格式的验证码'
                  }
                ]
              })}
              err={
                currentError === FieldNames[5]
                  ? getFieldError(FieldNames[5])
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
            <button
              disabled={disableButton}
              className={`submit-btn btn-margin${
                disableButton ? ' disable-btn' : ''
              }`}
              onClick={this.submitButton}
            >
              确定
            </button>
            <p className='prompt-grey'>
              在您成功提交汇款凭证后，我们将尽快进行审核。若审核不通过，我们会向您贷款时预留的手机号码发送短信通知。同时您也可点击“快捷查询”-“我已办理”中查看审核进度。
            </p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

export default createForm()(RemittanceDocument)
