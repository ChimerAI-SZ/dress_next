"use client"

import React, { useEffect, useState, useReducer } from "react"
import { Container, Box, For, Image, Flex, Show, Button, Heading, HStack } from "@chakra-ui/react"
import { Radio, RadioGroup } from "@components/ui/radio"
import { useSearchParams } from "next/navigation"

import buyIcon from "@img/favourites/buy.svg"
import likedIcon from "@img/favourites/liked.svg"
import downloadIcon from "@img/favourites/download.svg"
import descriptionBg from "@img/favourites/descriptionBg.png"

import Toast from "@components/Toast"
import { Alert } from "@components/Alert"
import ImageGroupByData from "@components/ImageGroupByDate"
import Header from "./components/Header"

import { featchFavouritesData } from "../mock"

type GroupList = {
  [key: string]: string[]
}

export default function FavouriteItem({ params }: { params: { item: string } }) {
  const searchParams = useSearchParams()
  const favouriteName = searchParams.get("name") ?? ""

  const [imgGroupList, setImgGroupList] = useState<GroupList>({})
  const [selectionMode, setSelectionMode] = useState<boolean>(false) // 用于标记是否进入多选状态
  const [selectedImgList, setSelectedImgList] = useState<string[]>([]) // 多选图片列表
  const [deleteToastVisible, setDeleteToastVisible] = useState(false)

  const [, forceUpdate] = useReducer(x => x + 1, 0)

  const handleIconClick = (type: string): void => {
    console.log(type)
    if (type === "delete") {
      setDeleteToastVisible(true)
    }
  }

  const handleSetSelectMode = (value: boolean) => {
    setSelectionMode(value)
  }

  const queryData = async () => {
    try {
      const res = await featchFavouritesData(params.item)
      const { data, success } = res

      // 把图片根据日期进行分栏
      // 日期要从今往前排序
      if (success && data?.length > 0) {
        const groupedByDate = new Map()

        data.forEach(item => {
          const date = item.added_at
          // 如果 Map 中还没有这个日期的键，初始化一个空数组
          if (!groupedByDate.has(date)) {
            groupedByDate.set(date, [])
          }
          // 将当前对象的 url 添加到对应日期的数组中
          groupedByDate.get(date).push(item.image_url)
        })

        console.log(Object.fromEntries(groupedByDate))
        setImgGroupList(Object.fromEntries(groupedByDate))
      }

      console.log(res, "res")
    } catch (err: any) {
      // todo error hanlder
    }
  }

  // 选择模式下图片的选择、取消选择事件
  // 通过已选图片列表中是否有这个图片来判断是选择还是取消选择
  const handleImgSelect = (img: string) => {
    if (selectedImgList.includes(img)) {
      setSelectedImgList(selectedImgList.filter(item => item !== img))
    } else {
      selectedImgList.push(img)
      setSelectedImgList(selectedImgList)
    }

    forceUpdate()
  }

  useEffect(() => {
    // 查询收藏夹数据
    queryData()
  }, [])

  return (
    <Container px={"0"} className="favourite-item-container">
      <Header handleIconClick={handleIconClick} favouriteId={params.item} selectMode={selectionMode} handleSetSelectMode={handleSetSelectMode} />
      {/* 收藏夹名称 */}
      <Heading p={"0 16pt"} mb={"8pt"}>
        {decodeURIComponent(favouriteName)}
      </Heading>
      {/* 收藏夹说明 */}
      <Show when={true}>
        <Box backgroundImage={`url(${descriptionBg.src})`} backgroundSize={"cover"} backgroundPosition={"center"}>
          <Box>
            <Box fontWeight={500} fontSize={"1.3rem"} p={"8pt 16pt 2pt"}>
              Description
            </Box>
            {/* todo 这里用图片当背景不太合理 */}
            <Box px={"16pt"}>Graphic patterns are visual elements made of repeating shapes, lines, and colors, arranged deliberately to create a cohesive design.</Box>
          </Box>
        </Box>
      </Show>
      <Box px={"1rem"} position={"relative"}>
        <For each={Object.entries(imgGroupList)}>
          {([date, urls], index: number): React.ReactNode => {
            return <ImageGroupByData key={index} date={date} imageList={urls} selectionMode={selectionMode} selectedImageList={selectedImgList} handleSelct={handleImgSelect} />
          }}
        </For>
      </Box>

      <Show when={selectionMode}>
        <Box p={"8pt 16pt"} position={"fixed"} bottom={0} bgColor={"#fff"} w="100vw" borderRadius={"12px 12px 0 0"} boxShadow={"0px -1px 5px 0px rgba(214, 214, 214, 0.5);"}>
          <Flex alignItems={"center"} justifyContent={"space-between"}>
            <HStack>
              <RadioGroup size="sm">
                <Radio value="1">Select all</Radio>
              </RadioGroup>
            </HStack>
            <Flex alignItems={"center"} justifyContent={"flex-start"}>
              <Image w={"22pt"} h={"22pt"} ml={"8pt"} src={downloadIcon.src} alt="download-icon" />
              <Image w={"22pt"} h={"22pt"} ml={"8pt"} src={likedIcon.src} alt="liked-icon" />
              <Image w={"22pt"} h={"22pt"} ml={"8pt"} src={buyIcon.src} alt="buy-icon" />
            </Flex>
          </Flex>
        </Box>
      </Show>

      {/* 删除的确认弹窗 */}
      <Show when={deleteToastVisible}>
        <Toast
          boxStyle={{ borderRadius: "12px" }}
          close={() => {
            setDeleteToastVisible(false)
          }}
        >
          <Box p={"12pt"} w={"75vw"}>
            <Box textAlign={"center"} fontWeight={500} color={"#171717"} fontSize={"1.3rem"}>
              Delete Album
            </Box>
            <Box color={"#171717"} fontWeight={400} textAlign={"center"} mb={"1rem"}>
              Are you sure you want to delete this album?
            </Box>
            <Flex justifyContent={"space-between"}>
              <Button
                colorPalette={"gray"}
                w={"40%"}
                variant="outline"
                borderRadius={"40px"}
                onClick={() => {
                  setDeleteToastVisible(false)
                }}
              >
                Cancel
              </Button>
              <Button borderRadius={"40px"} w={"40%"} bgColor={"#EE3939"}>
                Delete
              </Button>
            </Flex>
          </Box>
        </Toast>
      </Show>
    </Container>
  )
}
