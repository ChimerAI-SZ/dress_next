import React, { forwardRef } from "react"
import { Box, Image } from "@chakra-ui/react"

interface ImageOverlayProps {
  src: string
  onClick: () => void
}

// 使用 forwardRef 来接收传递的 ref
const ImageOverlay = forwardRef<HTMLDivElement, ImageOverlayProps>(({ src, onClick }, ref) => {
  const thumbnailUrl = `${src}/resize,w_200`

  return (
    <Box
      ref={ref}
      position="relative"
      width="100%"
      mb="16px"
      borderRadius={"12px"}
      overflow={"hidden"}
      border={`1px solid rgba(211,211,211,0.5)`}
    >
      <Image
        src={thumbnailUrl}
        alt="Displayed Image"
        onClick={onClick}
        width="100%"
        style={{ display: "block" }}
        borderRadius="4px"
      />
    </Box>
  )
})

ImageOverlay.displayName = "ImageOverlay"

export default ImageOverlay
