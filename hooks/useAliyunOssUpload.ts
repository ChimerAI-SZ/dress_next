import { useState, useCallback } from "react"
import OSS from "ali-oss"

interface UploadState {
  isUploading: boolean
  uploadProgress: number
  uploadedUrl: string | undefined
}

interface UseAliyunOssUploadReturn {
  isUploading: boolean
  uploadProgress: number
  uploadedUrl: string | undefined
  uploadToOss: (file: File) => Promise<void>
}

const useAliyunOssUpload = (): UseAliyunOssUploadReturn => {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    uploadProgress: 0,
    uploadedUrl: undefined
  })

  const uploadToOss = useCallback(async (file: File) => {
    setUploadState(prevState => ({ ...prevState, isUploading: true, uploadProgress: 0 }))

    try {
      const client = new OSS({
        region: process.env.NEXT_PUBLIC_OSS_REGION!,
        accessKeyId: process.env.NEXT_PUBLIC_OSS_ACCESS_KEY_ID!,
        accessKeySecret: process.env.NEXT_PUBLIC_OSS_ACCESS_KEY_SECRET!,
        bucket: process.env.NEXT_PUBLIC_OSS_BUCKET!
      })

      // 生成一个不包含中文字符的文件名
      const fileName = encodeURIComponent(file.name) // 使用 URL 编码转换中文字符

      const result = await client.multipartUpload(fileName, file, {
        progress: (p: number) => {
          setUploadState(prevState => ({
            ...prevState,
            uploadProgress: Math.round(p * 100)
          }))
        }
      })

      // 构建文件的URL
      const uploadedUrl = `https://${process.env.NEXT_PUBLIC_OSS_BUCKET}.${process.env.NEXT_PUBLIC_OSS_REGION}.aliyuncs.com/${result.name}?x-oss-process=image/format,jpg`

      setUploadState({
        isUploading: false,
        uploadProgress: 100,
        uploadedUrl
      })
    } catch (err) {
      console.error("Error uploading to OSS:", err)
      setUploadState(prevState => ({ ...prevState, isUploading: false }))
    }
  }, [])

  return {
    ...uploadState,
    uploadToOss
  }
}

export default useAliyunOssUpload
