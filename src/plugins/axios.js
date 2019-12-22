/**
 * @module axios配置
 */

import axios from 'axios'
import { Toast } from 'antd-mobile'
import { config } from '@/config'
import closeWindow from '@/plugins/closeWindow'
import loading from './loading'

// 权限前缀
const preAuth = 'Bearer'
let myAxios = axios.create({})

// 超时时间设置
myAxios.defaults.timeout = 10000

// axios请求拦截
myAxios.interceptors.request.use(conf => {
  if (!conf.__retry) {
    switch (conf.url) {
      case '/sys/login-wechat':
      case '/sys/refresh_token':
        conf.url = config.domain + conf.url
        break
      default:
        conf.url = config.domain + config.api + conf.url
        break
    }
  }
  loading.show()
  if (localStorage.token) {
    conf.headers['Authorization'] = preAuth + localStorage.token
  }
  return conf
})

// axios返回拦截
myAxios.interceptors.response.use(
  response => {
    loading.hide()
    const data = response.data
    let state = parseInt(data.state)
    if (state > 10000) state = 10000
    try {
      switch (state) {
        case 200:
          return data.data
        case 210:
          setTimeout(closeWindow, 0)
          return Promise.reject(data)
        case 10000:
          Toast.info(data.message)
          return Promise.reject(data)
        default:
          if (data.message) {
            Toast.info(data.message)
            return Promise.reject(data)
          } else {
            return data
          }
      }
    } catch (e) {
      return Promise.reject(e)
    }
  },
  error => {
    loading.hide()
    const { response, config } = error
    if (response) {
      switch (response.status) {
        case 401:
          const state = parseInt(response.data.state)
          switch (state) {
            case 10008:
              Toast.offline(response.data.message)
              break
            case 10902:
              // 刷新token，并重新发起请求
              /* if (localStorage.refresh) {
                const refresh = JSON.parse(localStorage.refresh)
                return new Promise((resolve, reject) => {
                  myAxios
                    .post('/sys/refresh_token', {
                      refreshToken: refresh.refreshToken,
                      keyToken: refresh.keyToken
                    })
                    .then(res => {
                      refresh.keyToken = res.keyToken || ''
                      localStorage.refresh = JSON.stringify(refresh)
                      localStorage.token = res.access_token
                      config.headers.Authorization = preAuth + res.access_token
                      config.__retry = true
                      myAxios(config)
                        .then(res => {
                          resolve(res)
                        })
                        .catch(err => {
                          reject(err)
                        })
                    })
                    .catch(err => {
                      localStorage.removeItem('token')
                      window.location.href = window.location.href + '?time='+((new Date()).getTime())
                      return Promise.reject()
                    })
                })
              } else {
                console.log('未获取refreshToken')
                localStorage.removeItem('token')
                window.location.href = window.location.href + '?time='+((new Date()).getTime())
              } */
              
              // 2019/08/19 token失效直接走微信登陆，不走refreshToken接口 
              localStorage.removeItem('token')
              window.location.href = window.location.href + '?time='+((new Date()).getTime())
              break
            case 10903:
              localStorage.removeItem('token')
              window.location.href = window.location.href + '?time='+((new Date()).getTime())
              break
            default:
              Toast.offline('用户验证失败，请退出后重试')
              break
          }
          return Promise.reject('用户无权限')
        case 500:
          return Promise.reject(response)
        default:
          Toast.offline('请求失败，请退出后重试')
          break
      }
    } else {
      Toast.offline('网络不稳定，请重新获取')
    }
    return Promise.reject(error)
  }
)

export default myAxios
