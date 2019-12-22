/**
 * @module 还款计划表
 */

import React, { Component } from 'react'
import Footer from '@/components/Footer'
import { createForm } from 'rc-form'
import { Toast } from 'antd-mobile'
import { MyInput } from '@/components/MyAntdMobile'
import MyModal from '@/components/MyModal'
import { config } from '@/config'
import '@/sass/query-schedule.sass'

const { encryption } = config

class RepaymentSchedule extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {}, // 合同数据
      dataList: [], // 模态框合同列表
      modalTrigger: true, // 模态框开关
      agreementId: '' // 加密合同号
    }
  }

  componentDidMount() {
    this.getData()
    this.clickMenuCnt()
  }

  // 后端统计菜单访问次数
  clickMenuCnt = () => {
    this.$http.post('/menu/menuStatistics', {code : 20001}).then(res => {
    })
  }

  // 获取合同列表
  getData = () => {
    this.$http.post('/contract/getContractListByPmtHst').then(res => {
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
      .post('/contract/getContractPmtHst', {
        agreementId: encryptKey
      })
      .then(res => {
        res.disbursalDate =
          res.disbursalDate &&
          this.$moment(res.disbursalDate).format('YYYY年MM月DD日')
        this.setState({
          data: res,
          modalTrigger: false
        })
      })
  }

  // 提交客户邮箱
  submit = () => {
    const { validateFields, getFieldsError } = this.props.form
    validateFields((err, value) => {
      if (!err) {
        this.$http
          .post('/apply/applyRepaymentPlan', {
            agreementId: this.state.agreementId,
            email: value.email
          })
          .then(res => {
            Toast.success('邮箱提交成功')
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
          }
        }
        for (let i in err) {
          if (err[i]) {
            // this.setState({
            //   currentError: i
            // })
            Toast.info(err[i])
            return
          }
        }
      }
    })
  }

  render() {
    const { getFieldProps, getFieldError } = this.props.form
    const { modalTrigger, dataList, data, currentError } = this.state
    const disableButton = Object.keys(data).length === 0
    const {
      customerName = encryption,
      agreementId = encryption,
      disbursalDate = encryption
    } = data

    return (
      <div className='view'>
        <div className='view-content'>
          <MyModal
            dataList={dataList}
            modalTrigger={modalTrigger}
            modalCallBack={this.modalCallBack}
          />
          <div className='query-schedule'>
            <div className='contract-info'>
              <div className='contract-info-name'>
                <p>客户姓名：</p>
                <p>合同号：</p>
                <p>放款日：</p>
              </div>
              <div className='contract-info-value'>
                <p>{customerName}</p>
                <p>{agreementId}</p>
                <p>{disbursalDate}</p>
              </div>
            </div>
            {/* 表格 */}
            <table className='repaymentTable'>
              <tbody>
                <tr>
                  <th>序号</th>
                  <th>到期日</th>
                  <th>还款额</th>
                  <th>本金部分</th>
                  <th>利息部分</th>
                </tr>
                {data.detailList &&
                  data.detailList.map((v, i) => {
                    return (
                      <tr key={v + i}>
                        <td>{v.installmentNumber}</td>
                        <td>{this.$moment(v.dueDate).format('YYYY-MM-DD')}</td>
                        <td>{v.installmentAmount}</td>
                        <td>{v.principalComponent}</td>
                        <td>{v.interestComponent}</td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
            <div>
              {/* 提示信息 */}
              <p className='prompt-grey'>
                请务必于每个到期日凌晨0：00之前在“扣款约定书”约定扣款银行账户内存入足额资金，否则可能造成扣款失败影响您的个人信用记录
              </p>
              <hr className='hr-margin' />
              <p className='prompt'>
                如您需要还款计划表PDF版，请提供有效的邮箱地址，我们将在2个工作日内发送还款计划表至您邮箱，请注意查收，谢谢
              </p>
              {/* 邮箱提交 */}
              <MyInput
                className='email-input'
                maxLength={50}
                {...getFieldProps('email', {
                  initialValue: '',
                  rules: [
                    {
                      required: true,
                      message: '请输入邮箱地址'
                    },
                    {
                      pattern: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
                      message: '请输入有效的邮箱地址'
                    }
                  ]
                })}
                err={currentError === 'email' ? getFieldError('email') : null}
                placeholder='请输入邮箱地址'
              />
              <button
                disabled={disableButton}
                className={`submit-btn btn-margin${
                  disableButton ? ' disable-btn' : ''
                }`}
                onClick={this.submit}
              >
                提交
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

export default createForm()(RepaymentSchedule)
