"use client"
import { useState } from "react"
import { Container, Image, Flex, Heading, Box } from "@chakra-ui/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LeftOutlined } from "@ant-design/icons"

import AlbumDrawer from "./AlbumDrawer"

import addIcon from "@img/album/addIcon.svg"

import { AlbumHeaderProps } from "@definitions/album"

const Header: React.FC<AlbumHeaderProps> = ({ name, onSuccess }) => {
  const pathname = usePathname()
  const [dialogVisible, setDialogVisible] = useState<boolean>(false) // 编辑收藏夹信息的弹窗是否可以见

  // 关闭弹窗
  const closeDialog = () => {
    setDialogVisible(false)
  }

  return (
    <Container className="album-header-contaienr" p={"11pt 16pt"}>
      <Flex gap="4" alignItems={"center"} justify="space-between" position={"relative"}>
        {/* 如果当前在收藏夹列表，返回主页，不然返回收藏夹页 */}
        {/* todo：这种情况只有在‘收藏夹的来源只有主页’的情况下使用 */}
        <Link href={pathname === "/album" ? "/" : "/album"}>
          {/* <Image w="24px" h="24px" src={closeIcon.src} alt="" /> */}
          <Image src={"/assets/images/album/backIcon.svg"} boxSize={"1.22rem"} alt="add icon" />
        </Link>
        <Heading whiteSpace={"nowrap"} position={"absolute"} left={"50%"} transform={"translateX(-50%)"}>
          {name}
        </Heading>
        {/* 新增 icon 与编辑/删除的menu多选 icon */}
        <Box
          onClick={() => {
            setDialogVisible(true)
          }}
          width={"22pt"}
          h={"22pt"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          fontSize={"1.5rem"}
          borderRadius={"50%"}
          border={"1px solid #BFBFBF"}
        >
          <Image src={addIcon.src} h={"14pt"} w={"14pt"} alt="add icon" />
        </Box>
        <AlbumDrawer type="add" visible={dialogVisible} close={closeDialog} onSuccess={onSuccess} />
      </Flex>
    </Container>
  )
}

export default Header
