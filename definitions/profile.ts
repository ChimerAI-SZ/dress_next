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
