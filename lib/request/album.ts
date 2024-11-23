"收藏夹页面"
import axios from "../axios"

// 获取收藏夹列表
interface queryAlbumListProps {
  user_id: number
}
export const queryAlbumList = (params: queryAlbumListProps) => {
  return axios.post("/api/collections/list", params)
}

// 新建收藏夹
interface addNewAlbumProps {
  user_id: number
  title: string
  description?: string
}
// 新增收藏夹
export const addNewAlbum = (params: addNewAlbumProps) => {
  return axios.post("/api/collections/create", params)
}

// 获取收藏夹中的所有图片
interface queryAllImageInAlbumProps {
  collection_id: number
}
export const queryAllImageInAlbum = (params: queryAllImageInAlbumProps) => {
  return axios.post("/api/collections/get_all_images", params)
}

// 删除收藏夹
interface deleteAlbumProps {
  collection_id: number
}
export const deleteAlbum = (params: deleteAlbumProps) => {
  return axios.post("/api/collections/delete", params)
}

// 编辑收藏夹信息
interface updateAlbumProps {
  collection_id: number
  user_id: number
  title: string
  description?: string
}
export const updateAlbum = (params: updateAlbumProps) => {
  return axios.post("/api/collections/edit", params)
}

// 移除收藏
interface removeImgFromAlbumProps {
  collection_id: number
  image_urls: string[]
}
export const removeImgFromAlbum = (params: removeImgFromAlbumProps) => {
  return axios.post("/api/collections/remove_images", params)
}
