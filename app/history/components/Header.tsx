"use client"

import { Container, Image, Flex, Heading } from "@chakra-ui/react"
import { LeftOutlined } from "@ant-design/icons"
import { useRouter } from "next/navigation"

import fullSelectionIcon from "@img/album/fullSelection.svg"
import fullSelectionActiveIcon from "@img/album/fullSelectionActive.svg"

import { HistoryHeaderProps } from "@definitions/history"

const Header: React.FC<HistoryHeaderProps> = ({ selectionMode, handleSetSelectMode }) => {
  const router = useRouter()

  return (
    <Container className="album-header-contaienr" p={"11pt 16pt"}>
      <Flex gap="4" alignItems={"center"} justify="space-between" position={"relative"}>
        <LeftOutlined
          style={{ width: "22pt", height: "22pt" }}
          onClick={() => {
            router.back()
          }}
        />
        <Heading position={"absolute"} left={"50%"} transform={"translateX(-50%)"}>
          History
        </Heading>
        {/* 新增 icon 与编辑/删除的menu多选 icon */}
        <Flex alignItems={"center"}>
          <Image
            onClick={() => {
              handleSetSelectMode(!selectionMode)
            }}
            w="22pt"
            h="22pt"
            mr={"4pt"}
            src={selectionMode ? fullSelectionActiveIcon.src : fullSelectionIcon.src}
            alt=""
          />
        </Flex>
      </Flex>
    </Container>
  )
}

export default Header
