export interface AlbumItemImage {
  id: number
  collection_id: number
  image_url: string
  is_deleted: boolean
  added_at: string
  [key: string]: number
}

// 收藏夹数据类型
export type AlbumItem = {
  collection_id: string | number
  user_id: string | number
  is_default: boolean
  is_deleted: boolean
  title: string
  images: AlbumItemImage[]
  description: string
  created_at: string
  total: number
}

// 收藏页 header 的 props 类型
export interface AlbumHeaderProps {
  name?: string | null
  onSuccess?: () => void
}

export interface AlbumDetailHeaderProps {
  handleIconClick: (type: string) => void
  collectionId?: string // 在收藏夹内部的header要传一下当前收藏夹的id
  selectMode: boolean
  handleSetSelectMode: (value: boolean) => void
}

// 收藏页 弹窗 props 类型
export interface AlbumDialogProps {
  type: "add" | "edit"
  collectionId?: number // 在收藏夹内部的header要传一下当前收藏夹的id
  visible: boolean
  close: () => void
  onSuccess?: (newCollection: any) => void
}
