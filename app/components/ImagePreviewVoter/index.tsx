import { useEffect, useRef, useState } from "react"
import ReactDOM from "react-dom"
import styled from "@emotion/styled"
import { keyframes } from "@emotion/react"

import { LeftOutlined } from "@ant-design/icons"
import { Portal, Image, Flex, Text, For, Button, Show, Box } from "@chakra-ui/react"

interface ImageViewerProps {
  close: () => void
  initImgUrl: string
}
const imageList = [
  "https://aimoda-ai.oss-us-east-1.aliyuncs.com/2a84acb8f69ac76c15f5c362ff0c7c7857b5cc236b6aad382c7e537a9f85b402?x-oss-process=image/format,jpg",
  "https://aimoda-ai.oss-us-east-1.aliyuncs.com/4c3a929276ed13d3842e117756c7ba893bbefe6f8ce0497c267b0edf3a31600b?x-oss-process=image/format,jpg",
  "https://aimoda-ai.oss-us-east-1.aliyuncs.com/1f42dcc517a499c5fa6d0fa9f5131017e5726d7dd9b1cd698077e61e453a283a?x-oss-process=image/format,jpg",
  "https://aimoda-ai.oss-us-east-1.aliyuncs.com/c569387de6ad3d3befb0e481f989dd8e9058ee964218ddac49bacbfc10cac4cd?x-oss-process=image/format,jpg",
  "https://aimoda-ai.oss-us-east-1.aliyuncs.com/f9d9bb8a6a68fd1cb43c924fe66dcb2a18f119818900ffb8955ce4397868717e?x-oss-process=image/format,jpg",
  "https://aimoda-ai.oss-us-east-1.aliyuncs.com/9904cf1444351471237b22c4ac94c24f3c471b5bd01206842b1e441477eb00a1?x-oss-process=image/format,jpg",
  "https://aimoda-ai.oss-us-east-1.aliyuncs.com/d07a997962030ffd8bcbbb19d803e966f71a7dc1c36a05b5561d796c7e9df21e?x-oss-process=image/format,jpg",
  "https://aimoda-ai.oss-us-east-1.aliyuncs.com/ac4487c5d7e8c65c48100b32b2b3a7e19bb1b136a8db31d5fd4988834ad5826c?x-oss-process=image/format,jpg",
  "https://aimoda-ai.oss-us-east-1.aliyuncs.com/c2bb048fef5e5eba5fb8c0c5116c0fed5158c7b5e2c5e5ea2e68a1ad2214aadf?x-oss-process=image/format,jpg",
  "https://aimoda-ai.oss-us-east-1.aliyuncs.com/e824feb21c8d94d9df039992329da0bc642da97d070dc3f782f182abf93cc14f?x-oss-process=image/format,jpg"
]

const detailList = [
  {
    label: "Culture",
    img: "/assets/images/mainPage/Culture.png",
    value:
      "nspired by naturalism,this dress blends tropical botanical elements with modern design,embodying harmony between humans and nature,perfect for casual vacations"
  },
  {
    label: "Material",
    img: "/assets/images/mainPage/Material.png",
    value: ["Lightweight and breathable", "Soft cotton"]
  },
  {
    label: "Trend Style",
    img: "/assets/images/mainPage/Trend_Style.png",
    value: ["Botanical print", "Resort wear", "Vintage elegance", "Natural simplicity"]
  },
  {
    label: "Silhoutte",
    img: "/assets/images/mainPage/Silhoutte.png",
    value:
      "nspired by naturalism,this dress blends tropical botanical elements with modern design,embodying harmony between humans and nature,perfect for casual vacations"
  }
]

const ImageViewer: React.FC<ImageViewerProps> = ({ close, initImgUrl }) => {
  const [imgUrl, setImgUrl] = useState(initImgUrl)
  const [footerHeight, setFooterHeight] = useState<number>(80) // footer的实际高度
  const [imgBoxHeight, setImgBoxHeight] = useState<number>(500) // 预览的图片的容器高度，由宽度以比例3:4计算获得

  const [isFirstImgVisible, setIsFirstImgVisible] = useState(true) // 标记 curImg 和 nextImg 目前正在看哪张图

  const [imgIndex, setImgIndex] = useState(0) // 模拟喜欢/不喜欢用的图片下标，

  const [detailText, setDetailText] = useState("details")
  const [footerBtnText, setFooterBtnText] = useState("Start To Design")

  // refs begins
  const imgBoxRef = useRef<null | HTMLDivElement>(null)
  const currentImgRef = useRef<null | HTMLImageElement>(null)
  const nextImgRef = useRef<null | HTMLImageElement>(null)

  // 底部footer区块
  const footerRef = useRef<null | HTMLDivElement>(null)

  // 喜欢、不喜欢的prompt
  const dislikeRef = useRef<null | HTMLDivElement>(null)
  const liekRef = useRef<null | HTMLDivElement>(null)
  // refs ends

  // 下载
  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = imgUrl
    link.download = "" // 有些浏览器不允许设置下载名称，可以留空或尝试设置文件名
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // 加入收藏夹
  const handleAddToCart = () => {}

  const handleDislike = async () => {
    if (dislikeRef.current && currentImgRef.current && nextImgRef.current) {
      const promptNode = dislikeRef.current
      const curImgNode = currentImgRef.current
      const nextImgNode = nextImgRef.current

      promptNode.style.opacity = "1"
      promptNode.style.transform = "translate(-50%, -50px) scale(1.2)"
      promptNode.style.transition = "transform 0.5s ease"

      setTimeout(() => {
        promptNode.style.opacity = "0"
        promptNode.style.transform = "translateX(-50%)"

        if (isFirstImgVisible) {
          curImgNode.style.zIndex = "1"
          curImgNode.style.transform = "translateX(-110%)"

          nextImgNode.style.opacity = "1"
          nextImgNode.style.transform = "unset"
        } else {
          nextImgNode.style.zIndex = "1"
          nextImgNode.style.transform = "translateX(-110%)"

          curImgNode.style.opacity = "1"
          curImgNode.style.transform = "unset"
        }

        setTimeout(() => {
          if (isFirstImgVisible) {
            curImgNode.style.opacity = "0"
            curImgNode.style.zIndex = "0"
            curImgNode.style.transform = "unset"

            nextImgNode.style.zIndex = "1"
          } else {
            nextImgNode.style.opacity = "0"
            nextImgNode.style.zIndex = "0"
            nextImgNode.style.transform = "unset"

            curImgNode.style.zIndex = "1"
          }
          setIsFirstImgVisible(!isFirstImgVisible)
        }, 500)
      }, 800)
    }
  }

  const handleLike = () => {
    if (liekRef.current && currentImgRef.current && nextImgRef.current) {
      const promptNode = liekRef.current
      const curImgNode = currentImgRef.current
      const nextImgNode = nextImgRef.current

      promptNode.style.opacity = "1"
      promptNode.style.transform = "translate(-50%, -50px) scale(1.2)"
      promptNode.style.transition = "transform 0.5s ease"

      setTimeout(() => {
        promptNode.style.opacity = "0"
        promptNode.style.transform = "translateX(-50%)"

        if (isFirstImgVisible) {
          curImgNode.style.zIndex = "1"
          curImgNode.style.transform = "translateX(110%)"

          nextImgNode.style.opacity = "1"
          nextImgNode.style.transform = "unset"
        } else {
          nextImgNode.style.zIndex = "1"
          nextImgNode.style.transform = "translateX(110%)"

          curImgNode.style.opacity = "1"
          curImgNode.style.transform = "unset"
        }

        setTimeout(() => {
          if (isFirstImgVisible) {
            curImgNode.style.opacity = "0"
            curImgNode.style.zIndex = "0"
            curImgNode.style.transform = "unset"

            nextImgNode.style.zIndex = "1"
          } else {
            nextImgNode.style.opacity = "0"
            nextImgNode.style.zIndex = "0"
            nextImgNode.style.transform = "unset"

            curImgNode.style.zIndex = "1"
          }
          setIsFirstImgVisible(!isFirstImgVisible)
        }, 500)
      }, 800)
    }
  }

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

  useEffect(() => {
    if (imgBoxRef.current) {
      const boxWidth = imgBoxRef.current.clientWidth

      setImgBoxHeight((boxWidth / 3) * 4) // 使用3*4布局
    }
  }, [])

  return (
    <Portal>
      <Container>
        <Wrapper>
          <Bg />

          <Content>
            {/* 喜欢/不喜欢的提示元素 */}
            <Prompt ref={dislikeRef}>
              <Image boxSize={"2.5rem"} src={"/assets/images/mainPage/dislikePrompt.svg"} alt="dislike-prompt" />
            </Prompt>
            <Prompt ref={liekRef}>
              <Image boxSize={"2.5rem"} src={"/assets/images/mainPage/likePrompt.svg"} alt="watnt-prompt" />
            </Prompt>

            <Header>
              <BackIcon
                onClick={e => {
                  e.stopPropagation()

                  close && close()
                }}
              >
                <LeftOutlined style={{ fontSize: "1.38rem" }} />
              </BackIcon>
              <Text fontSize="1.1rem" fontWeight="bold" letterSpacing="0rem" textAlign="center">
                CREAMODA
              </Text>
            </Header>

            <Flex alignItems={"center"} justifyContent={"center"} p={"0.75rem"} position={"relative"} flexGrow={"1"}>
              <Box
                ref={imgBoxRef}
                w={"100%"}
                h={imgBoxHeight + "px"}
                borderRadius={"0.5rem"}
                border={"0.03rem solid rgba(182, 182, 182, 0.5)"}
                boxShadow={"0rem 0.11rem 0.89rem 0rem rgba(0, 0, 0, 0.07)"}
                position={"relative"}
                overflow={"hidden"}
              >
                <StyledImg ref={currentImgRef} src={imgUrl} />
                <NextImg ref={nextImgRef} src={imageList[imgIndex]}></NextImg>
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
                      onClick={handleDislike}
                      boxSize={"3.19rem"}
                      mr={"1.13rem"}
                      src={"/assets/images/mainPage/dontWant.svg"}
                      alt="dontWant-icon"
                    />
                    <Image
                      onClick={handleLike}
                      boxSize={"3.19rem"}
                      src={"/assets/images/mainPage/want.svg"}
                      alt="watnt-icon"
                    />
                  </Flex>
                </ButtonBox>
              </Box>
            </Flex>

            <DetailTip>
              <Text mr={"0.22rem"}>{detailText}</Text>
              <Box h={"1rem"} overflow={"hidden"} position={"relative"}>
                <Carousel>
                  <Image src={"/assets/images/mainPage/details.png"} alt="detail-icon" />
                  <Image src={"/assets/images/mainPage/details.png"} alt="detail-icon" />
                </Carousel>
              </Box>
            </DetailTip>

            {/* <Details>
              <For each={detailList}>
                {(detail, index) => (
                  <Detail key={detail.label}>
                    <Flex alignItems={"center"} justifyContent={"flex-start"}>
                      <Image boxSize={"1.44rem"} src={detail.img} />
                      <Text color={"#171717"} fontWeight={"400"} fontSize={"0.75rem"}>
                        {detail.label}
                      </Text>
                    </Flex>
                    <Flex alignItems={"flex-start"} flexFlow={"row wrap"}>
                      <Show
                        when={Array.isArray(detail.value) && detail.value.length > 0}
                        fallback={
                          <Text fontSize={"0.75rem"} color={"#171717"} fontWeight={"400"}>
                            {detail.value}
                          </Text>
                        }
                      >
                        <For each={detail.value as string[]}>
                          {item => {
                            return (
                              <DetailItem>
                                <Text fontSize={"0.75rem"} fontWeight={"400"} color={"#ee3939"}>
                                  {item}
                                </Text>
                              </DetailItem>
                            )
                          }}
                        </For>
                      </Show>
                    </Flex>
                  </Detail>
                )}
              </For>
            </Details> */}

            <PlaceHolder height={footerHeight} />
          </Content>

          <Footer ref={footerRef}>
            <StartBtnBox>
              <Button width={"100%"} h={"2.5rem"} bgColor="#EE3939" borderRadius="1.25rem" onClick={() => {}}>
                <Text fontWeight={"700"} lineHeight={"1.44rem"} color="#fff" fontSize="1rem">
                  {footerBtnText}
                </Text>
                <Image src="/assets/images/mainPage/star.svg" alt="Profile" boxSize="12pt" cursor="pointer" />
              </Button>
            </StartBtnBox>
          </Footer>
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
  z-index: 1;
  position: relative;
  transition: transform 0.5s ease;
`
const NextImg = styled(Image)`
  position: absolute;
  top: 0;
  z-index: 0;

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
  padding: 0 0.88rem;
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

  height: 2.5rem;
  flex-shrink: 0;

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

const Details = styled.section`
  z-index: 1;

  padding: 0 1.33rem;
`
const Detail = styled.div`
  margin-bottom: 1.11rem;
`
const DetailItem = styled.div`
  background: #ffffff;
  border-radius: 1.11rem;
  border: 0.03rem solid #ee3939;
  padding: 0.39rem 0.56rem;
  margin-right: 0.75rem;
  margin-bottom: 0.44rem;
`
interface PlaceHolderType {
  height: number
}
const PlaceHolder = styled.div<PlaceHolderType>`
  margin-top: ${props => props.height + 16 + "px"};
  flex-shrink: 0;
`

const Footer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  padding: 0.56rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0rem -0.06rem 0.28rem 0rem rgba(214, 214, 214, 0.5);
  border-radius: 0.75rem 0.75rem 0rem 0rem;
  z-index: 2;
`
const StartBtnBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1.53rem;
  width: 100%;

  & > button {
    position: relative;
  }
`
const Blending = styled.div`
  position: absolute;
  bottom: 0;
  width: 75%;
  left: 50%;
  transform: translateX(-50%);
`

export default ImageViewer
