import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig,
  } from "axios";

  const instance: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL || "/", // 使用环境变量设置 base URL
    timeout: 30000, // 设置请求超时时间
    headers: {
      "Content-Type": "text/plain",
    },
  });
  // 请求拦截器
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = "534dc1cc256cd9c3f1b62f14900fa5978SnLbY";
      if (token) {
        // config.headers = config.headers || {};
        // config.headers["ai-token"] = token;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  // 响应拦截器
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // 处理401错误
        console.error("Unauthorized: Please check your authentication.");
      }
      return Promise.reject(error);
    }
  );
  
  export default instance;
  