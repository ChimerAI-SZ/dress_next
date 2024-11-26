"use client"

import { Container, Image, Flex, Heading } from "@chakra-ui/react"
import { useRouter } from "next/navigation"

import fullSelectionIcon from "@img/album/fullSelection.svg"
import fullSelectionActiveIcon from "@img/album/fullSelectionActive.svg"

import { HistoryHeaderProps } from "@definitions/history"

const Header: React.FC<HistoryHeaderProps> = ({ selectionMode, handleSetSelectMode }) => {
  const router = useRouter()

  return (
    <Container className="album-header-contaienr" p={"11pt 16pt"}>
      <Flex gap="4" alignItems={"center"} justify="space-between" position={"relative"}>
        <Image
          src={"/assets/images/album/backIcon.svg"}
          boxSize={"1.22rem"}
          alt="add icon"
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
            boxSize={"1.56rem"}
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
