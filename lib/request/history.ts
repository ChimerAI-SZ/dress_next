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
