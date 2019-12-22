/**
 * @module 了解我们公用模块(**暂时无用**)
 */

import React, { Component } from 'react'
import '@/sass/about-us.sass'

class AboutUs extends Component {
  constructor(props) {
    super(props)
    this.state = {
      page: "<p style='text-align:center;margin-top:100px;'>2123</p>" // 页面内容
    }
  }

  componentDidMount() {
    this.renderPages()
  }

  // 获取页面并渲染
  renderPages = () => {
    const params = this.$getUrlParams()
    this.$http
      .post('/contact/getContent', {
        type: params.type
      })
      .then(res => {
        this.setState({
          page: res.content.content
        })
      })
  }

  render() {
    const { page } = this.state
    return (
      <div className='view'>
        <div className='about-us'>
          <div dangerouslySetInnerHTML={{ __html: page }} />
        </div>
      </div>
    )
  }
}

export default AboutUs
