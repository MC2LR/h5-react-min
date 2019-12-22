/**
 * @module 绑定新合同
 */

import React, { Component } from 'react'
import Footer from '@/components/Footer'
import { Toast } from 'antd-mobile'
import '@/sass/query-new.sass'

export default class BindContract extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // 合同数据
      data: [],
      bindList: [] // 所选合同列表
    }
  }

  componentDidMount() {
    // 获取未绑定合同
    if (sessionStorage.unBind) {
      this.setState({
        data: JSON.parse(sessionStorage.unBind)
      })
    } else {
      Toast.fail('非法操作！无未绑定合同。')
    }
  }

  /**
   * 选择绑定合同
   * @param {String} encryptKey 加密合同号
   */
  selectContract = encryptKey => {
    const { bindList } = this.state
    let bindListTemp = [...bindList]
    let index = bindListTemp.indexOf(encryptKey)
    index !== -1 ? bindListTemp.splice(index, 1) : bindListTemp.push(encryptKey)
    this.setState({
      bindList: bindListTemp
    })
  }

  // 绑定新合同
  bindButton = () => {
    const { bindList } = this.state
    if (bindList.length === 0) {
      Toast.fail('请选择需绑定合同')
      return
    }
    this.$http
      .post('/contract/applyBind', {
        agreementId: bindList
      })
      .then(res => {
        Toast.success('所选合同已关联')
        this.props.history.push(`${this.$base}/query-contracts`)
      })
  }

  render() {
    const { data, bindList } = this.state
    let disableButton = false
    if (data) {
      disableButton = data.length === 0
    }
    return (
      <div className='view'>
        <div className='view-content'>
          <div className='query-new'>
            <p>请选择本次需绑定合同</p>
            {data &&
              data.map((v, i) => {
                return (
                  <div
                    className={
                      bindList.includes(v.encryptKey) ? 'item active' : 'item'
                    }
                    key={v + i}
                    onClick={() => this.selectContract(v.encryptKey)}
                  >
                    <ul>
                      <li>{v.agreementId}</li>
                      <li>{v.vehicleModel}</li>
                    </ul>
                  </div>
                )
              })}
            <button
              disabled={disableButton}
              className={`submit-btn btn-margin${
                disableButton ? ' disable-btn' : ''
              }`}
              onClick={this.bindButton}
            >
              绑定
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}
