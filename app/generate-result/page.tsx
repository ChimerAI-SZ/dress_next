"use client"

import { useState, useEffect, useCallback } from "react"
import { Box } from "@chakra-ui/react"
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
import LoginPrompt from "../../components/LoginPrompt"
import CollectionSuccessToast from "../../components/CollectionSuccessToast"
import ImageGallery from "./components/ImageGallery"
import ActionButtons from "./components/ActionButtons"
import CollectionSelector from "./components/CollectionSelector"
import CollectionDialog from "../album/components/AlbumDrawer"
import ToastTest from "@components/ToastTest"

export default function GenerateResult() {
  const dispatch = useDispatch()
  const router = useRouter()
  const userId = storage.get("user_id")
  const searchParams = useSearchParams()
  const params = Object.fromEntries(searchParams.entries())
  const typedParams = {
    imageList: params.imageList || "[]",
    loadOriginalImage: params.loadOriginalImage || ""
  } as ImageListParams

  // State
  const [imageList, setImageList] = useState<string[]>(JSON.parse(typedParams.imageList))
  const [selectImage, setSelectImage] = useState(imageList[0])
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
      setCollectionList(res.data)
      if (defaultCollection) {
        setDefaultCollectionId(defaultCollection.collection_id)
        return defaultCollection.collection_id
      }
    }
  }, [userId])

  const handleAddToCollection = useCallback(
    async (images: string[]) => {
      if (!handleLoginPrompt()) return
      const collectionId = defaultCollectionId || (await fetchCollections())
      if (!collectionId) {
        Alert.open({ content: "Default collection not found" })
        return
      }

      const [err, res] = await errorCaptureRes(fetchAddImages, {
        user_id: userId,
        image_urls: images,
        collection_id: collectionId
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
        images.forEach(img => newImageCollections.set(img, collectionId))
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
  useEffect(() => {
    dispatch(setGenerateImage([]))
  }, [dispatch])

  useEffect(() => {
    if (active) {
      setIsAllSelected(likeList.length === imageList.length && likeList.every(item => imageList.includes(item)))
    }
  }, [likeList, active, imageList])

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

      if (res.success) {
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

  // 添加批量加购函数
  const handleBatchAddToCart = useCallback(() => {
    if (likeList.length === 0) {
      Alert.open({ content: "Please select images first" })
      return
    }
    setIsOpen(true)
  }, [likeList])

  return (
    <Box h="100vh" position="relative" pt={4} px="1rem">
      <Header show noTitle cb={setActive} />
      <Toaster />

      <ImageGallery
        selectImage={selectImage}
        originImage={originImage}
        imageList={imageList}
        active={active}
        likeList={likeList}
        jionLike={jionLike}
        onSelect={setSelectImage}
        onLike={setLikeList}
        onDownload={handleDownload}
        onCollect={image => handleAddToCollection([image])}
        onUncollect={handleRemoveFromCollection}
        onAddToCart={handleCartClick}
      />

      <ActionButtons
        active={active}
        isAllSelected={isAllSelected}
        likeList={likeList}
        imageList={imageList}
        onSelectAll={handleSelectAll}
        onDownload={handleDownload}
        onLike={handleAddToCollection}
        onAddToCart={handleBatchAddToCart}
        selectImage={selectImage}
      />

      {/* Dialogs */}
      <CollectionDialog
        type="add"
        visible={dialogVisible}
        close={() => setDialogVisible(false)}
        onSuccess={handleCollectionSuccess}
      />

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

      <ToastTest
        isOpen={isOpen}
        phoneNumber={phoneNumber}
        onOpen={openDialog}
        onClose={closeDialog}
        affirmDialog={affirmDialog}
        setPhoneNumber={setPhoneNumber}
      />
    </Box>
  )
}
