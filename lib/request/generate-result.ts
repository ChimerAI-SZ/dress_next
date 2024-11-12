import axios from "../axios";

export const fetchShoppingAdd = (params: object) => {
  return axios.post("/api/shopping/add", params);
};

export const fetchAddImage = (params: object) => {
  return axios.post("/api/collections/add_image", params);
};
