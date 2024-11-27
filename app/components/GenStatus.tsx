import { forwardRef, useState, useEffect } from "react"
import { Box, Flex, Text, Image } from "@chakra-ui/react"
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import Back from "@img/back.svg"
import Finish from "@img/finish.png"
import { useRouter } from "next/navigation"
import { storage } from "@utils/index"
import { useDispatch, useSelector } from "react-redux"
import { setWorkInfo, setParams, setTaskId, setWork, setGenerateImage } from "@store/features/workSlice"
interface MessageBoxProps {
  barValue: number
  isVisible: boolean
  generateImage: any[]
}

const MessageBox = forwardRef<HTMLDivElement, MessageBoxProps>(({ barValue, isVisible, generateImage }, ref) => {
  const router = useRouter()
  const { params } = useSelector((state: any) => state.work)
  const dispatch = useDispatch()
  return (
    <Box
      position={"sticky"}
      boxShadow="0rem 0.13rem 0.5rem 0rem rgba(17,17,17,0.12)"
      bottom={"2rem"}
      left={"50%"}
      width={"11.53rem"}
      h={"2.5rem"}
      background="#FFFFFF"
      transform={"translateX(-50%)"}
      borderRadius="0.5rem"
      data-state={isVisible ? "open" : "closed"}
      _open={{
        animation: "fade-in 300ms ease-out"
      }}
      _closed={{
        animation: "fadeOut 300ms ease-in"
      }}
    >
      <Flex justifyContent={"space-between"} alignItems={"center"} h={"2.5rem"}>
        {barValue !== 100 && (
          <>
            <Box boxSize={"1.5rem"} ml={"0.47rem"}>
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
                  trailColor: "#eaeceb"
                })}
                strokeWidth={19}
                value={barValue}
              ></CircularProgressbarWithChildren>
            </Box>
            <Text fontWeight="400" fontSize="0.88rem" color="#171717">
              Generating {barValue}%
            </Text>
            <Image
              src={Back.src}
              boxSize={"1.5rem"}
              onClick={() => {
                router.replace(`/generate`)
              }}
            ></Image>
          </>
        )}
        {barValue === 100 && (
          <>
            <Image ml="0.5rem" src={Finish.src} boxSize={"2.1rem"}></Image>
            <Text ml={"0.5rem"} fontWeight="400" fontSize="0.88rem" color="#171717" flex={1}>
              Succeed
            </Text>
            <Image
              src={Back.src}
              boxSize={"1.5rem"}
              onClick={() => {
                const imageListParam = encodeURIComponent(JSON.stringify(generateImage))
                dispatch(setGenerateImage([]))
                dispatch(setWork(0))
                dispatch(setParams({}))
                dispatch(setTaskId([]))
                storage.set("currentBarValue", "0")
                router.replace(
                  `/generate-result?loadOriginalImage=${params.loadOriginalImage}&imageList=${imageListParam}`
                )
              }}
            ></Image>
          </>
        )}
      </Flex>
    </Box>
  )
})

export default MessageBox
