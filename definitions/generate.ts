import { AlbumItem } from "./album"

export interface ImageListParams {
  imageList: string
  loadOriginalImage: string
}

export interface CollectionSuccessToastProps {
  onMoveTo: () => void
}

export interface LoginPromptProps {
  onLogin: () => void
}

export interface ImageGalleryProps {
  selectImage: string
  originImage: string
  imageList: string[]
  active: boolean
  likeList: string[]
  jionLike: string[]
  onSelect: (image: string) => void
  onLike: (images: string[]) => void
  onDownload: (url: string) => void
}

export interface ActionButtonsProps {
  active: boolean
  isAllSelected: boolean
  likeList: string[]
  imageList: string[]
  onSelectAll: (images: string[]) => void
  onDownload: (url: string) => void
  onLike: (images: string[]) => void
  onAddToCart: () => void
}

export interface CollectionSelectorProps {
  visible: boolean
  collections: AlbumItem[]
  selectedCollections: string[]
  onSelect: (collections: string[]) => void
  onClose: () => void
  onAddNew: () => void
}
