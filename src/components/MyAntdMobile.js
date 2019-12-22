/**
 * @module antd-mobile改写
 */

import React, { Component } from 'react'
import { Picker, DatePicker, InputItem } from 'antd-mobile'

// Picker组件封装
class MyPicker extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div tabIndex={0} className='my-am-input'>
        <Picker {...this.props}>{this.props.children}</Picker>
        <span className={this.props.err ? 'line err-line' : 'line'} />
      </div>
    )
  }
}

// DatePicker组件封装
class MyDatePicker extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div tabIndex={0} className='my-am-input'>
        <DatePicker {...this.props}>{this.props.children}</DatePicker>
        <span className={this.props.err ? 'line err-line' : 'line'} />
      </div>
    )
  }
}

// Input组件封装
class MyInput extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const props = { ...this.props }
    delete props.inputRef
    return (
      <div tabIndex={0} className='my-am-input'>
        <InputItem ref={this.props.inputRef} {...props}>
          {this.props.children}
        </InputItem>
        <span className={this.props.err ? 'line err-line' : 'line'} />
      </div>
    )
  }
}

// 手机区号显示
const phoneArea = <div>+86&nbsp;</div>

export { MyPicker, MyDatePicker, MyInput, phoneArea }
