/**
 * @module 提前还款
 */

import React, { Component } from 'react'
import Footer from '@/components/Footer'
import MyModal from '@/components/MyModal'
import { config } from '@/config'
import { Toast } from 'antd-mobile'
import '@/sass/service-prepayment.sass'

const { encryption } = config

export default class Prepayment extends Component {
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
    this.$http.post('/menu/menuStatistics', {code : 30001}).then(res => {
    })
  }

  // 获取合同列表
  getData = () => {
    this.$http.post('/contract/getContractListByET').then(res => {
      // 是否显示合同列表
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
      .post('/apply/simulationET', {
        agreementId: encryptKey
      })
      .then(res => {
        res.applyDate = res.applyDate
          ? this.$moment(res.applyDate).format('YYYY年MM月DD日')
          : ''
        res.closureDate = res.closureDate
          ? this.$moment(res.closureDate).format('YYYY年MM月DD日')
          : ''
        // 小计
        this.setState({
          data: res,
          modalTrigger: false
        })
      })
  }

  // 跳转相关信息页面并保存合同号
  submitButton = () => {
    sessionStorage.agreementId = this.state.agreementId
    this.props.history.push({
      pathname: `${this.$base}/service-info`,
      search: `?agreementId=${sessionStorage.agreementId}`
    })
  }

  render() {
    let { data, dataList, modalTrigger } = this.state
    const {
      agreementId = encryption,
      vehicleModel = encryption,
      applyDate = encryption,
      closureDate = encryption,
      balancePrincipal = encryption,
      currentMonthInterest = encryption,
      prepaymentPenaltyFee = encryption,
      subtotal = encryption,
      installments = encryption,
      overDueCharge = encryption,
      advice = encryption,
      excessAmount = encryption,
      allMoney = encryption
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
          <div className='service-prepayment'>
            <div>
              <table className='pre-table'>
                <tbody>
                  <tr>
                    <th>合同号</th>
                    <th>{agreementId}</th>
                  </tr>
                  <tr>
                    <td>车型</td>
                    <td>{vehicleModel}</td>
                  </tr>
                  <tr>
                    <td>申请日</td>
                    <td>{applyDate}</td>
                  </tr>
                  <tr>
                    <td>预计关账日</td>
                    <td>{closureDate}</td>
                  </tr>
                </tbody>
              </table>
              <table className='pre-table'>
                <tbody>
                  <tr>
                    <th>本金</th>
                    <th>{balancePrincipal}元</th>
                  </tr>
                  <tr>
                    <td>利息</td>
                    <td>{currentMonthInterest}元</td>
                  </tr>
                  <tr>
                    <td>手续费</td>
                    <td>{prepaymentPenaltyFee}元</td>
                  </tr>
                  <tr>
                    <td>小计</td>
                    <td>{subtotal}元</td>
                  </tr>
                </tbody>
              </table>
              <table className='pre-table'>
                <tbody>
                  <tr>
                    <th>当月一期</th>
                    <th>{installments}元</th>
                  </tr>
                  <tr>
                    <td>逾期利息</td>
                  {overDueCharge === encryption ? (
                    <td>{encryption}元</td>
                  ) :
                    <td>{(overDueCharge*100 + advice*100)/100}元</td>
                  }
                  </tr>
                  <tr>
                    <td>汇款多余款</td>
                    <td>{excessAmount}元</td>
                  </tr>
                  <tr className='total'>
                    <td>应还款总计</td>
                    <td>{allMoney}元</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className='prompt'>
              温馨提示：我司为拥有两笔车辆贷款的客户提供免除其中一笔车辆贷款的提前还款手续费服务，如有需要建议您联系经销商或我司客服咨询
            </p>
            <button
              disabled={disableButton}
              className={`submit-btn btn-margin${
                disableButton ? ' disable-btn' : ''
              }`}
              onClick={this.submitButton}
            >
              确定
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}
