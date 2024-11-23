"历史页面"
import axios from "../axios"

// 获取收藏夹列表
interface queryHistoryProps {
  user_id: number
  start_date: string
  end_date: string
}
export const queryHistory = (params: queryHistoryProps) => {
  return axios.post("/api/generate_image_history/get", params)
}

interface addImgToAlbumProps {
  collection_id: number
  image_urls: string[]
}
export const addImgToAlbum = (params: addImgToAlbumProps) => {
  return axios.post("/api/collections/add_images", params)
}

// 移除收藏
interface removeImgFromAlbumProps {
  collection_id: number
  image_urls: string[]
}
export const removeImgFromAlbum = (params: removeImgFromAlbumProps) => {
  return axios.post("/api/collections/remove_images", params)
}
