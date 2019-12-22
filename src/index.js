import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'
import App from '@/pages/App'
import myAxios from '@/plugins/axios'
import getUrlParams from '@/plugins/getUrlParams'
import closeWindow from '@/plugins/closeWindow'
import { base } from '@/router'

// 全局样式
import 'lib-flexible'
import '@/sass/base.sass'
import '@/sass/common.sass'
import 'weui'
import 'react-weui/build/packages/react-weui.css'

// 时间插件本地化
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

// 全局挂载插件
React.Component.prototype.$http = myAxios // axios请求
React.Component.prototype.$getUrlParams = getUrlParams // 获取url参数
React.Component.prototype.$moment = moment // 日期格式化
React.Component.prototype.$base = base // 根路径
React.Component.prototype.$closeWindow = closeWindow // 关闭页面

ReactDOM.render(
  <HashRouter>
    <App />
  </HashRouter>,
  document.getElementById('root')
)
