/**
 * @module 提前还款相关信息
 */

import React, { Component } from 'react'
import Footer from '@/components/Footer'
import { List, Toast } from 'antd-mobile'
import { MyPicker, MyInput } from '@/components/MyAntdMobile'
import { createForm } from 'rc-form'
import '@/sass/service-info.sass'

// 表单字段名
const FieldNames = [
  'prepayReason', // 提前还款类型
  'prepayReasonRemark', // 其他提前还款类型
  'moneyResorce', // 资金来源
  'moneyResorceRemark', // 其他资金来源
  'payType', // 还款方式
  'paymentDay', // 每月还款日
  'amountFinance' // 贷款金额
]

class PrepaymentInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // 提前还款原因数据
      prepayReasonData: [
        {
          value: 1,
          label: '置换车辆'
        },
        {
          value: 2,
          label: '其他贷款'
        },
        {
          value: 3,
          label: '资金宽裕'
        },
        {
          value: 4,
          label: '换牌'
        },
        {
          value: 5,
          label: '其他'
        }
      ],
      // 资金来源数据
      moneyResorceData: [
        {
          value: 1,
          label: '工资所得'
        },
        {
          value: 2,
          label: '家庭储蓄'
        },
        {
          value: 3,
          label: '其他'
        }
      ],
      // 还款方式数据
      payTypeData: [
        {
          value: 1,
          label: '银行卡还款'
        },
        {
          value: 2,
          label: '汇款还款'
        }
      ],
      paymentDayData: [], // 还款日期数据
      currentError: '', // 当前错误
      errorMessage: '' // 错误信息
    }
  }

  componentDidMount() {
    this.generateDate()
  }

  // 生成还款日期
  generateDate = () => {
    let paymentDayData = new Array(31).fill(0).map((v, i) => ({
      value: i + 1,
      label: `${i + 1}日`
    }))
    this.setState({
      paymentDayData
    })
  }

  // 提交提前还款-相关信息表单
  submitButton = () => {
    const { validateFields, getFieldsError } = this.props.form
    validateFields((err, value) => {
      // 初始化错误信息
      this.setState({
        errorMessage: ''
      })
      // 表单验证
      if (!err) {
        let agreementId = sessionStorage.agreementId || ''
        this.$http
          .post('/apply/addContractET', {
            agreementId, // agreementId
            [FieldNames[0]]: +value[FieldNames[0]], // prepayReason
            [FieldNames[1]]: value[FieldNames[1]] || '', // prepayReasonRemark
            [FieldNames[2]]: +value[FieldNames[2]], // moneyResorce
            [FieldNames[3]]: value[FieldNames[3]] || '', // moneyResorceRemark
            [FieldNames[4]]: +value[FieldNames[4]], // payType
            [FieldNames[5]]: +value[FieldNames[5]], // paymentDay
            [FieldNames[6]]: Math.round(value.amountFinance * 100) / 100 //amountFinance
          })
          .then(res => {
            let type = parseInt(value.payType)
            if (type === 1) {
              // 储存卡扣数据
              sessionStorage.type1 = JSON.stringify(res)
              this.props.history.push(`${this.$base}/service-charge`)
            } else if (type === 2) {
              // 储存汇款数据
              sessionStorage.type2 = JSON.stringify(res)
              this.props.history.push(`${this.$base}/service-remittance`)
            }
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
    const {
      prepayReasonData,
      moneyResorceData,
      payTypeData,
      paymentDayData,
      currentError,
      errorMessage
    } = this.state
    const { getFieldProps, getFieldValue, getFieldError } = this.props.form
    return (
      <div className='view'>
        <div className='view-content'>
          <div className='service-info'>
            {/* 提前还款原因选择 */}
            <MyPicker
              data={prepayReasonData}
              cols={1}
              {...getFieldProps(FieldNames[0], {
                rules: [
                  {
                    required: true,
                    message: '请填写完整信息'
                  }
                ]
              })}
              err={
                currentError === FieldNames[0]
                  ? getFieldError(FieldNames[0])
                  : null
              }
            >
              <List.Item className='row-height' arrow='horizontal'>
                提前还款原因
              </List.Item>
            </MyPicker>
            {/* 提前还款其他原因 */}
            <textarea
              style={
                +getFieldValue(FieldNames[0]) === 5
                  ? { display: 'block' }
                  : { display: 'none' }
              }
              className='others'
              placeholder='请输入其他还款原因'
              maxLength={200}
              {...getFieldProps(
                FieldNames[1],
                +getFieldValue(FieldNames[0]) === 5
                  ? {
                      initialValue: '',
                      rules: [
                        {
                          required: true,
                          message: '请填写完整信息'
                        }
                      ]
                    }
                  : {}
              )}
            />
            {/* 资金来源选择 */}
            <MyPicker
              data={moneyResorceData}
              cols={1}
              {...getFieldProps(FieldNames[2], {
                rules: [
                  {
                    required: true,
                    message: '请填写完整信息'
                  }
                ]
              })}
              err={
                currentError === FieldNames[2]
                  ? getFieldError(FieldNames[2])
                  : null
              }
            >
              <List.Item className='row-height' arrow='horizontal'>
                资金来源
              </List.Item>
            </MyPicker>
            {/* 其他资金来源 */}
            <textarea
              style={
                parseInt(getFieldValue(FieldNames[2])) === 3
                  ? { display: 'block' }
                  : { display: 'none' }
              }
              className='others'
              maxLength={200}
              placeholder='请输入其他资金来源'
              {...getFieldProps(
                FieldNames[3],
                parseInt(getFieldValue(FieldNames[2])) === 3
                  ? {
                      initialValue: '',
                      rules: [
                        {
                          required: true,
                          message: '请填写完整信息'
                        }
                      ]
                    }
                  : {}
              )}
            />
            {/* 还款方式选择 */}
            <MyPicker
              data={payTypeData}
              cols={1}
              {...getFieldProps(FieldNames[4], {
                rules: [
                  {
                    required: true,
                    message: '请填写完整信息'
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
              还款方式
              </List.Item>
            </MyPicker>
            <div className='safe-questions'>安全问题验证</div>
            {/* 每月还款日选择 */}
            <MyPicker
              data={paymentDayData}
              cols={1}
              {...getFieldProps(FieldNames[5], {
                rules: [
                  {
                    required: true,
                    message: '请填写完整信息'
                  }
                ]
              })}
              err={
                currentError === FieldNames[5]
                  ? getFieldError(FieldNames[5])
                  : null
              }
            >
              <List.Item className='row-height' arrow='horizontal'>
                每月还款日
              </List.Item>
            </MyPicker>
            {/* 贷款金额输入框 */}
            <MyInput
              type='tel'
              className='right-input row-height'
              placeholder='请输入您的贷款金额'
              maxLength={23}
              {...getFieldProps(FieldNames[6], {
                rules: [
                  {
                    required: true,
                    message: '请填写完整信息'
                  }
                ],
                normalize: value => {
                  // 只能输入20位整数和2位小数
                  let formatValue = String(value).match(
                    /\d{1,20}(\.[\d]{0,2})?/
                  )
                  return formatValue && formatValue[0]
                }
              })}
              extra='元'
              err={
                currentError === FieldNames[6]
                  ? getFieldError(FieldNames[6])
                  : null
              }
            >
              贷款金额
            </MyInput>
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

export default createForm()(PrepaymentInfo)
