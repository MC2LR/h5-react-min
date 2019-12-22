/**
 * @module 解析url参数为对象
 */

export default () => {
  const params = {}
  const match = window.location.href.match(/\?[\S\s]*/)
  if (match) {
    const search = match[0].slice(1)
    const search2 = search.split('&')
    for (let i = 0; i < search2.length; i++) {
      const a2 = search2[i].split('=')
      params[a2[0]] = a2[1]
    }
  }
  return params
}
