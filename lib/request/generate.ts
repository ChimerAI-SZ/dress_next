import axios from "../axios";

export const fetchUtilWait = (params: object) => {
  return axios.post("/api/util/wait", params);
};
// 通过taskid拿结果
export const getQuery = (params: object) => {
  return axios.post("/api/util/query", params);
};
