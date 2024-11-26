"use client"

import { useRouter } from "next/navigation"
import { Container, Flex, Heading, Box, Image } from "@chakra-ui/react"

interface HeaderProps {
  title?: string
}

const Header: React.FC<HeaderProps> = ({ title = "" }) => {
  const router = useRouter()

  return (
    <Container className="homepage-header-contaienr" p={"11pt 16pt"} zIndex={1}>
      <Flex gap="4" alignItems={"center"} justify="space-between" position={"relative"}>
        <Image
          src={"/assets/images/album/backIcon.svg"}
          boxSize={"1.22rem"}
          alt="add icon"
          onClick={() => {
            router.back()
          }}
        />
        <Heading whiteSpace={"nowrap"} position={"absolute"} left={"50%"} transform={"translateX(-50%)"}>
          {title}
        </Heading>
        {/* 布局占位容器 */}
        <Box />
      </Flex>
    </Container>
  )
}

export default Header
