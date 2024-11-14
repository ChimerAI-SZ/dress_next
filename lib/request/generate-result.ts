import axios from "../axios";

export const fetchShoppingAdd = (params: object) => {
  return axios.post("/api/shopping/add", params);
};

export const fetchAddImage = (params: object) => {
  return axios.post("/api/collections/add_images", params);
};
// 获取收藏夹
export const collectionsList = (params: object) => {
  return axios.post("/api/collections/list", params);
};
