// 测试域名
const testDomin = 'https://cswcsit.saicgmac.com'
// const testDomin = 'https://cswcuat.saicgmac.com'
// const testDomin = 'http://10.196.33.17:17101'
// const testDomin = 'http://10.196.33.9:17101'
// const testDomin = 'http://10.196.33.6:17101'

// 环境api域名
const sitApiUrl = 'https://cswcsit.saicgmac.com'
const uatApiUrl = 'https://cswcuat.saicgmac.com'
const prodApiUrl = 'https://cswc.saicgmac.com'

// 项目接口地址
const formalDomain = sitApiUrl

// 环境变量
const env = process.env.NODE_ENV
const origin = env === 'development' ? testDomin : formalDomain

// 公众号ID
// SIT
const sitAppId = 'wx2bcaa5e78265b144'
// UAT
const uatAppId = 'wx9b7c649b026fc8cd'
// PROD
const prodAppId = 'wx5c142e00760c14dd'

//根据apiUrl得出appid
const tempAppid = function () {
  switch (formalDomain) {
    case sitApiUrl:
      return sitAppId;

    case uatApiUrl:
      return uatAppId;

    case prodApiUrl:
      return prodAppId;
  
    default:
      return sitAppId;
  }
}

// 项目配置
const config = {
  // 域名
  domain: origin,
  // 统一接口地址
  api: '/api/wechat/application',
  // 授权开关
  Authorization: true,
  // 无数据时占位符
  encryption: '**********'
}

// 微信配置
const wechat = {
  // 公众号ID
  AppId: tempAppid(),
  // 回调地址
  redirectUri: config.domain + '/index.html#/'
}

export { config, wechat }
