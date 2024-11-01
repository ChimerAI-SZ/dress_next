import { Portal } from '@chakra-ui/react'

const Toast = ({ children }: { children: React.ReactNode }) => {
  return (
    <Portal>
      <div>{children}</div>
    </Portal>
  )
}

export default Toast
