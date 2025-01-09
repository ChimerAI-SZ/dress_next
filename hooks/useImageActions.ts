import { Alert } from "@components/Alert"

const useImageActions = (userId: string) => {
  const handleDownload = async (imgUrl: string) => {
    // 下载逻辑
    try {
      // 检测是否为移动设备
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

      if (isMobile) {
        // 移动设备使用新方法
        const response = await fetch(imgUrl)
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)

        // 创建一个隐藏的iframe来加载图片
        const iframe = document.createElement("iframe")
        iframe.style.display = "none"
        document.body.appendChild(iframe)
        iframe.src = url

        // 清理
        setTimeout(() => {
          window.URL.revokeObjectURL(url)
          document.body.removeChild(iframe)
        }, 1000)
      } else {
        // PC端使用下载方式
        const response = await fetch(imgUrl)
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)

        const link = document.createElement("a")
        link.href = url
        link.download = "图片.jpg"
        document.body.appendChild(link)
        link.click()

        // 清理
        window.URL.revokeObjectURL(url)
        document.body.removeChild(link)
      }

      Alert.open({
        content: "Download Successfully",
        type: "success",
        customIcon: "/assets/images/mainPage/successIcon.png",
        containerStyle: {
          width: "60vw"
        }
      })
    } catch (error) {
      Alert.open({
        content: "Failed to download the image, \n Please try again."
      })
    }
  }

  return {
    handleDownload
  }
}

export default useImageActions
