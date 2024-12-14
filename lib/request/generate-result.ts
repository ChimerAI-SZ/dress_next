import axios from "../axios"

export interface ShoppingAdd {
  user_id: number
  img_urls: string[]
  phone: string
}

export interface AddImages {
  image_urls: string[]
  collection_id: number
}

export interface CollectionsList {
  user_id: number
}

export const fetchShoppingAdd = (params: ShoppingAdd) => {
  return axios.post("/api/shopping/add", params)
}

export const fetchAddImages = (params: AddImages) => {
  return axios.post("/api/collections/add_images", params)
}
// 获取收藏夹
export const fetchCollectionsList = (params: CollectionsList) => {
  return axios.post("/api/collections/list", params)
}

// 获取收藏夹
export const fetchRemoveImages = (params: AddImages) => {
  return axios.post("/api/collections/remove_images", params)
}
