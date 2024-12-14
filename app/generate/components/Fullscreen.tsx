import { Button } from "@components/ui/button"
import { DialogContent, DialogRoot } from "@components/ui/dialog"
import Header from "@components/Header"
import { Box, Image, Flex, Spinner, Stack, Skeleton } from "@chakra-ui/react"
import { ReactElement, useEffect, useRef, useCallback, useState } from "react"
import { ActionButtons } from "./ActionButtons"
import { errorCaptureRes, storage } from "@utils/index"
import { Toaster, toaster } from "@components/Toaster"
import LoginPrompt from "@components/LoginPrompt"
import { Alert } from "@components/Alert"
import { fetchShoppingAdd, fetchAddImages, fetchRemoveImages, fetchCollectionsList } from "@lib/request/generate-result"
import ToastTest from "@components/ToastTest"
import { useSearchParams, useRouter } from "next/navigation"
import CollectionSuccessToast from "@components/CollectionSuccessToast"
import { css, Global, keyframes } from "@emotion/react"
// Types
import { AlbumItem } from "@definitions/album"
import { ImageListParams } from "@definitions/generate"
interface Item {
  image_url: string
  ID: number
  url: string
}

interface FullscreenProps {
  open: boolean
  setOpen: () => void
  selectedImage: Item | null
  imageList: Item[]
  onLoadMore: () => void
  loading: boolean
  hasMore: boolean
}

interface ImageItemProps {
  item: Item
  index: number
  isLast: boolean
  lastImageRef: (node: HTMLDivElement) => void
}
const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`
const ImageItem = ({ item, index, isLast, lastImageRef }: ImageItemProps) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [showPlaceholder, setShowPlaceholder] = useState(true)

  useEffect(() => {
    setIsLoaded(false)
    setShowPlaceholder(true)
  }, [item.image_url])

  const handleImageLoad = () => {
    setIsLoaded(true)
    setTimeout(() => {
      setShowPlaceholder(false)
    }, 300)
  }

  return (
    <Box
      key={`${item.ID}-${index}`}
      ref={isLast ? lastImageRef : null}
      width="100%"
      display="flex"
      justifyContent="center"
      className="image-item"
      borderRadius="0.63rem"
      overflow="hidden"
      position="relative"
      minHeight="500px"
      role="group"
    >
      {showPlaceholder && (
        <Box
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          borderRadius="4px"
          opacity={isLoaded ? 0 : 1}
          transition="opacity 0.3s ease-in-out"
          zIndex={1}
          bgGradient="linear(to-r, #f6f7f8 8%, #edeef1 18%, #f6f7f8 33%)"
          backgroundSize="2000px 100%"
          animation={`${shimmer} 1.5s linear infinite`}
          boxShadow="inset 0 0 10px rgba(0,0,0,0.05)"
        >
          {/* 可选：添加一个图标占位符 */}
          <Flex height="100%" justify="center" align="center" color="gray.300">
            <svg
              width="40px"
              height="40px"
              viewBox="0 0 24 24"
              fill="currentColor"
              opacity={0.5}
              style={{ opacity: 0.5 }}
            >
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
            </svg>
          </Flex>
        </Box>
      )}
      <Box position="relative" width="fit-content" display="flex" justifyContent="center" alignItems="center">
        <Box position="relative">
          <ActionButtons image={item.image_url} />
          <Image
            border="0.03rem solid #CACACA"
            src={item.image_url}
            alt={`Image ${index + 1}`}
            maxH="90vh"
            maxW="100%"
            objectFit="contain"
            onLoad={handleImageLoad}
            opacity={isLoaded ? 1 : 0}
            transition="opacity 0.3s ease-in-out"
            zIndex={2}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default function Pages({
  open,
  setOpen,
  selectedImage,
  imageList,
  onLoadMore,
  loading,
  hasMore
}: FullscreenProps): ReactElement {
  const scrollRef = useRef<HTMLDivElement>(null)
  const observer = useRef<IntersectionObserver | null>(null)
  const initialScrollDone = useRef(false)
  const scrollAttempts = useRef(0)

  // 监听滚动到底部
  const lastImageRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          onLoadMore()
        }
      })

      if (node) observer.current.observe(node)
    },
    [loading, hasMore, onLoadMore]
  )

  // 滚动到选中的图片位置
  const scrollToSelectedImage = useCallback(() => {
    if (!scrollRef.current || !selectedImage || scrollAttempts.current > 5) return

    const selectedIndex = imageList.findIndex(img => img.ID === selectedImage.ID)
    if (selectedIndex > -1) {
      const container = scrollRef.current
      const imageElements = container?.querySelectorAll(".image-item")
      const targetElement = imageElements?.[selectedIndex] as HTMLElement

      if (container && targetElement) {
        const containerRect = container.getBoundingClientRect()
        const targetRect = targetElement.getBoundingClientRect()
        const scrollTop = targetElement.offsetTop - (containerRect.height - targetRect.height) / 2

        container.scrollTo({
          top: scrollTop,
          behavior: "instant"
        })
        initialScrollDone.current = true
        scrollAttempts.current = 0
        return true
      }
    }
    scrollAttempts.current++
    return false
  }, [selectedImage, imageList])

  // 处理弹窗打开和关闭
  useEffect(() => {
    if (!open) {
      initialScrollDone.current = false
      scrollAttempts.current = 0
      return
    }

    if (open && selectedImage && !initialScrollDone.current) {
      // 尝试立即滚动
      const success = scrollToSelectedImage()

      // 如果立即滚动失败，设置一个重试间隔
      if (!success) {
        const retryInterval = setInterval(() => {
          const scrolled = scrollToSelectedImage()
          if (scrolled || scrollAttempts.current > 5) {
            clearInterval(retryInterval)
          }
        }, 100) // 每 100ms 尝试一次

        // 5秒后清除重试
        setTimeout(() => {
          clearInterval(retryInterval)
          scrollAttempts.current = 0
        }, 5000)

        return () => clearInterval(retryInterval)
      }
    }
  }, [open, selectedImage, scrollToSelectedImage])

  return (
    <DialogRoot open={open} size="full" motionPreset="slide-in-bottom">
      <DialogContent pt={4}>
        <Header
          open={open}
          cb={() => {
            setOpen()
          }}
        />
        <Box
          ref={scrollRef}
          overflowY="auto"
          height="calc(100vh - 2.85rem)"
          px={"1rem"}
          css={{
            scrollBehavior: "smooth",
            "&::-webkit-scrollbar": {
              width: "4px"
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent"
            },
            "&::-webkit-scrollbar-thumb": {
              background: "gray.300",
              borderRadius: "2px"
            }
          }}
        >
          <Stack direction="column" align="center" width="100%" gap={"0.75rem"}>
            {imageList.map((item, index) => (
              <ImageItem
                key={`${item.ID}-${index}`}
                item={item}
                index={index}
                isLast={index === imageList.length - 1}
                lastImageRef={lastImageRef}
              />
            ))}
            {loading && (
              <Box py={4}>
                <Spinner size="lg" />
              </Box>
            )}
          </Stack>
        </Box>
      </DialogContent>
    </DialogRoot>
  )
}
