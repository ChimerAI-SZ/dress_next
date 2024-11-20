import { DialogRoot, DialogContent } from "@components/ui/dialog"
import { forwardRef } from "react"

interface MessageBoxProps {
  open: boolean
  message: string
}

const MessageBox = forwardRef<HTMLDivElement, MessageBoxProps>(({ open, message }, ref) => {
  return (
    <DialogRoot open={open} placement="center" motionPreset="scale">
      <DialogContent
        backdrop={false}
        p={4}
        borderRadius="md"
        boxShadow="lg"
        bg="white"
        ref={ref}
        position="relative"
        zIndex={0}
        w={"1rem"}
      >
        <h3>{message}</h3>
      </DialogContent>
    </DialogRoot>
  )
})

export default MessageBox
