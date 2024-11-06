// 首页
import axios from '../axios'



// 首页图库
export const fetchHomePage = (params:object) => {
    return axios.post('/api/image/list', params);
};
