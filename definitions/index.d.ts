// 缺省组件 props 类型
export interface EmptyProps {
  icon?: React.ReactNode
  title?: string
  description?: string
  // 额外样式
  style?: { [key: string]: string }
}

export interface ToastProps {
  children: React.ReactNode
  boxStyle?: { [key: string]: string }
  maskVisible?: boolean
  close: () => void
  maskClosable?: boolean
}

export interface AlertProps {
  content: string
  iconVisible?: boolean
  customIcon?: string
  duration?: number
}
