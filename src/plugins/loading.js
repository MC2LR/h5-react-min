/**
 * @module loading弹窗
 */

const loading = {
  show: () => {
    let isLoading = document.getElementsByClassName('i-loading')[0]

    if (isLoading) {
      isLoading.style.display = 'block'
    } else {
      // 新建 loading
      let div = document.createElement('div')
      div.className = 'i-loading'

      // 新建遮罩层
      let mask = document.createElement('div')
      mask.className = 'weui-mask_transparent'

      // 新建 toast
      let toast = document.createElement('div')
      toast.style.background = 'rgba(17, 17, 17, 0.7)'
      toast.style.position = 'fixed'
      toast.style.width = '3rem'
      toast.style.height = '3rem'
      toast.style.zIndex = '5000'
      toast.style.top = '50%'
      toast.style.left = '50%'
      toast.style.borderRadius = '5px'
      toast.style.textAlign = 'center'
      toast.style.marginTop = '-1.7rem'
      toast.style.marginLeft = '-1.5rem'
      toast.style.color = '#fff'

      // 新建 icon
      let icon = document.createElement('i')
      icon.className = 'weui-loading weui-icon_toast'
      icon.style.width = '1.1rem'
      icon.style.height = '1.1rem'
      icon.style.marginTop = '0.5rem'

      // 新建内容
      let content = document.createElement('p')
      content.className = 'weui-toast_content'

      content.innerHTML = 'loading...'
      content.style.fontSize = '0.4rem'
      content.style.marginTop = '0.2rem'

      // 组织数据结构
      toast.appendChild(icon)
      toast.appendChild(content)
      div.appendChild(mask)
      div.appendChild(toast)

      document.body.append(div)
    }
  },
  hide: () => {
    let isLoading = document.getElementsByClassName('i-loading')[0]
    if (isLoading) {
      isLoading.style.display = 'none'
    }
  }
}

export default loading
