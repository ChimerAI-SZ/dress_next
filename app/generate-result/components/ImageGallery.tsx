"use client"

import { Box, Image, Flex, Text } from "@chakra-ui/react"
import { images } from "@constants/images"

interface ImageGalleryProps {
  selectImage: string
  originImage: string
  imageList: string[]
  active: boolean
  likeList: string[]
  jionLike: string[]
  onSelect: (image: string) => void
  onLike: (images: string[]) => void
  onDownload: (image: string) => void
  onCollect: (image: string) => void
  onUncollect: (image: string) => void
  onAddToCart: (image: string) => void
}

export default function ImageGallery({
  selectImage,
  originImage,
  imageList,
  active,
  likeList,
  jionLike,
  onSelect,
  onLike,
  onDownload,
  onCollect,
  onUncollect,
  onAddToCart
}: ImageGalleryProps): JSX.Element {
  const handleThumbnailClick = (item: string) => {
    if (active) {
      if (likeList.includes(item)) {
        onLike(likeList.filter(i => i !== item))
      } else {
        onLike([...likeList, item])
      }
    } else {
      onSelect(item)
    }
  }

  const handleLargeImageLike = (image: string) => {
    if (jionLike.includes(image)) {
      onUncollect(image)
    } else {
      onCollect(image)
    }
  }

  return (
    <>
      {/* Large Preview Image */}
      <Flex height="28.59rem" w="full" justifyContent="center" mb="1rem">
        <Box
          height="28.59rem"
          w="21.44rem"
          position="relative"
          borderRadius="0.63rem"
          border="0.03rem solid #CACACA"
          overflow="hidden"
        >
          <Image h="100%" w="21.44rem" objectFit="cover" src={selectImage} />
          {!active && selectImage !== originImage && (
            <Flex position="absolute" bottom={0} right="0" gap="1rem" pb="0.87rem" pr="0.87rem">
              <Box onClick={() => onDownload(selectImage)}>
                <Image boxSize="2.25rem" src={images.Download} />
              </Box>
              <Box onClick={() => handleLargeImageLike(selectImage)}>
                <Image boxSize="2.25rem" src={jionLike.includes(selectImage) ? images.Liked : images.Like} />
              </Box>
              <Box onClick={() => onAddToCart(selectImage)}>
                <Image boxSize="2.25rem" src={images.Shop} />
              </Box>
            </Flex>
          )}
        </Box>
      </Flex>

      {/* Thumbnail Gallery */}
      <Flex mt="1.38rem" gap="0.75rem" overflowY="auto">
        {/* Original Image Thumbnail */}
        <Box
          position="relative"
          height="7.91rem"
          width="5.94rem"
          flexShrink={0}
          border={selectImage === originImage ? "0.09rem solid #ee3939" : "0.09rem solid #CACACA"}
          borderRadius="0.5rem"
          overflow="hidden"
        >
          <Box
            position="absolute"
            flexShrink={0}
            width="3.25rem"
            height="1.13rem"
            background={selectImage === originImage ? "#ee3939" : "#171717"}
            borderRadius="0.5rem 0rem 0.56rem 0rem"
            top="0px"
            left="0px"
          >
            <Text color="#FFFFFF" fontSize="0.63rem" textAlign="center">
              Original
            </Text>
          </Box>
          <Image
            borderRadius="0.45rem"
            flexShrink={0}
            height="7.91rem"
            width="5.94rem"
            objectFit="cover"
            onClick={() => onSelect(originImage)}
            src={originImage}
          />
        </Box>

        {/* Generated Images Thumbnails */}
        {imageList.map((item, index) => (
          <Box
            key={item + index}
            flexShrink={0}
            border={selectImage === item ? "0.09rem solid #EE3939" : "0.09rem solid transparent"}
            borderRadius="0.5rem"
            overflow="hidden"
            position="relative"
          >
            <Image
              flexShrink={0}
              height="7.92rem"
              width="5.94rem"
              objectFit="cover"
              src={item}
              borderRadius="0.45rem"
              onClick={() => handleThumbnailClick(item)}
            />
            {active && (
              <Image
                flexShrink={0}
                height="1rem"
                width="1rem"
                objectFit="cover"
                src={likeList.includes(item) ? images.Selected : images.NoSelect}
                position="absolute"
                top="0.38rem"
                right="0.38rem"
              />
            )}
            {jionLike.includes(item) && !active && (
              <Image
                flexShrink={0}
                height="1rem"
                width="1rem"
                objectFit="cover"
                src={images.Liked}
                position="absolute"
                bottom="0.38rem"
                right="0.38rem"
              />
            )}
          </Box>
        ))}
      </Flex>
    </>
  )
}
