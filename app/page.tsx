"use client"

import { useRef, useEffect, useState } from "react"
import { Container, Box, Flex, Link, Image, Button, For, Text } from "@chakra-ui/react"
import styled from "@emotion/styled"

import Waterfall from "./components/Waterfall"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { getQuery } from "@lib/request/generate"
import { fetchUtilWait } from "@lib/request/generate"
import { setWorkInfo, setParams, setTaskId, setWork, setGenerateImage } from "@store/features/workSlice"
// header 右侧按钮
const headerIconList = [
  {
    key: "favorites",
    link: "/favorites",
    imgUrl: "/assets/images/mainPage/like.svg"
  },
  {
    key: "history",
    link: "/history",
    imgUrl: "/assets/images/mainPage/history.svg"
  },
  {
    key: "profile",
    link: "/profile",
    imgUrl: "/assets/images/mainPage/homepage.svg"
  }
]

function Dashboard() {
  // const { onOpen, onClose } = useDisclosure();
  const [barValue, setBarValue] = useState(0)

  const router = useRouter()
  const dispatch = useDispatch()
  const { workInfo, work, taskId, params, generateImage } = useSelector((state: any) => state.work)
  console.log("home", workInfo, work, taskId, params, generateImage)
  const headerRef = useRef<HTMLDivElement>(null) // 容器ref
  const [imageList, setImageList] = useState<string[]>([])
  // 页面跳转
  const handleJump = (link: string) => {
    // 没有登陆的话去往登陆页面
    router.push(!localStorage.getItem("user_id") ? "/login" : link)
  }

  // header 在页面滚动之后设置白色背景色
  useEffect(() => {
    if (headerRef.current) {
      const el = headerRef.current

      const handleScroll = () => {
        if (window.scrollY > 0) {
          el.style.backgroundColor = "#fff"
        } else if (window.scrollY === 0) {
          el.style.backgroundColor = "transparent"
        }
      }
      window.addEventListener("scroll", handleScroll)

      return () => {
        window.removeEventListener("scroll", handleScroll)
      }
    }
  }, [headerRef.current])

  const getImage = async (taskID: string) => {
    try {
      const resultData: any = await getQuery({ taskID })
      const { result, success, message } = resultData || {}

      if (success) {
        setImageList(pre => [...pre, result.res])
        const newImage = result.res
        const updatedImageList = generateImage.some((item: string) => item === newImage)
          ? generateImage
          : [...generateImage, newImage]

        dispatch(setGenerateImage(updatedImageList)) // 直接传递更新后的列表
        dispatch(setTaskId(taskId.filter((id: string) => id !== taskID)))
        setBarValue(pre => (Math.ceil(pre + 16.6) >= 100 ? 100 : Math.ceil(pre + 16.6)))
      } else {
        console.log(`Task ${taskID} still in progress`)
      }
      if (message !== "Task is running") {
        dispatch(setTaskId(taskId.filter((id: string) => id !== taskID)))
      }
    } catch (err) {
      dispatch(setTaskId(taskId.filter((id: string) => id !== taskID)))
    }
  }
  console.log(taskId)
  useEffect(() => {
    const interval = setInterval(() => {
      if (taskId.length > 0) {
        taskId.forEach((taskID: string) => {
          getImage(taskID)
        })
      } else {
        console.log("All tasks complete or no tasks left.")
      }
    }, 5000)

    return () => {
      console.log("Cleaning up interval")
      clearInterval(interval)
    }
  }, [taskId])

  useEffect(() => {
    if (barValue > 0) {
      console.log(1)
    } else {
    }

    console.log("barValue:", barValue)

    // 清除之前的 Toast
    return () => {}
  }, [barValue])

  useEffect(() => {
    if (taskId.length === 0 && imageList.length > 0) {
      console.log("generateImage", generateImage)

      const imageListParam = encodeURIComponent(JSON.stringify(imageList))
      // router.replace(`/generate-result?loadOriginalImage=${params.loadOriginalImage}&imageList=${imageListParam}`)
    }
  }, [taskId, imageList, router])

  return (
    <Container p={0} position={"relative"}>
      <BackgroundBox>
        <Image src="/assets/images/mainPage/bg.png" alt="bg-img" />
      </BackgroundBox>
      <Box>
        {/* Header Section */}
        <Flex
          ref={headerRef}
          as="header"
          justify="space-between"
          align="center"
          h={"8vh"}
          px={"1rem"}
          mb={"3rem"}
          position="sticky"
          top={0}
          bg="white"
          zIndex="100"
          mt="-0.2rem"
          background={"transparent"}
          transition={"background-color 0.3s"}
        >
          <Image w={"150px"} src={"/assets/images/logo-CREAMODA.png"} alt="creamoda-logo" />

          <Flex gap="0.5rem">
            <For each={headerIconList}>
              {(item, index: number): React.ReactNode => {
                return (
                  <Image
                    onClick={() => handleJump(item.link)}
                    key={item.key}
                    src={item.imgUrl}
                    alt={`${item.key}-icon`}
                    boxSize="22pt"
                    cursor="pointer"
                  />
                )
              }}
            </For>
          </Flex>
        </Flex>

        {/* Upload Button */}
        <StartBtnBox>
          <Button
            width={"90vw"}
            colorScheme="blackAlpha"
            border={"3px solid #f2d9da"}
            bgColor="#EE3939"
            color="white"
            py="1.75rem"
            fontSize="1.3rem"
            letterSpacing="0.02rem"
            onClick={() => {
              router.push("/upload")
            }}
            mt={1}
            mb={4}
            borderRadius="40px"
          >
            Start To Design
            <Image src="/assets/images/mainPage/star.svg" alt="Profile" boxSize="12pt" cursor="pointer" />
            <Blending>
              <Image src="/assets/images/mainPage/blending.png" alt="Profile" cursor="pointer" />
            </Blending>
          </Button>
        </StartBtnBox>

        {/* 图片区块 */}
        <MainSection>
          {/* Subtitle */}
          <Title>Fashion Trend</Title>
          <SubTitle>Quickly generate hot-selling products</SubTitle>

          {/* Waterfall Content */}
          <Box overflowY="auto">
            <Waterfall />
          </Box>

          {/* Image Guide Modal */}
          {/* <ImageGuideModal isOpen={isOpen} onClose={onClose} /> */}
        </MainSection>
      </Box>
      {/* <Flex
        position={"sticky"}
        boxShadow="0rem 0.13rem 0.5rem 0rem rgba(17,17,17,0.12)"
        bottom={"2rem"}
        left={"50%"}
        width={"11.53rem"}
        h={"2.5rem"}
        background="#FFFFFF"
        transform={"translateX(-50%)"}
        borderRadius="0.5rem"
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Box>1</Box>
        <Text fontFamily="PingFangSC, PingFang SC" fontWeight="400" fontSize="0.88rem" color="#171717">
          Generating 26%
        </Text>
        <Image></Image>
      </Flex> */}
    </Container>
  )
}

const BackgroundBox = styled.div`
  position: absolute;
  top: 0;
  z-index: -1;
`

const StartBtnBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

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

const MainSection = styled.section`
  padding: 1rem;
  background: linear-gradient(to bottom, #faf1f2, #fff 30vh, #fff);
  border: 2px solid #fff;
  border-radius: 16pt;
  margin-top: 24px;
  border-top-width: 1px;
`
const Title = styled.div`
  font-weight: 600;
  font-size: 1.3rem;
  color: #171717;
  text-align: left;
  font-style: normal;
`
const SubTitle = styled.div`
  font-weight: 400;
  font-size: 1rem;
  color: #666666;
  text-align: left;
  font-style: normal;
  margin-bottom: 12px;
`

export default Dashboard
