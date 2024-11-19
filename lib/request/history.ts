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

interface addImgToFavouriteProps {
  collection_id: number
  image_urls: string[]
}
export const addImgToFavourite = (params: addImgToFavouriteProps) => {
  return axios.post("/api/collections/add_images", params)
}

// 移除收藏
interface removeImgFromCollectionProps {
  collection_id: number
  image_urls: string[]
}
export const removeImgFromCollection = (params: removeImgFromCollectionProps) => {
  return axios.post("/api/collections/remove_images", params)
}
