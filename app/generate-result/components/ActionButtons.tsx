"use client"
import { useState } from "react"
import { Flex, Image, Button, Text } from "@chakra-ui/react"
import { ActionButtonsProps } from "@definitions/generate"
import { images } from "@constants/images"
import { useSearchParams, useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import {
  setWorkInfo,
  setParams as setStoreParams,
  setTaskId,
  setWork,
  setStage,
  setId
} from "@store/features/workSlice"
import { Params } from "@definitions/update"

// 添加提取URL中大写部分的工具函数
const extractUppercaseSection = (url: string): string => {
  const match = url.match(/\/([A-Z][A-Za-z_0-9]*)\//)
  return match ? match[1] : ""
}

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
  onAddToCart,
  selectImage
}: ActionButtonsProps): JSX.Element {
  const dispatch = useDispatch()
  const router = useRouter()
  const { id } = useSelector((state: any) => state.work)
  const [params, setParams] = useState<Params>({
    loadOriginalImage: selectImage,
    loadPrintingImage: undefined,
    backgroundColor: undefined,
    text: undefined,
    loadFabricImage: undefined
  })
  const map = {
    DRESS_VARIATION_50PCT_1: 11,
    DRESS_PATTERN_VARIATION_1: 21,
    DRESS_VARIATION_20PCT_1: 31,
    Transfer_A_And_B_STANDARD_1: 41,
    Transfer_A_And_B_VIT_G_1: 51,
    Transfer_A_And_B_Plus_1: 61
  }
  const { stage } = useSelector((state: any) => state.work)
  const handleFurtherGenerate = () => {
    // 如果selectImage是URL，提取大写部分
    const uppercaseSection = extractUppercaseSection(selectImage)
    console.log("Extracted section:", uppercaseSection)
    const key = map[uppercaseSection as keyof typeof map]
    console.log("disan", stage, key, id)
    if (stage === "a") {
      dispatch(setStage("b"))
    } else if (stage === "b" && key == id) {
      dispatch(setStage("c"))
    } else if (stage === "b" && key != id) {
      dispatch(setStage("a"))
    } else if (stage === "c") {
      dispatch(setStage("a"))
    }
    if (key) {
      dispatch(setId(key.toString()))
    }
    dispatch(setStoreParams(params))
    router.replace(`/generate?id=${key}`)
  }
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
        <Button
          onClick={handleFurtherGenerate}
          colorScheme="teal"
          width="9.5rem"
          height="2.5rem"
          background="#EE3939"
          borderRadius="1.25rem"
          mr="1rem"
        >
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
