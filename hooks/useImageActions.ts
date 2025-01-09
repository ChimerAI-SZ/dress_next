import { Alert } from "@components/Alert"

const useImageActions = (userId: string) => {
  const handleDownload = async (imgUrl: string) => {
    // 下载逻辑
    try {
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
    } catch (error) {
      console.error("下载失败的错误信息：", error)
      const errorElement = document.createElement("div")
      errorElement.textContent = `Error: ${(error as Error).message}`
      document.body.appendChild(errorElement) // 将错误信息显示在页面上
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
