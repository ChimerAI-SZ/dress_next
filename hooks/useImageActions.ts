import { Alert } from "@components/Alert"

const useImageActions = (userId: string) => {
  const handleDownload = async (imgUrl: string) => {
    // 下载逻辑
    try {
      // 先获取图片数据
      const response = await fetch(imgUrl)
      const blob = await response.blob()

      // 创建 URL 对象
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.download = "图片.jpg" // 设置下载文件名

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
    } catch (error) {
      // 下载失败提示
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
