import axios from "../axios";

export const fetchUtilWait = (params: object) => {
  return axios.post("/api/util/wait", params);
};
