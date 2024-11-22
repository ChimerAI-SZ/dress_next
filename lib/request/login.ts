"登录页面"
import axios from "../axios"

// 发送验证码
export const fetchVerification = (params: object) => {
  return axios.post("/api/verification", params)
}

// 用户注册
export const fetchRegister = (params: object) => {
  return axios.post("/api/user/register", params)
}

// 邮箱密码登录
export const fetchLogin = (params: object) => {
  return axios.post("/api/user/login", params)
}

// 重置密码
export const fetchReset = (params: object) => {
  return axios.post("/api/user/reset", params)
}

// 发送重置密码验证码
export const fetchResetPassword = (params: object) => {
  return axios.post("/api/reset_password", params)
}

// 获取加密后的秘文
export const fetchEncrypt = (params: object) => {
  return axios.post("/api/util/encrypt", params)
}

// 更新用户是否需要指导字段(NeedGuide)
export const fetchUpdateNeedGuide = (params: object) => {
  return axios.post("/api/user/update_need_guide", params)
}

// 校验验证码
export const fetchCheckEmail = (params: object) => {
  return axios.post("/api/user/check_email", params)
}

// 邮件是否已经注册
export const fetchEmailExist = (params: object) => {
  return axios.post("/api/user/email_exist", params)
}
