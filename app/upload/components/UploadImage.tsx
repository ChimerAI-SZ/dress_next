"use client"
import { useState, useEffect, useRef } from "react"
import { Box, Flex, Text, Button, Image, Spinner, VStack } from "@chakra-ui/react"
import { toaster } from "@components/ui/toaster"

import useAliyunOssUpload from "@hooks/useAliyunOssUpload"
import UploadImage from "@img/upload/upload-image.svg"
import ReUpload from "@img/upload/re-upload.svg"
import ImageGuide from "./ImageGuide"
import { TypesClothingProps } from "@definitions/update"
import ReactLoading from "react-loading"
import { fetchUpdateNeedGuide } from "@lib/request/login"
import { errorCaptureRes, storage } from "@utils/index"

function Page({ onParamsUpdate }: TypesClothingProps) {
  const { uploadToOss, isUploading, uploadProgress, uploadedUrl } = useAliyunOssUpload()
  const [showGuide, setShowGuide] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)

  // 获取并更新新手引导状态
  const updateGuideStatus = async () => {
    const user_id = storage.get("user_id")
    const need_guide = storage.get("need_guide")

    // 如果 need_guide 为 false 或不存在，设置为 false（需要显示引导）
    if ((!need_guide || need_guide === "false") && user_id) {
      storage.set("need_guide", "false")

      const [err, res] = await errorCaptureRes(fetchUpdateNeedGuide, {
        user_id: Number(user_id),
        need_guide: false
      })

      storage.set("need_guide", res?.data?.need_guide ?? "false")
    }
  }

  // 初始化检查新手引导状态
  useEffect(() => {
    updateGuideStatus()
  }, [])

  // 处理上传按钮点击
  const handleUploadClick = async () => {
    const need_guide = storage.get("need_guide")

    if (need_guide === "false" || !need_guide) {
      setShowGuide(true)
      return
    }

    // 如果不需要引导，直接打开文件选择框
    fileInputRef.current?.click()
  }

  // 处理文件选择
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return
    handleUpload(files[0])
  }

  const handleUpload = async (file: File) => {
    try {
      toaster.success({
        title: "Update successful",
        description: "File saved successfully to the server"
      })
      await uploadToOss(file)
    } catch (error) {
      console.error("Upload failed", error)
    }
  }

  const handleGuideClose = async () => {
    setShowGuide(false)

    // 更新本地存储和后端状态
    storage.set("need_guide", "true")
    const user_id = storage.get("user_id")
    await errorCaptureRes(fetchUpdateNeedGuide, {
      user_id,
      need_guide: true
    })

    // 引导关闭后自动打开文件选择框
    setTimeout(() => {
      fileInputRef.current?.click()
    }, 100)
  }

  const handleGuideOpen = () => {
    setShowGuide(true)
  }

  useEffect(() => {
    if (uploadProgress === 100) {
      const newParams = { loadOriginalImage: uploadedUrl }
      onParamsUpdate(newParams)
    }
  }, [uploadProgress])
  return (
    <Box
      alignItems="center"
      justifyContent="center"
      mt="0.8rem"
      width="full"
      position="relative"
      bg={"#FFFFFF"}
      borderRadius={"0.5rem"}
      px="0.75rem"
      pb={"0.75rem"}
      mb={"0.5rem"}
    >
      <Flex justifyContent={"space-between"} alignItems={"center"} py={"0.66rem"} pl={"0.1rem"}>
        <Flex>
          <Text fontFamily="PingFangSC" fontWeight="500" fontSize="1rem" color="#171717">
            Upload image
          </Text>
          <Text font-weight="500" font-size="1rem" color="#EE3939">
            *
          </Text>
        </Flex>
        <ImageGuide open={showGuide} onClose={handleGuideClose} onOpen={handleGuideOpen} />
      </Flex>
      <Flex
        width="100%"
        height="19.38rem"
        background="#F5F5F5"
        borderRadius="0.5rem"
        alignItems="center"
        justifyContent="center"
        flexFlow="column"
      >
        {isUploading ? (
          <ReactLoading type={"spinningBubbles"} color={"#747474"} height={"3.38rem"} width={"3.38rem"} />
        ) : uploadedUrl ? (
          <Flex h="100%" w="100%" justifyContent="center" alignItems="center" position="relative" overflow="hidden">
            <Image
              src={uploadedUrl}
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
            <Image src={uploadedUrl} alt="Foreground image" h="100%" objectFit="contain" zIndex={1} />
            <Box as="label">
              <Image
                src={ReUpload.src}
                alt="Re-upload icon"
                h="1.1rem"
                w="1.13rem"
                objectFit="cover"
                position={"absolute"}
                zIndex={2}
                bottom="0.75rem"
                right="0.75rem"
              />
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileSelect}
              />
            </Box>
          </Flex>
        ) : (
          <>
            <Button
              w="8.19rem"
              h="2rem"
              borderRadius="1rem"
              bg="rgba(255,255,255,0.5)"
              border="0.06rem solid #EE3939"
              cursor="pointer"
              gap={"0.2rem"}
              onClick={handleUploadClick}
            >
              <Image src={UploadImage.src} w="1.13rem" h="1.13rem" />
              <Text fontWeight="400" fontSize="0.88rem" color="#EE3939">
                Upload image
              </Text>
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileSelect}
            />

            <Text fontWeight="400" fontSize="0.81rem" color="#BFBFBF" mt="0.38rem">
              10.0MB maximum file size
            </Text>
          </>
        )}
      </Flex>
    </Box>
  )
}

export default Page
