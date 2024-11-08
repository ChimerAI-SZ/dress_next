"use client"

import { Container, Image, Flex, Heading, Box } from "@chakra-ui/react"
import Link from "next/link"
import { LeftOutlined } from "@ant-design/icons"
import { useRouter } from "next/navigation"

import fullSelectionIcon from "@img/favourites/fullSelection.svg"
import fullSelectionActiveIcon from "@img/favourites/fullSelectionActive.svg"

import { HistoryHeaderProps } from "@definitions/history"

const Header: React.FC<HistoryHeaderProps> = ({ selectionMode, handleSetSelectMode }) => {
  //   const pathname = usePathname()
  const router = useRouter()
  return (
    <Container className="favourites-header-contaienr" p={"11pt 16pt"}>
      <Flex gap="4" alignItems={"center"} justify="space-between" position={"relative"}>
        {/* 如果当前在收藏夹列表，返回主页，不然返回收藏夹页 */}
        {/* todo：这种情况只有在‘收藏夹的来源只有主页’的情况下使用 */}
        {/* <Link href={"/favorites"}> */}
        {/* <Image w="24px" h="24px" src={closeIcon.src} alt="" /> */}
        <LeftOutlined
          style={{ width: "22pt", height: "22pt" }}
          onClick={() => {
            router.back()
          }}
        />
        {/* </Link> */}
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
