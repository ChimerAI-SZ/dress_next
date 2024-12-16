import { useEffect, useState } from "react"
import styled from "@emotion/styled"

import { Box, Text, Image } from "@chakra-ui/react"

interface DetailTipsProps {
  detailText: string
  handleViewDetails: () => void
}

const DetailTips = ({ detailText, handleViewDetails }: DetailTipsProps) => {
  const [showUpIcon, setShowUpIcon] = useState(true) // details 图标展示轮播

  useEffect(() => {
    const timer = setInterval(() => {
      setShowUpIcon(prev => !prev)
    }, 500)

    return () => clearInterval(timer)
  }, [])

  return (
    <DetailTip onClick={handleViewDetails}>
      <Text mr={"0.22rem"}>{detailText}</Text>
      <Box h={"1rem"} overflow={"hidden"} position={"relative"}>
        <Carousel>
          <Image
            src={"/assets/images/mainPage/details_up.png"}
            alt="detail-icon"
            style={{
              position: "absolute",
              opacity: showUpIcon ? 1 : 0,
              transition: "opacity 0.3s ease-in-out"
            }}
          />
          <Image
            src={"/assets/images/mainPage/details_down.png"}
            alt="detail-icon"
            style={{
              position: "absolute",
              opacity: showUpIcon ? 0 : 1,
              transition: "opacity 0.3s ease-in-out"
            }}
          />
        </Carousel>
      </Box>
    </DetailTip>
  )
}

const DetailTip = styled.section`
  font-size: 0.93rem;
  font-weight: 600;
  line-height: 1rem;
  color: #171717;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 1.38rem;
  flex-shrink: 0;
  padding: 0.38rem 0 1.13rem;
  box-sizing: content-box;
`

const Carousel = styled.div`
  position: relative;
  height: 1rem;
  width: 1rem;
`

export default DetailTips
