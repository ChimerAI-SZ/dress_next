// 收藏夹数据类型
export type FavouriteItem = {
  collection_id: string | number
  user_id: string | number
  is_default: boolean
  is_deleted: boolean
  title: string
  images: string[]
  description: string
  created_at: string
  total: number
}

interface FavouriteItemImage {
  id: number
  collection_id: number
  image_url: string
  is_deleted: boolean
  added_at: string
}

export type FavouriteImage = {
  message: string
  success: boolean
  data: FavouriteItemImage[]
}

// 收藏页 header 的 props 类型
export interface FavouritesHeaderProps {
  name?: string | null
  handleIconClick: (type: string) => void
}

export interface CollectionDetailHeaderProps {
  handleIconClick: (type: string) => void
  collectionId?: string // 在收藏夹内部的header要传一下当前收藏夹的id
  selectMode: boolean
  handleSetSelectMode: (value: boolean) => void
}

// 收藏页 弹窗 props 类型
export interface FavouriteDialogProps {
  type: "add" | "edit"
  children: React.ReactNode
  collectionId?: string // 在收藏夹内部的header要传一下当前收藏夹的id
}
