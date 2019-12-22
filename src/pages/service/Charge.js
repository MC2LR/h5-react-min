/**
 * @module 提前还款-卡扣
 */

import React, { Component } from 'react'
import Footer from '@/components/Footer'
import { Link } from 'react-router-dom'
import { config } from '@/config'
import '@/sass/service-charge.sass'

const { encryption } = config

export default class PrepaymentCharge extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    // 取出卡扣数据
    const data = sessionStorage.type1 ? JSON.parse(sessionStorage.type1) : {}
    data.closureTime =
      data.closureTime &&
      this.$moment(data.closureTime).format('YYYY年MM月DD日')
    const { closureTime = encryption, allMoney = encryption } = data
    return (
      <div className='view'>
        <div className='view-content'>
          <div className='service-charge'>
            <div className='prepayment-success'>
              <img
                src={require('@/images/selfService/success.png')}
                className='apply-success'
                alt='申请成功'
              />
              <p className='success-message'>您已成功申请提前还款！</p>
            </div>
            <div className='remit-card'>
              <div className='title'>相关信息</div>
              <div className='flex'>
                <ul className='info-name'>
                  <li>还款金额</li>
                  <li>扣款时间</li>
                </ul>
                <ul className='flex1 info'>
                  <li>{allMoney}元</li>
                  <li>{closureTime}</li>
                </ul>
              </div>
              <div className='prompt-grey pmt'>
                请您于{closureTime}凌晨00:00之前，在您的还款银行卡内存足金额！
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
