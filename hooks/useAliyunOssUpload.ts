import { useState, useCallback } from "react"

interface UploadState {
  isUploading: boolean
  uploadProgress: number
  uploadedUrl: string | undefined
}

interface UploadResponse {
  url: string
}

interface UseAliyunOssUploadReturn {
  isUploading: boolean
  uploadProgress: number
  uploadedUrl: string | undefined
  uploadToOss: (file: File) => Promise<UploadResponse>
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
      const formData = new FormData()
      formData.append("file", file)

      return new Promise<UploadResponse>((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.upload.onprogress = event => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100)
            setUploadState(prevState => ({
              ...prevState,
              uploadProgress: progress
            }))
          }
        }

        xhr.onload = () => {
          if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText)
            setUploadState({
              isUploading: false,
              uploadProgress: 100,
              uploadedUrl: data.url
            })
            resolve(data)
          } else {
            reject(new Error("Upload failed"))
          }
        }

        xhr.onerror = () => {
          reject(new Error("Upload failed"))
        }

        xhr.open("POST", "/api/upload", true)
        xhr.send(formData)
      })
    } catch (err) {
      console.error("Error uploading file:", err)
      setUploadState(prevState => ({ ...prevState, isUploading: false }))
      return Promise.reject(err)
    }
  }, [])

  return {
    ...uploadState,
    uploadToOss
  }
}

export default useAliyunOssUpload
