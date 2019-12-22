import React, { Component } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import { router } from '@/router'
//import { config, wechat } from '@/config'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showPage: true
    }
  }

  componentWillMount() {
   // this.authorization()
  }

  componentDidUpdate() {
    //this.authorization()
  }

  // 微信授权-获取code与token
  // authorization = () => {
  //   // localStorage.token = '1da7649a-9ee8-459c-ad5f-a4e4b160779b'
  //   // localStorage.refresh = '{"refreshToken":"34dd2d9a-8ca3-4017-bb37-73af524b5f68","keyToken":"$2a$10$CUtWI05VZEKtB2XPD.qw8el9RPx5ATz/g3SAKBjCMsCuIxXh2XK6W","timestamp":1554804631635}'
  //   // alert('token待去除')

  //   // 获取token
  //   const token = localStorage.token
  //   // 静默加载
  //   let overdue = false
  //   let scope = 'snsapi_base'
  //   if (!localStorage.first) {
  //     // 第一次加载使用非静默加载
  //     localStorage.first = 'first'
  //     scope = 'snsapi_userinfo'
  //   }

  //   // refresh过期
  //   /* if (localStorage.refresh) {
  //     const time = 29 * 24 * 60 * 60 * 1000 //30天过期，取29天防止误差
  //     const timestamp = JSON.parse(localStorage.refresh).timestamp
  //     overdue = new Date().valueOf() - timestamp > time
  //   } */

  //   if (config.Authorization) {
  //     // 是否是获取code页面
  //     if (!window.location.href.includes('?code=')) {
  //       // 无token需重新获取token
  //       if (!token /* || overdue */) {
  //         // 保存当前路径
  //         sessionStorage.currentUrl = window.location.href
  //         window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${
  //           wechat.AppId
  //         }&redirect_uri=${encodeURIComponent(
  //           wechat.redirectUri
  //         )}&response_type=code&scope=${scope}&state=123#wechat_redirect`
  //       } else {
  //         if (!this.state.showPage) {
  //           this.setState({ showPage: true })
  //         }
  //       }
  //     } else {
  //       // 获取url参数
  //       const params = this.$getUrlParams()
  //       //如果code与storage里保存的一样，重新请求新code
  //       if(sessionStorage.wechatCode == params.code){
  //         sessionStorage.removeItem('wechatCode')
  //         window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${
  //           wechat.AppId
  //         }&redirect_uri=${encodeURIComponent(
  //           wechat.redirectUri
  //         )}&response_type=code&scope=${scope}&state=123#wechat_redirect`
  //       }else{
  //         sessionStorage.wechatCode = params.code
  //         // 登录接口
  //         this.$http
  //           .post('/sys/login-wechat', {
  //             code: params.code
  //           })
  //           .then(res => {
  //             // 2019/8/20 去除keyToken和refresh_token
  //             // const refresh = {
  //             //   refreshToken: res.refresh_token,
  //             //   keyToken: res.keyToken,
  //             //   timestamp: new Date().valueOf()
  //             // }
  //             localStorage.token = res.access_token
  //               // localStorage.refresh = JSON.stringify(refresh)
  //             window.location.href = sessionStorage.currentUrl
  //           })
  //       }
  //     }
  //   }
  // }

  render() {
    // if (this.state.showPage) {
    //   // 路由渲染
    //   const route = router.map(v => {
    //     let path = v['url'].slice(1).split('/')
    //     let url =
    //     this.$base + '/' + path[0].toLowerCase() + '-' + path[1].toLowerCase()
    //     return (
    //       <Route
    //         key={v}
    //         path={url}
    //         component={v.component}
    //       />
    //     )
    //   })
    //   return <Switch>{route}</Switch>
    // }
    return (
      <div className="App">
       
          <Switch>
            {
              router.map(route => { 
                return(
                  <Route 
                  key = {route.url}
                  path = {route.url}
                  component = {route.component}/>
                )
              })
            
            }
          </Switch>
      </div>
    );
  }

}

export default withRouter(App)
