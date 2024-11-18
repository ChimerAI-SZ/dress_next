"个人主页"
import { number } from "prop-types"
import axios from "../axios"

// 获取收藏夹列表
interface queryProfileDataProps {
  user_id: number
}
export const queryProfileData = (params: queryProfileDataProps) => {
  return axios.post("/api/user_profile/get", params)
}

interface editProfileProps {
  user_id: number
  first_name?: string
  last_name?: string
  pronouns?: string
  bio?: string
  phone_number?: string
  avatar_url?: string
}
export const editProdile = (params: editProfileProps) => {
  return axios.post("/api/user_profile/edit", params)
}

interface queryAllAddressProps {
  user_id: number
}
export const queryAllAddress = (params: queryAllAddressProps) => {
  return axios.post("/api/addresses/list", params)
}

// 新增地址
export interface addAddressProps {
  address_id?: number
  user_id: number
  full_name: string
  country: string
  street_address_1: string
  street_address_2?: string
  city: string
  phone_number: string
  state: string
  postal_code: string
  is_default: boolean
}
export const addAddress = (params: addAddressProps) => {
  return axios.post("/api/addresses/add", params)
}

// 编辑地址
export interface editAddressProps {
  address_id: number
  user_id: number
  full_name: string
  country: string
  street_address_1: string
  street_address_2?: string
  city: string
  phone_number: string
  state: string
  postal_code: string
  is_default: boolean
}
export const editAddress = (params: editAddressProps) => {
  return axios.post("/api/addresses/update", params)
}
