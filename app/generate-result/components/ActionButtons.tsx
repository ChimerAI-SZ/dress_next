"use client"

import { Flex, Image, Button, Text } from "@chakra-ui/react"
import { ActionButtonsProps } from "@definitions/generate"
import { images } from "@constants/images"

const ActionButton = ({ icon, onClick }: { icon: string; onClick: () => void }) => (
  <Flex
    width="2.5rem"
    height="2.5rem"
    background="rgba(255,255,255,0.5)"
    borderRadius="1.25rem"
    border="0.03rem solid #BFBFBF"
    backdropFilter="blur(50px)"
    alignItems="center"
    justifyContent="center"
    onClick={onClick}
  >
    <Image boxSize="2.25rem" src={icon} />
  </Flex>
)

export default function ActionButtons({
  active,
  isAllSelected,
  likeList,
  imageList,
  onSelectAll,
  onDownload,
  onLike,
  onAddToCart
}: ActionButtonsProps): JSX.Element {
  if (!active) {
    return (
      <Flex
        height="3.75rem"
        position="fixed"
        bottom="0"
        zIndex={111}
        bg="#fff"
        maxW="100vw"
        w="full"
        alignItems="center"
        justifyContent="flex-end"
        left="50%"
        transform="translateX(-50%)"
        borderRadius="0.75rem 0.75rem 0rem 0rem"
        boxShadow="0rem -0.06rem 0.31rem 0rem rgba(214,214,214,0.5)"
      >
        <Button colorScheme="teal" width="9.5rem" height="2.5rem" background="#EE3939" borderRadius="1.25rem" mr="1rem">
          Further Generate
        </Button>
      </Flex>
    )
  }

  return (
    <Flex
      height="3.75rem"
      position="fixed"
      bottom="0"
      zIndex={111}
      bg="#fff"
      maxW="100vw"
      w="full"
      alignItems="center"
      justifyContent="space-between"
      left="50%"
      transform="translateX(-50%)"
      borderRadius="0.75rem 0.75rem 0rem 0rem"
      boxShadow="0rem -0.06rem 0.31rem 0rem rgba(214,214,214,0.5)"
      px="1rem"
    >
      <Flex gap="0.53rem" alignItems="center" onClick={() => onSelectAll(isAllSelected ? [] : imageList)}>
        <Image boxSize="1.12rem" src={isAllSelected ? images.Selected : images.AllNo} borderRadius="50%" />
        <Text>Select all</Text>
      </Flex>
      <Flex gap="1rem">
        <ActionButton icon={images.Download} onClick={() => likeList.forEach(onDownload)} />
        <ActionButton icon={images.Like} onClick={() => onLike(likeList)} />
        <ActionButton icon={images.Shop} onClick={onAddToCart} />
      </Flex>
    </Flex>
  )
}
