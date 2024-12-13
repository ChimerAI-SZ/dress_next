// 首页
import axios from "../axios"
import { errorCaptureRes, storage } from "@utils/index"
const userId = storage.get("user_id")
// 首页图库
export const fetchHomePage = (params: object) => {
  return axios.post("/api/image/list", params)
}

export const fetchCollectionList = (params: { user_id: string }) => {
  return axios.post("/api/image/list", params)
}

export const fetchImageDetails = (params: { image_url: string }) => {
  return axios.post("/api/gpt/analyzing_clothing", params)
}

// 喜欢/不喜欢
export const imageRate = (params: { image_url: string; user_uuid: string; action: "like" | "dislike" }) => {
  return axios.post("/api/reactions/like_dislike", params)
}

export const fetchRecommendImages = (params: { user_uuid: string }) => {
  return axios.post("/api/reactions/recommend", params)
}
