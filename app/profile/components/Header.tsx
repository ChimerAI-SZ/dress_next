"use client"

import { useRouter } from "next/navigation"
import { Container, Flex, Heading, Box } from "@chakra-ui/react"
import { LeftOutlined } from "@ant-design/icons"

interface HeaderProps {
  title?: string
}

const Header: React.FC<HeaderProps> = ({ title = "" }) => {
  const router = useRouter()

  return (
    <Container className="homepage-header-contaienr" p={"11pt 16pt"} zIndex={1}>
      <Flex gap="4" alignItems={"center"} justify="space-between" position={"relative"}>
        <LeftOutlined
          style={{ width: "22pt", height: "22pt" }}
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
