'登录页面'
import axios from '../axios'

// 发送验证码
interface queryCollectionListProps {
  user_id: string
}
export const queryCollectionList = (params: queryCollectionListProps) => {
  return axios.post('/api/collections/list', params)
}
