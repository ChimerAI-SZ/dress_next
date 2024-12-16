export const getImageUrl = (url: string, quality = 80) => {
  return `${url}?x-oss-process=image/quality,q_${quality}`
}

// 图片处理工具函数
export const getWidthImageUrl = (url: string, width: number) => {
  return `${url}?x-oss-process=image/resize,w_${width}`
}

// 预加载图片函数
const preloadImage = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = url
    img.onload = () => resolve()
    img.onerror = reject
  })
}

// 批量预加载图片
export const preloadImages = async (urls: string[]) => {
  return Promise.all(urls.map(url => preloadImage(url)))
}
