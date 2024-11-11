import axios from "../axios";

export const fetchShoppingAdd = (params: object) => {
  return axios.post("/api/shopping/add", params);
};
