import { useCallback, useEffect, useRef, useState } from "react"
import styled from "@emotion/styled"
import { keyframes } from "@emotion/react"

import { LeftOutlined } from "@ant-design/icons"
import { Portal, Image, Flex, Text, Show, Box } from "@chakra-ui/react"
import { Loading } from "@components/Loading"
import Footer from "./components/Footer"
import Details from "./components/Details"
import { Alert } from "@components/Alert"

import { fetchImageDetails, imageRate, fetchRecommendImages } from "@lib/request/page"
import { errorCaptureRes, storage } from "@utils/index"

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
}

interface DetailItem {
  label: string
  value: string | string[]
  img: string
}

const ImageViewer: React.FC<ImageViewerProps> = ({ close, initImgUrl, imgList }) => {
  const [imgUrl, setImgUrl] = useState(initImgUrl)
  const [nextImgUrl, setNextImgUrl] = useState(imgList.filter(item => item.image_url !== initImgUrl)[0]?.image_url)
  const [allImages, setAllImages] = useState<ImageItem[]>(imgList) // 所有图片列表

  const [footerHeight, setFooterHeight] = useState<number>(80) // footer的实际高度
  const [isLoading, setIsLoading] = useState(false)

  const [isFirstImgVisible, setIsFirstImgVisible] = useState(true) // 标记 curImg 和 nextImg 目前正在看哪张图

  const [imgIndex, setImgIndex] = useState(0) // 模拟喜欢/不喜欢用的图片下标，

  const [likeCount, setLikeCount] = useState(0) //点赞计数器

  const [detailText, setDetailText] = useState("details") // 底部详情的文本
  const [footerBtnText, setFooterBtnText] = useState("Start To Design") // 底部按钮的文本

  const [detailList, setDetailList] = useState<DetailItem[]>([])

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

  // 下载
  const handleDownload = async () => {
    try {
      // 先获取图片数据
      const response = await fetch(imgUrl)
      const blob = await response.blob()

      // 创建 URL 对象
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.download = "图片.jpg" // 设置下载文件名

      document.body.appendChild(link)
      link.click()

      // 清理
      window.URL.revokeObjectURL(url)
      document.body.removeChild(link)

      Alert.open({
        content: "Download Successfully",
        type: "success",
        customIcon: "/assets/images/mainPage/successIcon.png",
        containerStyle: {
          width: "60vw"
        }
      })
    } catch (error) {
      // 下载失败提示
      Alert.open({
        content: "Failed to download the image, \n Please try again."
      })
    }
  }

  // 加入收藏夹
  const handleAddToCart = () => {}

  // 查看详情
  const handleViewDetails = async () => {
    try {
      setIsLoading(true) // 开始加载
      const [err, res] = await errorCaptureRes(fetchImageDetails, { image_url: imgUrl })
      console.log(res)

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
        user_uuid: userId || Math.random().toString(36).substring(2, 18)
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
      // 切换图片就清空详情
      setDetailList([])
      setDetailText("details")
      setFooterBtnText("Start To Design")

      const [err, res] = await errorCaptureRes(imageRate, {
        image_url: imgUrl,
        // 没有用户id就随机生成一个
        user_uuid: userId || Math.random().toString(36).substring(2, 18),
        action: isLike ? "like" : "dislike"
      })

      if (err || (res && !res?.success)) {
        Alert.open({
          content: err.message ?? res.message
        })

        return
      }

      if (isLike) {
        const newLikeCount = likeCount + 1
        setLikeCount(newLikeCount)

        // 每点赞5次获取新推荐
        if (newLikeCount % 5 === 0) {
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
              setImgUrl(allImages[nextIndex].image_url)
            } else {
              nextImgNode.style.opacity = "0"
              nextImgNode.style.zIndex = "0"
              nextImgNode.style.transform = "scale(0.8)"

              curImgNode.style.zIndex = "1"
              // 更新当前显示的图片
              setNextImgUrl(allImages[nextIndex].image_url)
            }

            // 更新下一张图片的索引
            setImgIndex(nextIndex)

            setIsFirstImgVisible(!isFirstImgVisible)
          }, 500)
        }, 800)
      }
    },
    [imgUrl, userId, isFirstImgVisible, imgIndex, allImages, likeCount]
  )

  // 获取窗口尺寸
  const getWindowConfig = () => {
    let windowWidth = window.innerWidth
    let windowHeight = window.innerHeight

    if (typeof windowWidth !== "number") {
      if (document.compatMode === "CSS1Compat") {
        windowWidth = document.documentElement.clientWidth
        windowHeight = document.documentElement.clientHeight
      } else {
        windowWidth = document.body.clientWidth
        windowHeight = document.body.clientHeight
      }
    }
    return {
      windowWidth: windowWidth,
      windowHeight: windowHeight
    }
  }

  useEffect(() => {
    console.log(getWindowConfig())
  }, [])

  useEffect(() => {
    // 获取底部按钮区的高度，用于占位块
    if (footerRef.current) {
      console.log(footerRef.current.clientHeight, "footer height ")
      setFooterHeight(footerRef.current.clientHeight)
    }
  }, [footerRef.current])

  return (
    <Portal>
      <Container>
        <Wrapper>
          <Show when={isLoading}>
            <Loading />
          </Show>

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
              <Header>
                <BackIcon
                  onClick={e => {
                    e.stopPropagation()

                    close && close()
                  }}
                >
                  <LeftOutlined style={{ fontSize: "1.38rem" }} />
                </BackIcon>
                <Image h={"1rem"} src={"/assets/images/logo-CREAMODA.png"} alt="creamoda-logo" />
              </Header>

              {/* 图片预览区 */}
              <Box w={"100%"} position={"relative"} overflow={"hidden"} p={"0.75rem"} flexGrow={"1"}>
                <StyledImg ref={currentImgRef} src={imgUrl} />
                <NextImg ref={nextImgRef} src={nextImgUrl} />
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
                        onClick={handleDownload}
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
                        onClick={handleAddToCart}
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
                      src={"/assets/images/mainPage/dontWant.svg"}
                      alt="dontWant-icon"
                    />
                    <Image
                      onClick={() => handleImageAction(true)}
                      boxSize={"3.19rem"}
                      src={"/assets/images/mainPage/want.svg"}
                      alt="watnt-icon"
                    />
                  </Flex>
                </ButtonBox>
              </Box>

              {/* 查看详情 */}
              <DetailTip onClick={handleViewDetails}>
                <Text mr={"0.22rem"}>{detailText}</Text>
                <Box h={"1rem"} overflow={"hidden"} position={"relative"}>
                  <Carousel>
                    <Image src={"/assets/images/mainPage/details.png"} alt="detail-icon" />
                    <Image src={"/assets/images/mainPage/details.png"} alt="detail-icon" />
                  </Carousel>
                </Box>
              </DetailTip>
            </Flex>

            {/* 详情 */}
            <Show when={detailList.length > 0}>
              <Details detailList={detailList} footerHeight={footerHeight} />
            </Show>
          </Content>

          <Footer ref={footerRef} footerBtnText={footerBtnText} onButtonClick={() => {}} />
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

const Header = styled.header`
  padding: 1rem;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  flex-shrink: 0;

  height: 2.75rem;
  width: 100%;
`
const BackIcon = styled.div`
  z-index: 1;
  position: absolute;
  width: 1.38rem;
  left: 1rem;
`

const Bg = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
`
const StyledImg = styled(Image)`
  object-fit: cover;
  z-index: 1;
  position: relative;
  transition: transform 0.5s ease;
  width: 100%;
  height: 100%;

  border-radius: 0.75rem;
  border: 0.03rem solid rgba(182, 182, 182, 0.5);
  box-shadow: 0rem 0.11rem 0.89rem 0rem rgba(0, 0, 0, 0.07);
`
const NextImg = styled(Image)`
  position: absolute;
  left: 0.75rem;
  top: 0.75rem;
  z-index: 0;

  object-fit: cover;
  width: calc(100% - 1.5rem);
  height: calc(100% - 1.5rem);

  border-radius: 0.75rem;
  border: 0.03rem solid rgba(182, 182, 182, 0.5);
  box-shadow: 0rem 0.11rem 0.89rem 0rem rgba(0, 0, 0, 0.07);

  transition: transform 0.5s ease;
  transform: scale(0.8);
  z-index: 0;
  opacity: 0;
`
const ButtonBox = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  position: absolute;
  bottom: 1.25rem;

  z-index: 1;

  width: 100%;
  padding: 0 1.63rem;
  left: 0;
`

const DetailTip = styled.section`
  font-size: 0.93rem;
  font-weight: 600;
  line-height: 1rem;

  font-variation-settings: "opsz" auto;
  font-feature-settings: "kern" on;
  color: #171717;

  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  height: 1.38rem;
  flex-shrink: 0;

  padding: 0.38rem 0 1.13rem;
  box-sizing: content-box;

  & img {
    width: 1rem;
  }
`
const rotate360 = keyframes`
  0% {
    transform: translateY(-50%);
  }
  100% {
    transform: translateY(0%);
  }
`

const Carousel = styled.div`
  position: relative;
  animation: ${rotate360} 1.5s infinite linear;
`

export default ImageViewer
