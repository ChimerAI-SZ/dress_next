export interface HistoryHeaderProps {
  selectionMode: boolean
  handleSetSelectMode: (value: boolean) => void
}

export interface HistoryItem {
  history_id: number
  user_id: number
  task_id: string
  image_url: string
  created_date: string
  [key: string]: number
}
