/**
 * @module 提前还款-汇款
 */

import React, { Component } from 'react'
import Footer from '@/components/Footer'
import { Link } from 'react-router-dom'
import { config } from '@/config'
import '@/sass/service-remittance.sass'

const { encryption } = config

export default class PrepaymentRemittance extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    // 取出汇款数据
    const data = sessionStorage.type2 ? JSON.parse(sessionStorage.type2) : {}
    data.closureTime =
      data.closureTime &&
      this.$moment(data.closureTime).format('YYYY年MM月DD日 下午2:30前')
    const { allMoney = encryption, closureTime = encryption } = data
    return (
      <div className='view'>
        <div className='view-content'>
          <div className='service-remittance'>
            <div className='prepayment-success'>
              <img
                src={require('@/images/selfService/success.png')}
                className='apply-success'
                alt='申请成功'
              />
              <p className='success-message'>您已成功申请提前还款！</p>
              <p className='prompt-grey'>
                请不要在其他渠道重复申请提前还款以免造成操作冲突。
              </p>
            </div>
            <div className='remit-card'>
              <div className='title'>汇款信息</div>
              <div className='flex'>
                <ul className='info-name'>
                  <li>提前还款金额</li>
                  <li>账户</li>
                  <li>户名</li>
                  <li>开户行</li>
                </ul>
                <ul className='flex1 info'>
                  <li>{allMoney}元</li>
                  <li>1001 2155 0930 0179 887</li>
                  <li>上汽通用汽车金融有限责任公司</li>
                  <li>工商银行上海分行天目东路支行</li>
                </ul>
              </div>
              <div className='prompt-grey pmt'>
                汇款时请务必在汇款摘要中注明借款人姓名、借款人证件号（或合同号）和汇款人姓名
              </div>
            </div>
            <div className='remit-card'>
              <div className='title'>上传汇款凭证时间</div>
              <div className='flex'>
                <ul>
                  <li>{closureTime}</li>
                </ul>
              </div>
              <div className='prompt-grey pmt'>
                汇款在途时间为24小时，您需要在自申请时刻起，24小时内汇款至我司账户
              </div>
            </div>
            <p className='prepayment-click'>
              您可
              <span className='prepayment-click-here'>
                <Link to={`${this.$base}/query-queries`}>点击此处</Link>
              </span>
              或点击“快捷查询”-“我已办理”中查看审核进度
            </p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}
