export interface RootState {
  collections: CollectionsState
}

export interface CollectionsState {
  collections: Array<{
    id: number
    name: string
    image_count: number
  }>
  loading: boolean
  error: string | null
}
