"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import styled from "@emotion/styled"

import { Container, Box, Flex, Heading } from "@chakra-ui/react"
import { LeftOutlined } from "@ant-design/icons"

import homepageBg from "@img/homepage/homepageBg.png"

function Homepage() {
  const router = useRouter()

  useEffect(() => {
    // query home page data
  }, [])

  return (
    <Container p={0} position={"relative"}>
      <Container className="homepate-header-contaienr" p={"11pt 16pt"} zIndex={1}>
        <Flex gap="4" alignItems={"center"} justify="space-between" position={"relative"}>
          <LeftOutlined
            style={{ width: "22pt", height: "22pt" }}
            onClick={() => {
              router.back()
            }}
          />
          <Heading position={"absolute"} left={"50%"} transform={"translateX(-50%)"}>
            Avatar
          </Heading>
          {/* 布局占位容器 */}
          <Box />
        </Flex>
      </Container>
      <Box
        className="homepage-avatar-container"
        backgroundImage={`url(${homepageBg.src})`}
        backgroundSize={"cover"}
        h={"25vh"}
        position={"absolute"}
        w={"100vw"}
        top={0}
        zIndex={0}
        borderRadius={"50% / 15%"}
        borderTopLeftRadius={0}
        borderTopRightRadius={0}
      >
        <AvatarContainer>
          <AvatarBg></AvatarBg>
        </AvatarContainer>
      </Box>
    </Container>
  )
}

const AvatarContainer = styled.div`
  z-index: 1;
  width: 25vw;
  height: 25vw;
  position: absolute;
  background: #fff;
  border-radius: 50%;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 50%);

  display: flex;
  align-items: center;
  justify-content: center;
`
const AvatarBg = styled.div`
  background: linear-gradient(219deg, rgba(255, 144, 144, 1), rgba(254, 75, 163, 1));
  width: calc(100% - 8pt);
  height: calc(100% - 8pt);
  border-radius: 50%;
`

export default Homepage
