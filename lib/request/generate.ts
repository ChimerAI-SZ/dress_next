import axios from "../axios"

export const fetchUtilWait = (params: object) => {
  return axios.post("/api/util/wait", params)
}
// 通过taskid拿结果
export const getQuery = (params: object) => {
  return axios.post("/api/util/query", params)
}

// 批量添加taskinfo
export const fetchAddBatch = (params: object) => {
  return axios.post("/api/task/add_batch", params)
}
