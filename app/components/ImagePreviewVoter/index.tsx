import { useCallback, useEffect, useRef, useState } from "react"
import styled from "@emotion/styled"
import { useRouter } from "next/navigation"

import { Portal, Image, Flex, Show, Box } from "@chakra-ui/react"
import { Toaster, toaster } from "@components/Toaster"
import { Alert } from "@components/Alert"
import LoginPrompt from "@components/LoginPrompt"
import ToastTest from "@components/ToastTest"

import Footer from "./components/Footer"
import Details from "./components/Details"
import Header from "./components/Header"
import DetailTips from "./components/DetailTips"

import { fetchImageDetails, imageRate, fetchRecommendImages } from "@lib/request/page"
import { fetchShoppingAdd } from "@lib/request/generate-result"
import { errorCaptureRes, storage } from "@utils/index"
import useImageActions from "@hooks/useImageActions"
import { setParams } from "@store/features/workSlice"
import { useDispatch } from "react-redux"
import { LikedItem } from "@definitions/mainPage"
const userId = storage.get("user_id")

interface ImageItem {
  image_url: string
  ID: number
  url: string
}
interface ImageViewerProps {
  close: () => void
  initImgUrl: string
  imgList: ImageItem[]
  fetchData: () => void
  likedList: LikedItem[]
  setLikedList: (value: LikedItem[]) => void
}

interface DetailItem {
  label: string
  value: string | string[]
  img: string
}
// 每多少个like去调用recommend接口
const RECOMMEND_INTERVAL = 5

const ImageViewer: React.FC<ImageViewerProps> = ({
  close,
  initImgUrl,
  imgList,
  fetchData,
  likedList,
  setLikedList
}) => {
  // 找到初始图片在列表中的索引
  const initIndex = imgList.findIndex(item => item.image_url === initImgUrl)

  const router = useRouter()
  const dispatch = useDispatch()
  const [imgUrl, setImgUrl] = useState(initImgUrl)
  const [nextImgUrl, setNextImgUrl] = useState(imgList[initIndex + 1]?.image_url)
  const [allImages, setAllImages] = useState<ImageItem[]>(imgList.slice(initIndex))

  const [footerHeight, setFooterHeight] = useState<number>(80) // footer的实际高度
  const [isLoading, setIsLoading] = useState(false)
  const [currentLoadingImage, setCurrentLoadingImage] = useState(0) // loading轮播图的索引
  const [isRating, setIsRating] = useState(false) // 防止重复点击喜欢/不喜欢按钮，但是不需要进入loading状态，所以设置一个独立的state
  const [active, setActive] = useState(false)

  const [isFirstImgVisible, setIsFirstImgVisible] = useState(true) // 标记 curImg 和 nextImg 目前正在看哪张图
  const [imgIndex, setImgIndex] = useState(imgList.slice(initIndex).findIndex(item => item.image_url === initImgUrl)) // 模拟喜欢/不喜欢用的图片下标，
  const [likeCount, setLikeCount] = useState(0) //点赞计数器

  const [detailText, setDetailText] = useState("details") // 底部详情的文本
  const [footerBtnText, setFooterBtnText] = useState("Start To Design") // 底部按钮的文本

  const [detailList, setDetailList] = useState<DetailItem[]>([])

  // ToastTest 相关的状态
  const [isOpen, setIsOpen] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")

  // refs begins
  const contentRef = useRef<null | HTMLDivElement>(null)

  const currentImgRef = useRef<null | HTMLImageElement>(null)
  const nextImgRef = useRef<null | HTMLImageElement>(null)

  // 底部footer区块
  const footerRef = useRef<null | HTMLDivElement>(null)

  // 喜欢、不喜欢的prompt
  const dislikeRef = useRef<null | HTMLDivElement>(null)
  const liekRef = useRef<null | HTMLDivElement>(null)
  // refs ends

  const { handleDownload } = useImageActions(userId ?? "")

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

  // 加入收藏夹
  const handleAddToCart = useCallback(
    async (images: string[], phone: string) => {
      if (!handleLoginPrompt()) return

      const [err, res] = await errorCaptureRes(fetchShoppingAdd, {
        user_id: Number(userId),
        img_urls: images,
        phone
      })

      if (err) {
        Alert.open({
          content: "Failed to add to cart, \n Please try again."
        })

        return
      }

      if (res.success) {
        Alert.open({
          content: "Add to cart successfully",
          type: "success",
          customIcon: "/assets/images/mainPage/successIcon.png",
          containerStyle: {
            width: "60vw"
          }
        })
      }
    },
    [handleLoginPrompt, userId]
  )

  // 添加一个新的函数来处理购物车点击
  const handleCartClick = useCallback(() => {
    if (active) {
      return
    }
    setIsOpen(true)
  }, [active])

  // 查看详情
  const handleViewDetails = async () => {
    try {
      // 如果已经获取过详情，就不再获取
      if (detailList.length > 0) return

      setIsLoading(true) // 开始加载
      // 添加延时以等待 DOM 更新

      setTimeout(() => {
        const contentElement = contentRef.current

        if (contentElement) {
          contentElement.scrollTo({
            top: contentElement.scrollHeight,
            behavior: "smooth"
          })
        }
      }, 100)

      const [err, res] = await errorCaptureRes(fetchImageDetails, { image_url: imgUrl })

      if (err || (res && !res?.success)) {
        Alert.open({
          content: err.message ?? res.message
        })
      } else if (res?.success && res.result) {
        const details: DetailItem[] = [
          {
            label: "Culture",
            value: res.result.culture,
            img: "/assets/images/mainPage/Culture.png"
          },
          {
            label: "Material",
            value: res.result.material.split(",").map((item: string) => item.trim()),
            img: "/assets/images/mainPage/Material.png"
          },
          {
            label: "Trend Style",
            value: res.result.trend.split(",").map((item: string) => item.trim()),
            img: "/assets/images/mainPage/Trend_Style.png"
          },
          {
            label: "Silhoutte",
            value: res.result.style,
            img: "/assets/images/mainPage/Silhoutte.png"
          }
        ]

        setDetailList(details)

        setDetailText("More Details")
        setFooterBtnText("Generate")
      }
    } catch (error) {
      console.error("获取图片详情失败:", error)
    } finally {
      setIsLoading(false) // 结束加载
    }
  }

  // 获取推荐图片
  const getRecommendImages = async () => {
    try {
      const [err, res] = await errorCaptureRes(fetchRecommendImages, {
        user_uuid: userId ?? localStorage.getItem("random_user_id")
      })

      if (err || !res?.success) {
        Alert.open({
          content: err?.message ?? res?.message ?? "获取推荐图片失败"
        })
        return
      }

      if (res?.success && res.data?.length > 0) {
        // 将新图片添加到列表末尾
        setAllImages(prev => {
          const insertIndex = (imgIndex + 2) % prev.length

          return [...prev.slice(0, insertIndex), ...res.data, ...prev.slice(insertIndex)]
        })
      }
    } catch (error) {
      console.error("获取推荐图片失败:", error)
    }
  }

  // 喜欢/不喜欢
  const handleImageAction = useCallback(
    async (isLike: boolean) => {
      // 添加一个状态防止重复点击
      if (isRating) return
      setIsRating(true)

      // 切换图片就清空详情
      setDetailList([])
      setDetailText("details")
      setFooterBtnText("Start To Design")

      // 如果是喜欢操作且图片已在likedList中,则不调用接口
      const isImageLiked = likedList.some(item => item.image_url === allImages[imgIndex].image_url)

      if (!(isLike && isImageLiked)) {
        const [err, res] = await errorCaptureRes(imageRate, {
          image_url: allImages[imgIndex].image_url,
          // 没有用户id就随机生成一个
          user_uuid: userId ?? localStorage.getItem("random_user_id"),
          action: isLike ? "like" : "dislike"
        })

        if (err || (res && !res?.success)) {
          Alert.open({
            content: err.message ?? res.message
          })

          setIsRating(false)

          return
        }

        // 如果是喜欢操作且图片不在likedList中,添加到likedList
        if (isLike && !isImageLiked) {
          setLikedList([...likedList, { image_url: allImages[imgIndex].image_url, liked: true }])
        }
      }

      // 检查是否需要获取更多图片
      const remainingImages = allImages.length - (imgIndex + 1)

      // 如果剩余图片数量不足以凑齐5个like，就获取更多图片
      if (remainingImages < (isLike ? RECOMMEND_INTERVAL - likeCount - 1 : RECOMMEND_INTERVAL - likeCount)) {
        fetchData()
      }

      if (isLike) {
        const newLikeCount = likeCount + 1
        setLikeCount(newLikeCount)

        // 每点赞一定次也获取新推荐
        if (newLikeCount % RECOMMEND_INTERVAL === 0) {
          await getRecommendImages()
        }
      }

      const promptRef = isLike ? liekRef : dislikeRef

      if (promptRef.current && currentImgRef.current && nextImgRef.current) {
        const promptNode = promptRef.current
        const curImgNode = currentImgRef.current
        const nextImgNode = nextImgRef.current

        // 显示提示动画
        promptNode.style.opacity = "1"
        promptNode.style.transform = "translate(-50%, -50px) scale(1.2)"
        promptNode.style.transition = "transform 0.5s ease"

        setTimeout(() => {
          // 隐藏提示
          promptNode.style.opacity = "0"
          promptNode.style.transform = "translateX(-50%)"

          // 移动图片
          const moveDirection = isLike ? "110%" : "-110%"
          if (isFirstImgVisible) {
            curImgNode.style.zIndex = "1"
            curImgNode.style.transform = `translateX(${moveDirection})`

            nextImgNode.style.opacity = "1"
            nextImgNode.style.transform = "unset"
          } else {
            nextImgNode.style.zIndex = "1"
            nextImgNode.style.transform = `translateX(${moveDirection})`

            curImgNode.style.opacity = "1"
            curImgNode.style.transform = "unset"
          }

          // 重置图片位置
          setTimeout(() => {
            const nextIndex = (imgIndex + 1) % allImages.length

            if (isFirstImgVisible) {
              curImgNode.style.opacity = "0"
              curImgNode.style.zIndex = "0"
              curImgNode.style.transform = "scale(0.8)"

              nextImgNode.style.zIndex = "1"
              // 更新当前显示的图片
              setImgUrl(allImages[nextIndex + 1].image_url)
            } else {
              nextImgNode.style.opacity = "0"
              nextImgNode.style.zIndex = "0"
              nextImgNode.style.transform = "scale(0.8)"

              curImgNode.style.zIndex = "1"
              // 更新当前显示的图片
              setNextImgUrl(allImages[nextIndex + 1].image_url)
            }

            // 更新下一张图片的索引
            setImgIndex(nextIndex)

            setIsFirstImgVisible(!isFirstImgVisible)

            setIsRating(false) // 等动画都执行完了再设置为false
          }, 500)
        }, 800)
      }
    },
    [imgUrl, userId, isFirstImgVisible, imgIndex, allImages, likeCount, isRating]
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
    const imagesToAdd = [allImages[imgIndex].image_url]

    await handleAddToCart(imagesToAdd, phoneNumber)

    closeDialog()

    if (active) {
      setActive(false)
    }
  }, [handleAddToCart, active, phoneNumber, closeDialog])

  useEffect(() => {
    // 获取底部按钮区的高度，用于占位块
    if (footerRef.current) {
      console.log(footerRef.current.clientHeight, "footer height ")
      setFooterHeight(footerRef.current.clientHeight)
    }
  }, [footerRef.current])
  useEffect(() => {
    if (!userId) {
      // 没有登录 localstorage 也没有随机id，往 localstorage 里都存一个随机id
      if (!localStorage.getItem("random_user_id")) {
        const randomUserId = Math.random().toString(36).substring(2, 18) // 如果 userId 不存在的话，会用到这个随机的id

        localStorage.setItem("random_user_id", randomUserId)
      }
    }
  }, [])

  useEffect(() => {
    // 找到allImages最后一张图片在imgList中的位置
    const lastImageIndex = imgList.findIndex(img => img.image_url === allImages[allImages.length - 1]?.image_url)

    if (lastImageIndex !== -1 && lastImageIndex < imgList.length - 1) {
      // 将lastImageIndex之后的图片添加到allImages
      const newImages = imgList.slice(lastImageIndex)
      setAllImages(prev => {
        console.log([...prev, ...newImages])
        return [...prev, ...newImages]
      })
    }
  }, [imgList.length])

  // 添加轮播计时器
  useEffect(() => {
    if (isLoading) {
      const timer = setInterval(() => {
        setCurrentLoadingImage(prev => (prev + 1) % 3)
      }, 500)

      return () => clearInterval(timer)
    }
  }, [isLoading])

  return (
    <Portal>
      <Container>
        <Wrapper>
          <Bg />

          <Content ref={contentRef}>
            {/* 喜欢/不喜欢的提示元素 */}
            <Prompt ref={dislikeRef}>
              <Image boxSize={"2.5rem"} src={"/assets/images/mainPage/dislikePrompt.svg"} alt="dislike-prompt" />
            </Prompt>
            <Prompt ref={liekRef}>
              <Image boxSize={"2.5rem"} src={"/assets/images/mainPage/likePrompt.svg"} alt="watnt-prompt" />
            </Prompt>

            <Flex
              alignItems={"center"}
              justifyContent={"center"}
              flexDirection={"column"}
              h={`calc(100% - ${footerHeight}px)`}
              flexShrink={0}
            >
              {/* 头部 */}
              <Header close={close} />

              {/* 图片预览区 */}
              <Box w={"100%"} position={"relative"} overflow={"hidden"} p={"0.75rem"} flexGrow={"1"}>
                <StyledImg ref={currentImgRef} style={{ "--bg-image": `url(${imgUrl})` } as React.CSSProperties}>
                  <img src={imgUrl} />
                </StyledImg>

                <NextImg ref={nextImgRef} style={{ "--bg-image": `url(${nextImgUrl})` } as React.CSSProperties}>
                  <img src={nextImgUrl} />
                </NextImg>
                <ButtonBox>
                  <Flex>
                    <Flex
                      alignItems={"center"}
                      justifyContent={"center"}
                      boxSize={"2.5rem"}
                      bg={"rgba(255, 255, 255, 0.7)"}
                      borderRadius={"50%"}
                      mr={"0.75rem"}
                    >
                      <Image
                        boxSize={"1rem"}
                        onClick={() => handleDownload(allImages[imgIndex].image_url)}
                        src={"/assets/images/mainPage/download.svg"}
                        alt="dontWant-icon"
                      />
                    </Flex>
                    <Flex
                      alignItems={"center"}
                      justifyContent={"center"}
                      boxSize={"2.5rem"}
                      bg={"rgba(255, 255, 255, 0.7)"}
                      borderRadius={"50%"}
                      mr={"0.75rem"}
                    >
                      <Image
                        boxSize={"1rem"}
                        onClick={e => {
                          e.stopPropagation()

                          handleCartClick()
                        }}
                        src={"/assets/images/mainPage/AddToCart.svg"}
                        alt="watnt-icon"
                      />
                    </Flex>
                  </Flex>
                  <Flex alignItems={"center"} justifyContent={"flex-start"}>
                    <Image
                      onClick={() => handleImageAction(false)}
                      boxSize={"3.19rem"}
                      mr={"1.13rem"}
                      src={"/assets/images/mainPage/dontWant.png"}
                      alt="dontWant-icon"
                    />
                    <Image
                      onClick={() => handleImageAction(true)}
                      boxSize={"3.19rem"}
                      src={"/assets/images/mainPage/want.png"}
                      alt="watnt-icon"
                    />
                  </Flex>
                </ButtonBox>
              </Box>

              {/* 查看详情 */}
              <DetailTips detailText={detailText} handleViewDetails={handleViewDetails} />
            </Flex>

            {/* 详情 */}
            <Show when={detailList.length > 0}>
              <Details detailList={detailList} footerHeight={footerHeight} />
            </Show>

            <Show when={isLoading}>
              <LoadingContainer>
                <Carousel>
                  <Image
                    src="/assets/images/mainPage/loading_1.png"
                    alt="loading-1-icon"
                    className={currentLoadingImage === 0 ? "active" : ""}
                  />
                  <Image
                    src="/assets/images/mainPage/loading_2.png"
                    alt="loading-2-icon"
                    className={currentLoadingImage === 1 ? "active" : ""}
                  />
                  <Image
                    src="/assets/images/mainPage/loading_3.png"
                    alt="loading-3-icon"
                    className={currentLoadingImage === 2 ? "active" : ""}
                  />
                </Carousel>
              </LoadingContainer>
            </Show>
          </Content>

          <Footer
            ref={footerRef}
            footerBtnText={footerBtnText}
            onButtonClick={() => {
              dispatch(setParams({ loadOriginalImage: allImages[imgIndex].image_url }))
              router.replace(`/upload`)
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

          <Toaster />
        </Wrapper>
      </Container>
    </Portal>
  )
}
const Container = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  background-color: #fff;
  flex-direction: column;
  height: 100%;
  padding-bottom: 0;

  background: transparent;

  z-index: 1000;
`
const Wrapper = styled.div`
  flex-grow: 1;
  display: flex;

  height: 100%;
  width: 100%;

  background: transparent;
`
const Content = styled.div`
  display: flex;
  flex-direction: column;

  position: relative;
  bottom: 0;
  top: 0;

  width: 100%;

  background: transparent;

  overflow: auto;
`
const Prompt = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 7.5rem;
  z-index: 1000;
  transition: transform 0.5s ease;

  opacity: 0;
`

const Bg = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
`
const StyledImg = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 0.75rem;
  border: 0.03rem solid rgba(182, 182, 182, 0.5);
  box-shadow: 0rem 0.11rem 0.89rem 0rem rgba(0, 0, 0, 0.07);
  overflow: hidden;
  z-index: 1;
  transition: transform 0.5s ease;

  // 模糊背景层
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: var(--bg-image);
    background-size: cover;
    background-position: center;
    filter: blur(20px);
    transform: scale(1.1); // 稍微放大一点避免边缘出现空白
  }

  // 实际图片
  img {
    position: relative;
    width: 100%;
    height: 100%;
    object-fit: contain;
    z-index: 2;
  }
`

const NextImg = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 0.75rem;
  width: calc(100% - 1.5rem);
  height: calc(100% - 1.5rem);
  border-radius: 0.75rem;
  border: 0.03rem solid rgba(182, 182, 182, 0.5);
  box-shadow: 0rem 0.11rem 0.89rem 0rem rgba(0, 0, 0, 0.07);
  overflow: hidden;
  transition: transform 0.5s ease;
  transform: scale(0.8);
  z-index: 0;
  opacity: 0;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: var(--bg-image);
    background-size: cover;
    background-position: center;
    filter: blur(20px);
    transform: scale(1.1);
  }

  img {
    position: relative;
    width: 100%;
    height: 100%;
    object-fit: contain;
    z-index: 2;
  }
`
const ButtonBox = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  position: absolute;
  bottom: 2rem;

  z-index: 1;

  width: 100%;
  padding: 0 1.63rem;
  left: 0;
`
const LoadingContainer = styled.div`
  height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;
`
const Carousel = styled.div`
  position: relative;
  height: 7.25rem;
  width: 7.25rem;

  img {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    transition: opacity 0.5s ease;

    &.active {
      opacity: 1;
    }
  }
`

export default ImageViewer
