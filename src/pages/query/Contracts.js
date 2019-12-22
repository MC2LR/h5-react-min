/**
 * @module 合同详情
 */

import React, { Component } from 'react'
import Footer from '@/components/Footer'
import MyModal from '@/components/MyModal'
import { config } from '@/config'
import { Toast } from 'antd-mobile'
import '@/sass/query-contracts.sass'

const { encryption } = config

export default class ContractDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {}, // 合同数据
      dataList: [], // 模态框合同列表
      modalTrigger: true, // 模态框开关
      unBindCount: 0, // 未绑定数量
      agreementId: '' // 加密合同号
    }
  }

  componentDidMount() {
    this.getContractList()
    this.clickMenuCnt()
  }

  // 后端统计菜单访问次数
  clickMenuCnt = () => {
    this.$http.post('/menu/menuStatistics', {code : 20002}).then(res => {
    })
  }

  // 获取合同列表
  getContractList = async () => {
    this.$http.post('/contract/getContractListByBind').then(res => {
      let unBindCount = 0 // 未绑定合同数量
      res.forEach(v => {
        !v.bind && unBindCount++
      })
      if (res.length >= 1) {
        this.setState({
          dataList: res.filter(v => v.bind),
          unBindCount
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
      .post('/contract/getContractDetail', {
        agreementId: encryptKey
      })
      .then(res => {
        res.disbursalDate = res.disbursalDate
          ? this.$moment(res.disbursalDate).format('LL')
          : ''
        res.maturityDate = res.maturityDate
          ? this.$moment(res.maturityDate).format('LL')
          : ''
        this.setState({
          data: res,
          modalTrigger: false
        })
      })
  }

  // 跳转证件填写
  bindContract = () => {
    this.props.history.push({
      pathname: `${this.$base}/query-card`
    })
  }

  render() {
    const { modalTrigger, dataList, data, unBindCount } = this.state
    const {
      customerName = encryption,
      nationalId = encryption,
      vehicleModel = encryption,
      agreementId = encryption,
      contractStatus = encryption,
      disbursalDate = encryption,
      maturityDate = encryption,
      tenure = encryption,
      amountFinance = encryption,
      alreadyTerms = encryption,
      dpdDays = encryption,
      remainingPrincipal = encryption
    } = data

    const date = this.$moment().format('YYYY年MM月DD日HH时')
    return (
      <div className='view'>
        <div className='view-content'>
          <MyModal
            dataList={dataList}
            unBindCount={unBindCount}
            modalTrigger={modalTrigger}
            modalCallBack={this.modalCallBack}
            bindContract={this.bindContract}
          />
          <div className='query-contracts'>
            <p className='prompt-orange'>
              截至{date}
              ，您的合同信息如下，敬请知悉。如您于当日还款，可于次日查询更新信息
            </p>
            <table>
              <tbody>
                <tr>
                  <td>客户姓名</td>
                  <td>{customerName}</td>
                </tr>
                <tr>
                  <td>身份证号码</td>
                  <td>{nationalId}</td>
                </tr>
                <tr>
                  <td>车型</td>
                  <td>{vehicleModel}</td>
                </tr>
                <tr>
                  <td>合同号</td>
                  <td>{agreementId}</td>
                </tr>
                <tr>
                  <td>合同状态</td>
                  <td>{contractStatus}</td>
                </tr>
                <tr>
                  <td>合同放款日期</td>
                  <td>{disbursalDate}</td>
                </tr>
                <tr>
                  <td>合同到期日</td>
                  <td>{maturityDate}</td>
                </tr>
                <tr>
                  <td>贷款期限</td>
                  <td>{tenure}期</td>
                </tr>
                <tr>
                  <td>贷款金额</td>
                  <td>{amountFinance}元</td>
                </tr>
                <tr>
                  <td>已还期数</td>
                  <td>{alreadyTerms}期</td>
                </tr>
                <tr>
                  <td>当前逾期天数</td>
                  <td>{dpdDays}天</td>
                </tr>
                <tr>
                  <td>剩余本金</td>
                  <td>{remainingPrincipal}元</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <Footer message1='如您有逾期，请致电官方客服热线' message2='400-8816-336咨询具体逾期金额'/>
      </div>
    )
  }
}
