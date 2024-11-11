"收藏夹页面"
import axios from "../axios"

// 获取收藏夹列表
interface queryCollectionListProps {
  user_id: string
}
export const queryCollectionList = (params: queryCollectionListProps) => {
  return axios.post("/api/collections/list", params)
}

// 新建收藏夹
interface addNewAlbumProps {
  user_id: string | number
  title: string
  description?: string
}
// 新增收藏夹
export const addNewAlbum = (params: addNewAlbumProps) => {
  return axios.post("/api/collections/create", params)
}

// 获取收藏夹中的所有图片
interface queryAllImageInCollectionProps {
  collection_id: string
}
export const queryAllImageInCollection = (params: queryAllImageInCollectionProps) => {
  return axios.post("/api/collections/get_all_images", params)
}

// 删除收藏夹
interface deleteCollectionProps {
  collection_id: string
}
export const deleteCollection = (params: deleteCollectionProps) => {
  return axios.post("/api/collections/delete", params)
}
