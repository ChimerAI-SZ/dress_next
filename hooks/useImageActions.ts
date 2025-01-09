import { Alert } from "@components/Alert"

const useImageActions = (userId: string) => {
  const handleDownload = async (imgUrl: string) => {
    try {
      // 检测是否为移动设备
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

      if (isMobile) {
        // 移动设备：创建一个临时链接在当前窗口打开
        const link = document.createElement("a")
        link.href = imgUrl
        link.target = "_self"
        link.rel = "noopener noreferrer"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        // 桌面设备：使用原来的下载方式
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

        Alert.open({
          content: "Download Successfully",
          type: "success",
          customIcon: "/assets/images/mainPage/successIcon.png",
          containerStyle: {
            width: "60vw"
          }
        })
      }
    } catch (error) {
      console.error("下载失败的错误信息：", error)
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
