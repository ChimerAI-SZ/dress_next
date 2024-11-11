import axios from "../axios";
// 图库
export const fetchHomePage = (params: object) => {
  return axios.post("/api/image/list", params);
};
