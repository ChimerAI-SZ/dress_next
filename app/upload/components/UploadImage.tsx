"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import { Box, Flex, Text, Image, Textarea } from "@chakra-ui/react"
import { Toaster, toaster } from "@components/Toaster"
import useAliyunOssUpload from "@hooks/useAliyunOssUpload"
import UploadImage from "@img/upload/upload-icon.png"
import ReUpload from "@img/upload/re-upload.svg"
import ImageGuide from "./ImageGuide"
import { TypesClothingProps } from "@definitions/update"
import ReactLoading from "react-loading"
import { fetchUpdateNeedGuide } from "@lib/request/login"
import { errorCaptureRes, storage } from "@utils/index"
import { useSelector } from "react-redux"
import { Alert } from "@components/Alert"
// Types
interface UploadState {
  showGuide: boolean
  text: string
  pendingFile: File | null
  isFirstUpload: boolean
  isGuideFromUpload: boolean
}

// Styles
const textareaStyles = {
  _focus: {
    borderColor: "transparent",
    boxShadow: "none",
    outline: "none",
    background: `
      linear-gradient(#FFFFFF, #FFFFFF) padding-box,
      linear-gradient(135deg, rgba(255, 144, 144, 1), rgba(254, 75, 163, 1)) border-box
    `,
    border: "0.09rem solid transparent"
  },
  _hover: {
    borderColor: "transparent",
    boxShadow: "none",
    outline: "none",
    background: `
      linear-gradient(#FFFFFF, #FFFFFF) padding-box,
      linear-gradient(135deg, rgba(255, 144, 144, 1), rgba(254, 75, 163, 1)) border-box
    `,
    border: "0.09rem solid transparent"
  },
  height: "2.4rem",
  minHeight: "2.4rem",
  maxHeight: "3.2rem",
  resize: "none" as const,
  overflow: "hidden",
  border: "0.09rem solid #F5F5F5",
  _active: {
    border: "0.09rem solid #F5F5F5"
  },
  _focusVisible: {
    borderColor: "transparent",
    boxShadow: "none",
    outline: "none",
    background: `
      linear-gradient(#FFFFFF, #FFFFFF) padding-box,
      linear-gradient(135deg, rgba(255, 144, 144, 1), rgba(254, 75, 163, 1)) border-box
    `,
    border: "0.09rem solid transparent"
  },
  display: "flex",
  alignItems: "center",
  transition: "all 0.3s ease",
  padding: "0.5rem 0.75rem",
  lineHeight: "1.2rem"
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB in bytes

const UploadComponent = ({ onParamsUpdate }: TypesClothingProps) => {
  const { params } = useSelector((state: any) => state.work)
  const { uploadToOss, isUploading, uploadProgress, uploadedUrl } = useAliyunOssUpload()

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // State
  const [state, setState] = useState<UploadState>({
    showGuide: false,
    text: "",
    pendingFile: null,
    isFirstUpload: true,
    isGuideFromUpload: false
  })

  // Memoized handlers
  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    // 创建一个隐藏的 span 来计算文本宽度
    const span = document.createElement("span")
    span.style.visibility = "hidden"
    span.style.position = "absolute"
    span.style.fontSize = "0.75rem"
    span.style.fontFamily = window.getComputedStyle(textarea).fontFamily
    span.style.padding = "0"
    span.style.whiteSpace = "pre-wrap"
    span.style.width = `${textarea.clientWidth - 24}px` // 减去左右padding
    document.body.appendChild(span)

    // 重置高度
    textarea.style.height = "2.4rem"

    // 计算文本是否需要换行
    const text = textarea.value || textarea.placeholder
    span.textContent = text
    const shouldWrap = span.offsetHeight > 24 // 24px 是一行的高度

    // 清理
    document.body.removeChild(span)

    // 如果需要换行，设置为两行高度
    if (shouldWrap) {
      textarea.style.height = "3.2rem"
    }
  }, [])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const inputText = e.target.value
      if (inputText.length <= 200) {
        setState(prev => ({ ...prev, text: inputText }))
        onParamsUpdate({ text: inputText })
        // 使用 RAF 确保在下一帧渲染时调整高度
        requestAnimationFrame(adjustHeight)
      }
    },
    [onParamsUpdate, adjustHeight]
  )

  const handleUpload = useCallback(
    async (file: File) => {
      try {
        await uploadToOss(file)
      } catch (error) {
        console.error("Upload failed", error)
        Alert.open({ content: "An error occurred during upload" })
      }
    },
    [uploadToOss]
  )

  const handleUploadClick = useCallback(() => {
    if (uploadedUrl || params.loadOriginalImage) {
      fileInputRef.current?.click()
      return
    }

    const need_guide = storage.get("need_guide")
    if (state.isFirstUpload && need_guide === "true") {
      setState(prev => ({ ...prev, showGuide: true, isGuideFromUpload: true }))
      return
    }
    fileInputRef.current?.click()
  }, [uploadedUrl, params.loadOriginalImage, state.isFirstUpload])

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files
      if (!files?.[0]) return

      const file = files[0]
      console.log(file.size)
      if (file.size > MAX_FILE_SIZE) {
        Alert.open({ content: "The file size exceeds the maximum limit of 10MB" })
        if (event.target) {
          event.target.value = ""
        }
        return
      }

      setState(prev => ({ ...prev, isFirstUpload: false }))
      handleUpload(file)
    },
    [handleUpload]
  )

  const handleGuideClose = useCallback(async () => {
    setState(prev => ({ ...prev, showGuide: false, isGuideFromUpload: false }))
    storage.set("need_guide", "false")

    const user_id = storage.get("user_id")
    if (user_id) {
      await errorCaptureRes(fetchUpdateNeedGuide, {
        user_id: Number(user_id),
        need_guide: false
      })
    }

    if (state.isGuideFromUpload) {
      setTimeout(() => {
        fileInputRef.current?.click()
      }, 100)
    }
  }, [state.isGuideFromUpload])

  // Effects
  useEffect(() => {
    const need_guide = storage.get("need_guide")
    if (need_guide === null || need_guide === undefined) {
      storage.set("need_guide", "true")
    }
  }, [])

  useEffect(() => {
    if (uploadProgress === 100) {
      onParamsUpdate({ loadOriginalImage: uploadedUrl })
    }
  }, [uploadProgress, uploadedUrl, onParamsUpdate])

  useEffect(() => {
    adjustHeight()
  }, [adjustHeight, state.text])

  return (
    <Box
      alignItems="center"
      justifyContent="center"
      mt="0.5rem"
      width="full"
      position="relative"
      bg="#FFFFFF"
      borderRadius="0.5rem"
      px="0.75rem"
      pb="0.75rem"
      mb="0.5rem"
    >
      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileSelect} />

      <Flex justifyContent="space-between" alignItems="center" py="0.66rem" pl="0.1rem">
        <Flex>
          <Text fontWeight="500" fontSize="1rem" color="#171717">
            Outfit generation
          </Text>
          <Text fontWeight="500" fontSize="1rem" color="#EE3939">
            *
          </Text>
        </Flex>
        <ImageGuide
          open={state.showGuide}
          onClose={handleGuideClose}
          onOpen={() => setState(prev => ({ ...prev, showGuide: true, isGuideFromUpload: false }))}
        />
      </Flex>

      <Flex
        width="100%"
        height="12.81rem"
        background="#F9F9F9"
        borderRadius="0.5rem"
        alignItems="center"
        justifyContent="center"
        flexFlow="column"
        onClick={handleUploadClick}
        cursor="pointer"
      >
        {isUploading ? (
          <ReactLoading type="spinningBubbles" color="#747474" height="3.38rem" width="3.38rem" />
        ) : uploadedUrl || params.loadOriginalImage ? (
          <Flex h="100%" w="100%" justifyContent="center" alignItems="center" position="relative" overflow="hidden">
            <Image
              src={uploadedUrl || params.loadOriginalImage}
              alt="Background image"
              h="100%"
              w="100%"
              objectFit="cover"
              filter="blur(10px)"
              position="absolute"
              top={0}
              left={0}
              zIndex={0}
            />
            <Image
              src={uploadedUrl || params.loadOriginalImage}
              alt="Foreground image"
              h="100%"
              objectFit="contain"
              zIndex={1}
            />
            <Box
              as="label"
              onClick={e => {
                e.stopPropagation()
                fileInputRef.current?.click()
              }}
              cursor="pointer"
            >
              <Image
                src={ReUpload.src}
                alt="Re-upload icon"
                h="1.1rem"
                w="1.13rem"
                objectFit="cover"
                position="absolute"
                zIndex={2}
                bottom="0.75rem"
                right="0.75rem"
              />
            </Box>
          </Flex>
        ) : (
          <>
            <Image src={UploadImage.src} ml="0.7rem" boxSize="9rem" mt="-2.55rem" zIndex={10} />
            <Text fontWeight="500" fontSize="0.88rem" color="#171717" mt="-3.58rem">
              Upload image
            </Text>
            <Text fontWeight="400" fontSize="0.75rem" color="#BFBFBF" mt="0.38rem">
              10.0MB maximum file size
            </Text>
          </>
        )}
      </Flex>
      <Toaster />
      <Flex mt="0.5rem">
        <Textarea
          ref={textareaRef}
          value={state.text}
          onChange={handleChange}
          placeholder="please enter your editing"
          rows={1}
          width="full"
          background="#ffffff"
          fontWeight="400"
          fontSize="0.75rem"
          textAlign="left"
          textTransform="none"
          borderRadius="0.5rem"
          _placeholder={{ color: "#BFBFBF" }}
          {...textareaStyles}
        />
      </Flex>
    </Box>
  )
}

export default UploadComponent
