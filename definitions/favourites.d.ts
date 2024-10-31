// 收藏夹数据类型
export type FavouriteItem = {
  id: string
  isDefault: boolean
  name: string
  coverImg: string[]
  imgNumber: number
}

// 收藏页 header 的 props 类型
export interface FavouritesHeaderProps {
  name: string | null
  addBtnvisible: boolean
  handleAddFavourites: React.MouseEventHandler<HTMLDivElement>
}

// 收藏页 弹窗 props 类型
export interface FavouriteDialogProps {
  type: 'add' | 'edit'
  children: React.ReactNode
}
