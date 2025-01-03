import { Box, Flex, Image } from "@chakra-ui/react"
import { images } from "@constants/images"

import { useState, useEffect, useCallback } from "react"
import { Toaster, toaster } from "@components/Toaster"
import Header from "@components/Header"
import { Alert } from "@components/Alert"

// Types
import { AlbumItem } from "@definitions/album"
import { ImageListParams } from "@definitions/generate"

// Utils & API
import { errorCaptureRes, storage } from "@utils/index"
import { fetchShoppingAdd, fetchAddImages, fetchRemoveImages, fetchCollectionsList } from "@lib/request/generate-result"
import { useSearchParams, useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { setGenerateImage } from "@store/features/workSlice"

// Components
import LoginPrompt from "@components/LoginPrompt"
import CollectionSuccessToast from "@components/CollectionSuccessToast"
import CollectionSelector from "../../generate-result/components/CollectionSelector"
import CollectionDialog from "../../album/components/AlbumDrawer"
import ToastTest from "@components/ToastTest"
interface ActionButtonsProps {
  image: string
}

export const ActionButtons = ({ image }: ActionButtonsProps) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const userId = storage.get("user_id")
  const searchParams = useSearchParams()
  const params = searchParams ? Object.fromEntries(searchParams.entries()) : {}
  const typedParams = {
    imageList: params.imageList || "[]",
    loadOriginalImage: params.loadOriginalImage || ""
  } as ImageListParams

  // State
  const [imageList, setImageList] = useState<string[]>(JSON.parse(typedParams.imageList))
  const [selectImage, setSelectImage] = useState(image)
  const [likeList, setLikeList] = useState<string[]>([])
  const [originImage] = useState(typedParams.loadOriginalImage)
  const [isAllSelected, setIsAllSelected] = useState(false)
  const [active, setActive] = useState(false)
  const [jionLike, setJionLike] = useState<string[]>([])

  // Collection states
  const [collectSuccessVisible, setCollectSuccessVisible] = useState(false)
  const [collectionSelectorVisible, setCollectionSelectorVisible] = useState(false)
  const [dialogVisible, setDialogVisible] = useState(false)
  const [collectionList, setCollectionList] = useState<AlbumItem[]>([])
  const [selectedCollection, setSelectedCollection] = useState<string[]>([])

  // 添加一个状态来保存最近收藏的图片
  const [recentCollectedImages, setRecentCollectedImages] = useState<string[]>([])

  // 添加默认收藏夹 ID 的状态
  const [defaultCollectionId, setDefaultCollectionId] = useState<number | null>(null)

  // 添加一个新的状态来跟踪图片所在的收藏夹
  const [imageCollections, setImageCollections] = useState<Map<string, number>>(new Map())

  // 添加 ToastTest 相关的状态
  const [isOpen, setIsOpen] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [selectedCartImage, setSelectedCartImage] = useState("")

  // Handlers
  const handleLoginPrompt = useCallback(() => {
    if (!userId) {
      toaster.create({
        description: <LoginPrompt onLogin={() => router.push("/login")} />
      })
      return false
    }
    return true
  }, [userId])

  const handleDownload = useCallback((url: string) => {
    const link = document.createElement("a")
    link.href = url
    link.download = url.split("/").pop() || "download"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [])

  // 获取收藏夹列表和默认收藏夹 ID
  const fetchCollections = useCallback(async () => {
    console.log("Starting fetchCollections...")

    const [err, res] = await errorCaptureRes(fetchCollectionsList, {
      user_id: Number(userId)
    })

    console.log("API response:", { err, res })

    if (err || (res && !res?.success)) {
      console.error("Error fetching collections:", err || res.message)
      Alert.open({
        content: err?.message ?? res.message
      })
    } else if (res?.success) {
      const defaultCollection = res.data.find((album: { is_default: boolean }) => album.is_default === true)

      if (defaultCollection) {
        setDefaultCollectionId(defaultCollection.collection_id)
      }
      setCollectionList(res.data)
      console.log("Collections loaded successfully:", res.data)
      return defaultCollection.collection_id
    }
  }, [userId])

  // 在组件加载时获取收藏夹列表
  // useEffect(() => {
  //   console.log("Current userId:", userId)
  //   if (userId) {
  //     console.log("Fetching collections for userId:", userId)
  //   } else {
  //     console.log("No userId found, skipping fetchCollections")
  //   }
  // }, [userId, fetchCollections])
  console.log("defaultCollection1111", defaultCollectionId)
  const handleAddToCollection = useCallback(
    async (images: string[]) => {
      if (!handleLoginPrompt()) return
      let defaultId = defaultCollectionId
      if (!defaultId) {
        defaultId = await fetchCollections()
      }

      if (!defaultId) {
        Alert.open({ content: "Default collection not found" })
        return
      }

      const [err, res] = await errorCaptureRes(fetchAddImages, {
        user_id: userId,
        image_urls: images,
        collection_id: defaultId
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
        images.forEach(img => newImageCollections.set(img, defaultId))
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

  const handleSelectAll = useCallback(
    (newLikeList: string[]) => {
      setLikeList(newLikeList)
      setIsAllSelected(newLikeList.length === imageList.length)
    },
    [imageList.length]
  )

  // Effects
  // useEffect(() => {
  //   dispatch(setGenerateImage([]))
  // }, [dispatch])

  // useEffect(() => {
  //   if (active) {
  //     setIsAllSelected(likeList.length === imageList.length && likeList.every(item => imageList.includes(item)))
  //   }
  // }, [likeList, active, imageList])

  const handleCollectionSuccess = (newCollection: AlbumItem) => {
    setCollectionList(prev => [...prev, newCollection])
    setDialogVisible(false)
    setCollectionSelectorVisible(true)
  }

  // 在关闭收藏夹选择器时也清空最近收藏的图片
  const handleCloseCollectionSelector = () => {
    setCollectionSelectorVisible(false)
    setLikeList([])
    setRecentCollectedImages([])
  }

  const handleRemoveFromCollection = useCallback(
    async (image: string) => {
      // 获取图片当前所在的收藏夹ID
      const currentCollectionId = imageCollections.get(image) || defaultCollectionId
      if (!currentCollectionId) {
        Alert.open({ content: "Collection not found" })
        return
      }

      const [err, res] = await errorCaptureRes(fetchRemoveImages, {
        user_id: Number(userId),
        image_urls: [image],
        collection_id: currentCollectionId // 使用当前收藏夹ID
      })

      if (err) {
        Alert.open({ content: err.message })
        return
      }

      if (res.success) {
        setJionLike(prev => prev.filter(i => i !== image))
        // 从图片收藏夹映射中移除
        const newImageCollections = new Map(imageCollections)
        newImageCollections.delete(image)
        setImageCollections(newImageCollections)
      }
    },
    [userId, defaultCollectionId, imageCollections]
  )

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

      if (res?.success) {
        Alert.open({ content: "Successfully added to cart" })
      }
    },
    [handleLoginPrompt, userId]
  )

  // 修改 ToastTest 相关的处理函数
  const openDialog = useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeDialog = useCallback(() => {
    setIsOpen(false)
    setPhoneNumber("")
  }, [])

  const affirmDialog = useCallback(async () => {
    const imagesToAdd = active ? likeList : [selectedCartImage]
    await handleAddToCart(imagesToAdd, phoneNumber)
    closeDialog()
    if (active) {
      setLikeList([])
      setActive(false)
    }
  }, [handleAddToCart, active, likeList, selectedCartImage, phoneNumber, closeDialog])

  // 添加一个新的函数来处理购物车点击
  const handleCartClick = useCallback(
    (image: string) => {
      if (active) {
        return
      }
      setSelectedCartImage(image)
      setIsOpen(true)
    },
    [active]
  )

  const handleLargeImageLike = (image: string) => {
    if (jionLike.includes(image)) {
      handleRemoveFromCollection(image)
    } else {
      handleAddToCollection([image])
    }
  }
  return (
    <>
      <CollectionSelector
        visible={collectionSelectorVisible}
        collections={collectionList}
        selectedCollections={selectedCollection}
        onSelect={handleCollectionSelect}
        onClose={handleCloseCollectionSelector}
        onAddNew={() => {
          setCollectionSelectorVisible(false)
          setDialogVisible(true)
        }}
      />
      <CollectionDialog
        type="add"
        visible={dialogVisible}
        close={() => setDialogVisible(false)}
        onSuccess={handleCollectionSuccess}
      />
      <ToastTest
        isOpen={isOpen}
        phoneNumber={phoneNumber}
        onOpen={openDialog}
        onClose={closeDialog}
        affirmDialog={affirmDialog}
        setPhoneNumber={setPhoneNumber}
      />
      <Toaster />

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
        borderRadius="0 0 0.63rem 0.63rem"
        padding="2rem 0.87rem 0.87rem 0.87rem"
        width="100%"
        justifyContent="flex-end"
        style={{ pointerEvents: "none" }}
      >
        <Flex
          position="absolute"
          bottom={0}
          right="0"
          gap="1rem"
          pb="0.87rem"
          pr="0.87rem"
          zIndex={21}
          style={{ pointerEvents: "auto" }}
        >
          <Box
            onClick={e => {
              e.stopPropagation()
              handleDownload(selectImage)
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
              handleLargeImageLike(selectImage)
            }}
            cursor="pointer"
            _hover={{ transform: "scale(1.1)" }}
            transition="transform 0.2s"
          >
            <Image boxSize="2.25rem" src={jionLike.includes(selectImage) ? images.LikeTop : images.Like} />
          </Box>
          <Box
            onClick={e => {
              e.stopPropagation()
              handleCartClick(selectImage)
            }}
            cursor="pointer"
            _hover={{ transform: "scale(1.1)" }}
            transition="transform 0.2s"
          >
            <Image boxSize="2.25rem" src={images.Shop} />
          </Box>
        </Flex>
      </Flex>
    </>
  )
}
