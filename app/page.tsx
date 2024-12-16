"use client"

import { useRef, useEffect, useState } from "react"
import styled from "@emotion/styled"
import { useDispatch, useSelector } from "react-redux"

import { Box, Flex, Image, Button, For } from "@chakra-ui/react"
import { useRouter } from "next/navigation"

import { getQuery } from "@lib/request/generate"
import { setParams, setTaskId, setWork, setGenerateImage } from "@store/features/workSlice"

import Waterfall from "./components/Waterfall"
import GenStatus from "./components/GenStatus"
import ErrorModal from "./components/ErrorModal"
// header 右侧按钮
const headerIconList = [
  {
    key: "album",
    link: "/album",
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
  const [open, setOpen] = useState(false)

  const router = useRouter()
  const dispatch = useDispatch()
  const { workInfo, work, taskId, params, generateImage } = useSelector((state: any) => state.work)
  const [currentBarValue, setCurrentBarValue] = useState(() => {
    if (work !== 0) {
      return 10
    } else {
      return 100 - taskId.length * 12.5
    }
  })
  const [barValue, setBarValue] = useState(() => {
    if (work !== 0) {
      return 10
    } else {
      return 100 - taskId.length * 12.5
    }
  })
  const [isVisible, setIsVisible] = useState(() => {
    if (work !== 0 || generateImage.length > 0) {
      return true
    } else {
      return false
    }
  })
  console.log(work, taskId, barValue)
  const [viewDetail, setViewDetail] = useState(false) // 查看大图
  const [imageList, setImageList] = useState<string[]>(generateImage)
  const containerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null) // header ref

  const [taskIDs, setTaskIDs] = useState<string[]>(taskId)
  // 页面跳转
  const handleJump = (link: string) => {
    // 没有登陆的话去往登陆页面
    router.push(!localStorage.getItem("user_id") ? "/login" : link)
  }

  // header 在页面滚动之后设置白色背景色
  useEffect(() => {
    if (headerRef.current && containerRef.current) {
      const el = headerRef.current

      const handleScroll = () => {
        if ((containerRef.current?.scrollTop ?? 0) > 0) {
          el.style.backgroundColor = "#fff"
        } else if ((containerRef.current?.scrollTop ?? 0) === 0) {
          el.style.backgroundColor = "transparent"
        }
      }
      containerRef.current.addEventListener("scroll", handleScroll)

      return () => {
        containerRef.current?.removeEventListener("scroll", handleScroll)
      }
    }
  }, [headerRef.current, containerRef.current])

  const getImage = async (taskID: string) => {
    try {
      const resultData: any = await getQuery({ taskID })
      const { result, success, message } = resultData || {}

      if (success) {
        setImageList(pre => [...pre, result.res])
        setTaskIDs(prevIDs => prevIDs.filter(id => id !== taskID))
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
  useEffect(() => {
    const interval = setInterval(() => {
      if (taskIDs.length > 0) {
        setIsVisible(true)
        taskIDs.forEach((taskID: string) => {
          getImage(taskID)
        })
      } else {
        clearInterval(interval)
        console.log("All tasks complete or no tasks left.")
      }
    }, 5000)
    if (work === 0) {
      setBarValue(100 - taskIDs.length * 9.5)
      dispatch(setGenerateImage(imageList))
      dispatch(setTaskId(taskIDs))
    }
    return () => {
      clearInterval(interval)
      console.log("Cleaning up interval")
    }
  }, [taskIDs])

  useEffect(() => {
    if (taskId.length === 6) {
      setTaskIDs(taskId)
    }
  }, [taskId])

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentBarValue < barValue) {
        setCurrentBarValue(prev => Math.min(prev + 1, barValue))
      } else {
        clearInterval(interval)
      }
    }, 200)

    return () => clearInterval(interval)
  }, [barValue])

  return (
    <Container ref={containerRef}>
      <BackgroundBox>
        <Image src="/assets/images/mainPage/bg.png" alt="bg-img" />
      </BackgroundBox>
      <>
        {/* Header Section */}
        <Flex
          ref={headerRef}
          as="header"
          justify="space-between"
          align="center"
          h={"2.75rem"}
          px={"1rem"}
          mb={"1.75rem"}
          position="sticky"
          top={0}
          bg="white"
          zIndex="100"
          mt="-0.2rem"
          background={"transparent"}
          transition={"background-color 0.3s"}
        >
          <Image h={"1rem"} src={"/assets/images/logo-CREAMODA.png"} alt="creamoda-logo" />

          <Flex gap="0.5rem">
            <For each={headerIconList}>
              {(item, index: number): React.ReactNode => {
                return (
                  <Image
                    onClick={() => handleJump(item.link)}
                    key={item.key}
                    src={item.imgUrl}
                    alt={`${item.key}-icon`}
                    boxSize="1.38rem"
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
            w={"90vw"}
            h={"2.75rem"}
            border={"0.03rem solid rgba(255,0,0,0.1)"}
            colorScheme="blackAlpha"
            bgColor="#EE3939"
            color="white"
            py="1.75rem"
            fontSize="1.3rem"
            letterSpacing="0.02rem"
            mt={1}
            borderRadius={"2.5rem"}
            onClick={() => {
              console.log(taskId.length, work, currentBarValue)
              if (taskId.length !== 0 || work !== 0 || currentBarValue !== 100) {
                setOpen(true)
                return
              } else {
                dispatch(setGenerateImage([]))
                dispatch(setWork(0))
                dispatch(setParams({}))
                dispatch(setTaskId([]))
                router.replace("/upload")
              }
            }}
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
          <Title>Printed dress</Title>
          <SubTitle>Quickly generate hot-selling products</SubTitle>

          {/* Waterfall Content */}
          <Box
            overflowY="auto"
            onClick={e => {
              if (taskId.length !== 0 || work !== 0 || currentBarValue !== 100) {
                setOpen(true)
                setViewDetail(false)
                return
              } else {
                setViewDetail(true)
                dispatch(setGenerateImage([]))
                dispatch(setWork(0))
                dispatch(setTaskId([]))
              }
            }}
          >
            <Waterfall viewDetail={viewDetail} setViewDetail={setViewDetail} />
          </Box>

          {/* Image Guide Modal */}
          {/* <ImageGuideModal isOpen={isOpen} onClose={onClose} /> */}
        </MainSection>
      </>

      {isVisible && (
        <GenStatus barValue={currentBarValue} isVisible={isVisible} generateImage={generateImage}></GenStatus>
      )}
      <ErrorModal open={open} setOpen={setOpen}></ErrorModal>
    </Container>
  )
}

const Container = styled.div`
  position: relative;
  height: 100vh;
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`

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
  padding: 1rem 1rem 0rem 1rem;
  background: linear-gradient(to bottom, #faf1f2, #fff 30vh, #fff);
  border: 0.09rem solid #fff;
  border-radius: 1.13rem;
  margin-top: 1.81rem;
  border-top-width: 0.045rem;
  margin-bottom: -1.25rem;
`
const Title = styled.div`
  font-weight: 600;
  font-size: 1rem;
  color: #171717;
  text-align: left;
  font-style: normal;
`
const SubTitle = styled.div`
  font-weight: 400;
  font-size: 0.81rem;
  color: #666666;
  text-align: left;
  font-style: normal;
  margin-bottom: 12px;
`

export default Dashboard
