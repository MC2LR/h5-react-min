/**
 * @module 底部提示
 */

import React, { Component } from 'react'
import '@/sass/footer.sass'

export default class Footer extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  // 默认props
  static defaultProps = {
    message1: '如您在操作过程中有任何疑问',
    message2: '请致电官方客服热线：400-8816-336'
  }

  render() {
    return (
      <div className="footer">
        <p className="font">{this.props.message1}</p>
        <p className="font">{this.props.message2}</p>
      </div>
    )
  }
}
