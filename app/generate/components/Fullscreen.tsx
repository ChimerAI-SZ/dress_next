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
  setOpen: (open: boolean) => void
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

const ImageItem = ({ item, index, isLast, lastImageRef }: ImageItemProps) => {
  // State
  const [selectImage, setSelectImage] = useState("")
  const [likeList, setLikeList] = useState<string[]>([])
  const [active, setActive] = useState(false)
  const [jionLike, setJionLike] = useState<string[]>([])

  // Collection states
  const [collectSuccessVisible, setCollectSuccessVisible] = useState(false)
  const [collectionSelectorVisible, setCollectionSelectorVisible] = useState(false)
  const [dialogVisible, setDialogVisible] = useState(false)
  const [collectionList, setCollectionList] = useState<AlbumItem[]>([])
  const [selectedCollection, setSelectedCollection] = useState<string[]>([])
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)
  const [showPlaceholder, setShowPlaceholder] = useState(true)
  const router = useRouter()
  const [seletcImage, setSeletcImage] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  // 添加一个状态来保存最近收藏的图片
  const [recentCollectedImages, setRecentCollectedImages] = useState<string[]>([])

  // 添加默认收藏夹 ID 的状态
  const [defaultCollectionId, setDefaultCollectionId] = useState<number | null>(null)

  // 添加一个新的状态来跟踪图片所在的收藏夹
  const [imageCollections, setImageCollections] = useState<Map<string, number>>(new Map())

  const [selectedCartImage, setSelectedCartImage] = useState("")

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
  const userId = storage.get("user_id")
  console.log(userId)
  const handleLoginPrompt = useCallback(() => {
    if (!userId) {
      toaster.create({
        description: <LoginPrompt onLogin={() => router.push("/login")} />
      })
      return false
    }
    return true
  }, [userId])
  // 获取收藏夹列表和默认收藏夹 ID
  const fetchCollections = useCallback(async () => {
    const [err, res] = await errorCaptureRes(fetchCollectionsList, {
      user_id: Number(userId)
    })

    if (err || (res && !res?.success)) {
      Alert.open({
        content: err?.message ?? res.message
      })
    } else if (res?.success) {
      // 筛选出默认收藏夹
      const defaultCollection = res.data.find((album: { is_default: boolean }) => album.is_default === true)
      if (defaultCollection) {
        setDefaultCollectionId(defaultCollection.collection_id)
      }
      setCollectionList(res.data)
    }
  }, [userId])

  // 在组件加载时获取收藏夹列表
  useEffect(() => {
    console.log(userId)
    if (userId) {
      fetchCollections()
    }
  }, [userId])
  // 修改 ToastTest 相关的处理函数

  const openDialog = useCallback(() => {
    setIsOpen(true)
  }, [])
  const handleAddToCart = useCallback(
    async (images: string[], phone: string) => {
      if (!handleLoginPrompt()) return

      const [err, res] = await errorCaptureRes(fetchShoppingAdd, {
        user_id: Number(userId),
        img_urls: images,
        phone
      })

      if (err) {
        Alert.open({ content: err.message })
        return
      }

      if (res.success) {
        Alert.open({ content: "Successfully added to cart" })
      }
    },
    [handleLoginPrompt, userId]
  )
  const closeDialog = useCallback(() => {
    setIsOpen(false)
    setPhoneNumber("")
  }, [])
  const affirmDialog = useCallback(async () => {
    await handleAddToCart([seletcImage], phoneNumber)
    closeDialog()
    // if (active) {
    //   setLikeList([])
    //   setActive(false)
    // }
  }, [handleAddToCart])
  const handleAddToCollection = useCallback(
    async (images: string[]) => {
      if (!handleLoginPrompt()) return
      if (!defaultCollectionId) {
        Alert.open({ content: "Default collection not found" })
        return
      }

      const [err, res] = await errorCaptureRes(fetchAddImages, {
        user_id: userId,
        image_urls: images,
        collection_id: defaultCollectionId
      })

      if (err) {
        Alert.open({ content: err.message })
        return
      }

      if (res.success) {
        setJionLike(prev => [...prev, ...images])
        setRecentCollectedImages(images)
        // 更新图片所在的收藏夹
        const newImageCollections = new Map(imageCollections)
        images.forEach(img => newImageCollections.set(img, defaultCollectionId))
        setImageCollections(newImageCollections)

        toaster.create({
          description: (
            <CollectionSuccessToast
              onMoveTo={() => {
                toaster.dismiss()
                setCollectionSelectorVisible(true)
              }}
            />
          )
        })
      }
    },
    [handleLoginPrompt, userId, defaultCollectionId, imageCollections]
  )

  const handleCollectionSelect = useCallback(
    async (collections: string[]) => {
      setSelectedCollection(collections)
      const newCollectionId = Number(collections[0])

      // 如果是移动最近收藏的图片到新收藏夹
      if (recentCollectedImages.length > 0) {
        const [err, res] = await errorCaptureRes(fetchAddImages, {
          user_id: userId,
          image_urls: recentCollectedImages,
          collection_id: newCollectionId
        })

        if (err) {
          Alert.open({ content: err.message })
        } else if (res.success) {
          // 更新图片所在的收藏夹
          const newImageCollections = new Map(imageCollections)
          recentCollectedImages.forEach(img => newImageCollections.set(img, newCollectionId))
          setImageCollections(newImageCollections)

          Alert.open({ content: "Successfully moved to new collection" })
          setRecentCollectedImages([])
        }
      }
      // 如果是批量选择的图片
      else if (likeList.length > 0) {
        const [err, res] = await errorCaptureRes(fetchAddImages, {
          user_id: userId,
          image_urls: likeList,
          collection_id: Number(collections[0])
        })

        if (err) {
          Alert.open({ content: err.message })
        } else if (res.success) {
          setJionLike(prev => [...prev, ...likeList])
          setLikeList([])
        }
      }

      setCollectionSelectorVisible(false)
    },
    [likeList, recentCollectedImages, userId, imageCollections]
  )
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
          bg="gray.100"
          borderRadius="0.63rem"
          opacity={isLoaded ? 0 : 1}
          transition="opacity 0.3s ease-in-out"
          zIndex={1}
        />
      )}
      <Box position="relative" width="fit-content" display="flex" justifyContent="center" alignItems="center">
        <Box position="relative">
          <ActionButtons
            image={item.image_url}
            liked={false}
            onDownload={image => {
              // 处理下载逻辑
            }}
            onLike={image => {
              handleAddToCollection([image])
            }}
            onAddToCart={images => {
              setSeletcImage(images)
              setIsOpen(true)
            }}
          />
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
        <ToastTest
          isOpen={isOpen}
          phoneNumber={phoneNumber}
          onOpen={openDialog}
          onClose={closeDialog}
          affirmDialog={affirmDialog}
          setPhoneNumber={setPhoneNumber}
        />
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
            setOpen(false)
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
