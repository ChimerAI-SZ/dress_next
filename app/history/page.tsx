"use client"
import { useEffect, useState, useReducer } from "react"

import { Container, Box, For, Image, Flex, Show, Button, Heading, HStack } from "@chakra-ui/react"
import { Radio, RadioGroup } from "@components/ui/radio"

import ImageGroupByData from "@components/ImageGroupByDate"

import buyIcon from "@img/favourites/buy.svg"
import likedIcon from "@img/favourites/liked.svg"
import downloadIcon from "@img/favourites/download.svg"

import Header from "./components/Header"

import { featchHistoryData } from "./mock"

type GroupList = {
  [key: string]: string[]
}

function Page() {
  const [selectionMode, setSelectionMode] = useState<boolean>(false) // 用于标记是否进入多选状态
  const [imgGroupList, setImgGroupList] = useState<GroupList>({})
  const [selectedImgList, setSelectedImgList] = useState<string[]>([]) // 多选图片列表

  const [, forceUpdate] = useReducer(x => x + 1, 0)

  const handleSetSelectMode = (mode: any) => {
    setSelectionMode(mode)
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

  const queryData = async () => {
    try {
      const res = await featchHistoryData("123")
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

  useEffect(() => {
    // fetchCollectionList
    queryData()
  }, [])

  return (
    <Container p={0}>
      <Header selectionMode={selectionMode} handleSetSelectMode={handleSetSelectMode} />
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
    </Container>
  )
}

export default Page
