// 首页
import axios from "../axios"

// 首页图库
export const fetchHomePage = (params: object) => {
  return axios.post("/api/image/list", params)
}

export const fetchCollectionList = (params: { user_id: string }) => {
  return axios.post("/api/image/list", params)
}
