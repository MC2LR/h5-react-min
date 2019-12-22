/**
 * @module 图片压缩
 */

const maxWidth = 1024 // 最大宽度
const maxSize = 512 * 1024 // 最大kb

// canvas转为图片
const convertCanvasToImage = (canvas, type) => {
  var image = new Image()
  image.src = canvas.toDataURL(type)
  return image
}

const detectVerticalSquash = img => {
  var // iw = img.naturalWidth,
    ih = img.naturalHeight
  var canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = ih
  var ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0)
  var data = ctx.getImageData(0, 0, 1, ih).data
  var sy = 0
  var ey = ih
  var py = ih
  while (py > sy) {
    var alpha = data[(py - 1) * 4 + 3]
    if (alpha === 0) {
      ey = py
    } else {
      sy = py
    }
    py = (ey + sy) >> 1
  }
  var ratio = py / ih
  return ratio === 0 ? 1 : ratio
}

// ios修复
const drawImageIOSFix = (ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) => {
  var vertSquashRatio = detectVerticalSquash(img)
  ctx.drawImage(
    img,
    sx * vertSquashRatio,
    sy * vertSquashRatio,
    sw * vertSquashRatio,
    sh * vertSquashRatio,
    dx,
    dy,
    dw,
    dh
  )
}

// 计算base64大小
const computeBase64 = base64 => {
  const tag = 'base64,'
  base64 = base64.substring(base64.indexOf('base64,') + tag.length)
  const eqTagIndex = base64.indexOf('=')
  base64 = eqTagIndex !== -1 ? base64.substring(0, eqTagIndex) : base64
  const len = base64.length
  return len - (len / 8) * 2
}

// 压缩图片
const compressImg = (base64, cb) => {
  const size = computeBase64(base64)
  const rawImage = new Image()
  rawImage.onload = () => {
    const width = rawImage.width
    const height = rawImage.height
    let newWidth = rawImage.width
    let newHeight = rawImage.height
    // 压缩宽度判断
    if (width > maxWidth) {
      // 压缩后宽高
      newWidth = maxWidth
      newHeight = (maxWidth * height) / width
      // console.log('宽度过长，进行压缩')
    } else {
      // 压缩大小判断
      if (size > maxSize) {
        // console.log('图片过大，继续压缩')
      } else {
        // console.log('上传')
        cb && cb(base64)
        return base64
      }
    }

    // 生成隐藏画布
    let hidCanvas = document.createElement('canvas')
    let hidCtx = hidCanvas.getContext('2d')

    // 设置压缩canvas区域高度及宽度
    hidCanvas.setAttribute('height', newHeight)
    hidCanvas.setAttribute('width', newWidth)

    // 判断图片类型
    // const imageType = base64.match(/(.*);base64/)[1]
    // const type = imageType.slice(5)
    const type = 'image/jpeg'

    // canvas绘制压缩后图片
    drawImageIOSFix(
      hidCtx,
      rawImage,
      0,
      0,
      width,
      height,
      0,
      0,
      newWidth,
      newHeight
    )

    let newBase64 = convertCanvasToImage(hidCanvas, type).src
    compressImg(newBase64, cb)
  }
  rawImage.src = base64
}

export default compressImg
