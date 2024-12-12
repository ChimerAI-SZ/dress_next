import { Box, Flex, Image } from "@chakra-ui/react"
import { images } from "@constants/images"

interface ActionButtonsProps {
  image: string
  liked: boolean
  onDownload: (image: string) => void
  onLike: (image: string) => void
  onAddToCart: (image: string) => void
}

export const ActionButtons = ({ image, liked, onDownload, onLike, onAddToCart }: ActionButtonsProps) => {
  return (
    <Flex
      position="absolute"
      bottom={0}
      right={0}
      gap="1rem"
      pb="0.87rem"
      pr="0.87rem"
      zIndex={20}
      transition="opacity 0.2s"
      _groupHover={{ opacity: 1 }}
      bg="linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)"
      borderRadius="0 0 0.63rem 0.63rem"
      padding="2rem 0.87rem 0.87rem 0.87rem"
      width="100%"
      justifyContent="flex-end"
    >
      <Box
        onClick={e => {
          e.stopPropagation()
          onDownload(image)
        }}
        cursor="pointer"
        _hover={{ transform: "scale(1.1)" }}
        transition="transform 0.2s"
      >
        <Image boxSize="2.25rem" src={images.Download} />
      </Box>
      <Box
        onClick={e => {
          e.stopPropagation()
          onLike(image)
        }}
        cursor="pointer"
        _hover={{ transform: "scale(1.1)" }}
        transition="transform 0.2s"
      >
        <Image boxSize="2.25rem" src={liked ? images.Liked : images.Like} />
      </Box>
      <Box
        onClick={e => {
          e.stopPropagation()
          onAddToCart(image)
        }}
        cursor="pointer"
        _hover={{ transform: "scale(1.1)" }}
        transition="transform 0.2s"
        boxSize="2.25rem"
      >
        <Image boxSize="2.25rem" src={images.Shop} />
      </Box>
    </Flex>
  )
}
