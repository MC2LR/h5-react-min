/**
 * @module 公用列表页
 */

import React, { Component } from 'react'
import '@/sass/my-modal.sass'

export default class MyModal extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const {
      modalTrigger, // 模态框开关
      modalCallBack, // 模态框回调
      dataList, // 数据列表
      unBindCount, // 未绑定数量
      bindContract // 绑定新合同
    } = this.props

    return (
      <div className='modal' style={modalTrigger ? null : { display: 'none' }}>
        <div className='menu'>
          {dataList &&
            dataList.map((v, i) => {
              return (
                <div
                  className='item'
                  key={v + i}
                  onClick={() => modalCallBack(v.encryptKey, v)}
                >
                  <ul>
                    <li>{v.agreementId}</li>
                    <li>{v.vehicleModel}</li>
                  </ul>
                </div>
              )
            })}
          {unBindCount ? (
            <div className='bind-new' onClick={bindContract}>
              <div className='title'>
                <span className='icon'>+</span>绑定新合同
              </div>
              <p className='sub-title'>
                (您有<span className='number'>{unBindCount}</span>个未关联合同)
              </p>
            </div>
          ) : null}
        </div>
      </div>
    )
  }
}
