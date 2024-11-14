export interface profileDataType {
  user_id: number
  email: string
  first_name: string
  last_name: string
  role: number
  status: number
  created_at: string
}

export interface profileDataQueryType {
  success: boolean
  data: profileDataType
  message?: string
}

export interface shippingAddressType {
  address_id: number
  city: string
  country: string
  created_at: string
  full_name: string
  is_default: boolean
  phone_number: string
  postal_code: string
  state: string
  street_address_1: string
  street_address_2?: string
  user_id: number
}