"use client"
import { useState, useEffect, useRef } from "react"
import { Text, Box, Image, Flex } from "@chakra-ui/react"
import Spline from "@splinetool/react-spline/next"
import { Application } from "@splinetool/runtime"

import Header from "@components/Header"
import PrintGeneration from "@img/upload/print-generation.svg"
import Bg from "@img/generate/bg.png"
import Waterfall from "./components/Waterfall"
import { useSearchParams, useRouter } from "next/navigation"
import { workflow2, workflow3, workflow4, workflow5, workflow1_6 } from "./workflow/workflow"
import { getQuery } from "@lib/request/generate"
import { fetchUtilWait } from "@lib/request/generate"
import { errorCaptureRes } from "@utils/index"
import { Alert } from "@components/Alert"
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import { setWorkInfo, setParams, setTaskId, setWork, setGenerateImage } from "@store/features/workSlice"
import { useDispatch, useSelector } from "react-redux"
function Page() {
  const dispatch = useDispatch()
  const { workInfo, work, params, taskId, generateImage } = useSelector((state: any) => state.work)
  const [currentBarValue, setCurrentBarValue] = useState(() => {
    if (generateImage.length === 0 && taskId.length === 0 && work === 0) {
      return 0
    } else if (work !== 0) {
      return 10
    } else {
      return 100 - taskId.length * 12.5
    }
  })
  const [imageList, setImageList] = useState<string[]>(generateImage)
  const [splineComponent, setSplineComponent] = useState<JSX.Element | null>(null)
  const [info, setInfo] = useState({ total_messages: 0, wait_time: 0 })
  const router = useRouter()
  const hasRunRef = useRef(false)
  const [barValue, setBarValue] = useState(() => {
    console.log(generateImage.length, taskId.length)
    if (generateImage.length === 0 && taskId.length === 0) {
      return 10
    } else {
      return 100 - taskId.length * 12.5
    }
  })
  const [taskIDs, setTaskIDs] = useState<string[]>(taskId)
  const fetchData = async () => {
    if (info.total_messages < 3) {
      // 不请求
      return
    }
    const [err, res] = await errorCaptureRes(fetchUtilWait)

    if (err) {
      Alert.open({
        content: err.message
      })
    } else if (res.success) {
      setInfo(pre => ({
        ...pre,
        total_messages: Math.ceil(res.total_messages / 3.5),
        wait_time: Math.ceil(res.wait_time / 60)
      }))
    }
  }

  if (params && Object.keys(params).length === 0 && imageList.length === 0 && taskId.length === 0) {
    router.replace(`/`)
  }
  useEffect(() => {
    if (taskId.length > 0 && imageList.length > 0) {
      hasRunRef.current = true
    }
    if (
      !hasRunRef.current &&
      params &&
      Object.keys(params).length !== 0 &&
      taskId.length === 0 &&
      imageList.length === 0 &&
      work === 0
    ) {
      const { loadOriginalImage, loadPrintingImage, backgroundColor, text, loadFabricImage } = params
      console.log(
        loadPrintingImage,
        backgroundColor,
        text?.trim(),
        loadPrintingImage && backgroundColor === "#FDFCFA" && !text?.trim()
      )
      if (loadPrintingImage && backgroundColor === "#FDFCFA" && !text?.trim()) {
        console.log(222)
        dispatch(setWork(2))
        dispatch(setParams(params))
        workflow2(params).then(newTaskIDs => {
          console.log("workflow")
          if (newTaskIDs) {
            setTaskIDs(newTaskIDs)
            dispatch(setTaskId(newTaskIDs))
            dispatch(setWork(0))
          }
        })
      } else if (!loadPrintingImage && text?.trim() && !loadFabricImage) {
        console.log(3)
        dispatch(setWork(3))
        workflow3(params).then(newTaskIDs => {
          console.log("workflow")
          if (newTaskIDs) {
            setTaskIDs(newTaskIDs)
            dispatch(setTaskId(newTaskIDs))
            dispatch(setWork(0))
          }
        })
      } else if (loadPrintingImage && text?.trim() && !loadFabricImage) {
        console.log(4)
        dispatch(setWork(4))
        workflow4(params).then(newTaskIDs => {
          console.log("workflow")
          if (newTaskIDs) {
            setTaskIDs(newTaskIDs)
            dispatch(setTaskId(newTaskIDs))

            dispatch(setWork(0))
          }
        })
      } else if (loadPrintingImage && text?.trim() && loadFabricImage) {
        console.log(555)
        dispatch(setWork(5))
        workflow5(params).then(newTaskIDs => {
          console.log("workflow")
          if (newTaskIDs) {
            setTaskIDs(newTaskIDs)
            dispatch(setTaskId(newTaskIDs))

            dispatch(setWork(0))
          }
        })
      } else {
        console.log(111666)
        dispatch(setWork(1))
        workflow1_6(params).then(newTaskIDs => {
          console.log("workflow")
          if (newTaskIDs) {
            setTaskIDs(newTaskIDs)
            dispatch(setTaskId(newTaskIDs))
            dispatch(setWork(0))
          }
        })
      }
      hasRunRef.current = true
    }
  }, [params])

  useEffect(() => {
    const loadSpline = async () => {
      const component = await Spline({
        scene: "https://prod.spline.design/OeaC0pc8AQW4AwPQ/scene.splinecode",
        onLoad: (app: Application) => {
          app.setZoom(1.5) // 缩小视角，数字越小视角越远
        }
      })
      setSplineComponent(component)
    }
    loadSpline()
    fetchData()
  }, [])
  useEffect(() => {
    if (taskId.length === 6) {
      setTaskIDs(taskId)
    }
  }, [taskId])
  useEffect(() => {
    if (currentBarValue === 100) {
      const imageListParam = encodeURIComponent(JSON.stringify(generateImage))
      const newImage = params.loadOriginalImage
      dispatch(setGenerateImage([]))
      dispatch(setWork(0))
      dispatch(setTaskId([]))
      router.replace(`/generate-result?loadOriginalImage=${newImage}&imageList=${imageListParam}`)
    }
  }, [currentBarValue])

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
        setTaskIDs(prevIDs => prevIDs.filter(id => id !== taskID))
      }
    } catch (err) {
      setTaskIDs(prevIDs => prevIDs.filter(id => id !== taskID))
    }
  }
  useEffect(() => {
    const interval = setInterval(() => {
      if (taskIDs.length > 0) {
        taskIDs.forEach(taskID => {
          getImage(taskID)
        })
      } else {
        fetchData()
      }
    }, 5000)
    if (taskIDs.length > 0 || generateImage.length > 0) {
      setBarValue(100 - taskIDs.length * 9.5)
    }
    dispatch(setGenerateImage(imageList))
    dispatch(setTaskId(taskIDs))
    return () => {
      console.log("Cleaning up interval")
      clearInterval(interval)
    }
  }, [taskIDs])

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentBarValue < barValue) {
        setCurrentBarValue(prev => Math.min(prev + 1, barValue))
      }
    }, 300)
    return () => clearInterval(interval)
  }, [barValue])

  return (
    <Box h="100vh" position={"relative"}>
      <Box
        position={"absolute"}
        height="25rem"
        zIndex={0}
        borderRadius={"0rem  0rem  1.13rem  1.13rem"}
        pointerEvents="none"
        overflow={"hidden"}
        width={"full"}
      >
        {splineComponent}
        <Image
          src={Bg.src}
          position={"absolute"}
          zIndex={0}
          height="25rem"
          objectFit="cover"
          w={"full"}
          top={0}
        ></Image>
      </Box>
      <Box pt={4}></Box>
      <Header noTitle={true}></Header>
      <Flex
        justifyContent={"center"}
        alignItems={"center"}
        mt={"3.2rem"}
        position={"relative"}
        flexDirection={"column"}
      >
        <Box boxSize={"11rem"}>
          <svg width="0" height="0">
            <defs>
              <linearGradient id="gradient" x1="150%" y1="50%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#FF9090", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "#FE4BA3", stopOpacity: 1 }} />
              </linearGradient>
            </defs>
          </svg>
          <CircularProgressbarWithChildren
            styles={buildStyles({
              pathColor: "url(#gradient)", // 使用SVG渐变色
              strokeLinecap: "round",
              trailColor: "transparent"
            })}
            value={currentBarValue}
          >
            <Flex
              zIndex={0}
              bgColor={"transparent"}
              width="8.13rem"
              height="8.13rem"
              background="rgba(255,255,255,0.1)"
              boxShadow="0rem 0rem 0.31rem 0rem rgba(255,255,255,0.5), inset 0rem 0rem 0.47rem 0rem rgba(255,255,255,0.8)"
              border="0.06rem solid #fffeff"
              justifyContent={"center"}
              alignItems={"center"}
              borderRadius="full"
              m={"0.1rem"}
            >
              <Image
                boxSize={"7.13rem"}
                borderRadius="full"
                src={params?.loadOriginalImage}
                border="0.06rem solid #fffeff"
              ></Image>
            </Flex>
          </CircularProgressbarWithChildren>
        </Box>
        <Text fontWeight="600" fontSize="1.25rem" color="#404040" mt={"1.5rem"}>
          {info?.total_messages ? `Estimated wait ${info?.wait_time ?? "--"} mins` : currentBarValue + "%"}
        </Text>
        <Text font-weight="400" font-size="0.88rem" color=" #404040" mt={"0.44rem"}>
          {!info?.total_messages ? "Generating for you..." : "Queuing to generate preview..."}
        </Text>
        <Text font-weight="400" font-size="0.88rem" color=" #404040">
          {!info?.total_messages ? "You can check results anytime in history" : "people before you"}
        </Text>
      </Flex>
      <Text fontWeight="500" fontSize="1rem" color="#171717" mt={"4.5rem"} px={"1rem"}>
        While you wait
      </Text>
      <Flex px={"1rem"}>
        <Text fontWeight="500" fontSize="1rem" color="#171717">
          Check out our amazing creations!
        </Text>
        <Image src={PrintGeneration.src} w={"0.88rem"} h="0.88rem" ml={"0.3rem"}></Image>
      </Flex>
      <Box overflowY="auto" maxH="calc(100vh - 305px)" px={"1rem"} mt={"0.75rem"}>
        <Waterfall />
      </Box>
    </Box>
  )
}

export default Page
