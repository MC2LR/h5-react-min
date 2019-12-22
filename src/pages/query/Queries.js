/**
 * @module 我已办理
 */

import React, { Component, Fragment } from 'react'
import Footer from '@/components/Footer'
import { Tabs, Toast } from 'antd-mobile'
import { StickyContainer, Sticky } from 'react-sticky'
import '@/sass/query-queries.sass'

export default class MyQueries extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // 标签名
      tabs: [
        { title: '申请提前还款', sub: '1' },
        { title: '修改手机号码', sub: '2' },
        { title: '上传汇款凭证', sub: '3' }
      ],
      index: 0, // 当前标签页
      data: [] // 标签页数据
    }
  }

  componentDidMount() {
    // 默认显示第一页数据
    this.getData(1)
    this.clickMenuCnt()
  }

  // 后端统计菜单访问次数
  clickMenuCnt = () => {
    this.$http.post('/menu/menuStatistics', {code : 20003}).then(res => {
    })
  }

  /**
   * 获取不同标签页数据
   * @param {Number} index 当前标签页
   */
  getData = index => {
    this.$http
      .post('/user/searchApply', {
        applyType: index
      })
      .then(res => {
        this.setState({
          data: res
        })
      })
  }

  /**
   * 取消申请
   * @param {String} applyEarlyId 加密合同号
   */
  cancelApply = applyEarlyId => {
    this.$http
      .post('/apply/updateApplyEarly', {
        applyEarlyId
      })
      .then(res => {
        this.forceUpdate()
        Toast.success('您已成功取消申请！')
        setTimeout(this.getData(1), 3000)
      })
  }

  // 标签粘行布局
  renderTabBar = props => {
    return (
      <Sticky>
        {({ style }) => (
          <div style={{ ...style, zIndex: 1 }}>
            <Tabs.DefaultTabBar {...props} />
          </div>
        )}
      </Sticky>
    )
  }

  // 状态颜色控制
  statusColor = status => {
    switch (status) {
      case 7:
        return 'success-color'
      case 0:
      case 1:
        return 'pending-color'
      case 6:
      case 8:
      case 9:
        return 'cancel-color'
      default:
        break
    }
  }

  // 渲染卡片
  renderCard = () => {
    const { data, index } = this.state
    const titleList = ['提前还款', '修改手机号码', '汇款凭证']

    return data.map((v, i) => {
      return (
        <Fragment key={v + i}>
          <div className='card'>
            <table className='card-table'>
              <tbody>
                <tr>
                  <th colSpan={2}>{titleList[index]}</th>
                </tr>
                <tr>
                  <td>申请时间</td>
                  <td>
                    {this.$moment(v.applyTime).format('YYYY-MM-DD HH:mm:ss')}
                  </td>
                </tr>
                <tr>
                  <td>申请进度</td>
                  <td>
                    <span className={this.statusColor(v.status)}>
                      {v.statusText}
                    </span>
                  </td>
                </tr>
                {index === 0 ? (
                <tr>
                  <td>还款总金额</td>
                  <td>{v.allMoney}</td>
                </tr>
                ) : null}
                {index === 0 ? (
                <tr>
                  <td>预计关账日</td>
                  <td>
                    {this.$moment(v.closureTime).format('YYYY-MM-DD')}
                  </td>
                </tr>
                ) : null}
                <tr className='td-line'>
                  <td className='padding-bottom'>备注</td>
                  <td className='padding-bottom'>{v.remarks}</td>
                </tr>
                {index === 0 ? (
                  v.status === 0 ? (
                    <tr>
                      <td colSpan={2} className='tag-button'>
                        <div
                          className='cancel-btn'
                          onClick={() => this.cancelApply(v.encryptKey)}
                        >
                          取消
                        </div>
                      </td>
                    </tr>
                  ) : v.status === 9 ? (
                    <tr>
                      <td colSpan={2} className='tag-button'>
                        <div
                          className='cancel-btn'
                          onClick={() =>
                            this.props.history.push(
                              `${this.$base}/service-prepayment`
                            )
                          }
                        >
                          重新申请
                        </div>
                      </td>
                    </tr>
                  ) : null
                ) : index === 1 ? (
                  v.status === 7 ? (
                    <tr>
                      <td colSpan={2} className='tag-button'>
                        <div
                          className='cancel-btn'
                          onClick={() =>
                            this.props.history.push(
                              `${this.$base}/service-update`
                            )
                          }
                        >
                          重新修改
                        </div>
                      </td>
                    </tr>
                  ) : v.status === 8 || v.status === 9 ? (
                    <tr>
                      <td colSpan={2} className='tag-button'>
                        <div
                          className='cancel-btn'
                          onClick={() =>
                            this.props.history.push(
                              `${this.$base}/service-update`
                            )
                          }
                        >
                          重新申请
                        </div>
                      </td>
                    </tr>
                  ) : null
                ) : index === 2 ? (
                  v.status === 0 || v.status === 9 ? (
                    <tr>
                      <td colSpan={2} className='tag-button'>
                        <div
                          className='cancel-btn'
                          onClick={() =>
                            this.props.history.push(
                              `${this.$base}/service-document`
                            )
                          }
                        >
                          重新上传
                        </div>
                      </td>
                    </tr>
                  ) : null
                ) : null}
              </tbody>
            </table>
          </div>
        </Fragment>
      )
    })
  }

  render() {
    const { tabs } = this.state
    return (
      <div className='view'>
        <div className='view-content'>
          <div className='query-queries'>
            <StickyContainer>
              <Tabs
                tabs={tabs}
                initialPage={0}
                onChange={(tab, index) => {
                  this.setState({
                    index
                  })
                  this.getData(index + 1)
                }}
                renderTabBar={this.renderTabBar}
              >
                {tabs.map((v, i) => {
                  return <div key={v + i}>{this.renderCard(i)}</div>
                })}
              </Tabs>
            </StickyContainer>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}
