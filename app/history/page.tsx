"use client"
import { useEffect, useState, useReducer } from "react"
import dayjs from "dayjs"

import { Container, Box, For, Image, Flex, Show, Text } from "@chakra-ui/react"
import { Radio, RadioGroup } from "@components/ui/radio"

import ImageGroupByData from "@components/ImageGroupByDate"

import NoSelect from "@img/generate-result/no-select.svg"
import Selected from "@img/generate-result/selected.svg"

// header组件
import Header from "./components/Header"

import { HistoryItem } from "@definitions/history"
import { storage } from "@utils/index"
import { queryHistory } from "@lib/request/history"
import { featchHistoryData } from "./mock"

type GroupList = {
  [key: string]: HistoryItem[]
}

function Page() {
  const [selectionMode, setSelectionMode] = useState<boolean>(false) // 用于标记是否进入多选状态
  // 把图片按日期分组
  const [imgGroupList, setImgGroupList] = useState<GroupList>({})
  // 分组前的图片列表
  const [originImgList, setOriginImgList] = useState<HistoryItem[]>([])

  const [selectedImgList, setSelectedImgList] = useState<number[]>([]) // 多选图片列表
  const [isAllSelected, setIsAllSelected] = useState<boolean>(false)

  const [, forceUpdate] = useReducer(x => x + 1, 0)

  const handleSetSelectMode = (mode: any) => {
    setSelectionMode(mode)
  }

  // 选择模式下图片的选择、取消选择事件
  // 通过已选图片列表中是否有这个图片来判断是选择还是取消选择
  const handleImgSelect = (img: number) => {
    if (selectedImgList.includes(img)) {
      setSelectedImgList(selectedImgList.filter(item => item !== img))
    } else {
      selectedImgList.push(img)

      // 如果已经全选了，就要把全选标记上
      if (selectedImgList.length === originImgList.length) {
        setIsAllSelected(true)
      }

      setSelectedImgList(selectedImgList)
    }

    forceUpdate()
  }

  const queryData = async () => {
    try {
      // const res = await featchHistoryData("123")
      const user_id = storage.get("user_id")

      const params = { user_id: +(user_id ? user_id : "0"), start_date: dayjs().subtract(1, "year").format("YYYY-MM-DD"), end_date: dayjs().format("YYYY-MM-DD") }
      const { message, data, success } = await queryHistory(params)
      // const data = [
      //   {
      //     history_id: 1,
      //     user_id: 3,
      //     task_id: "task_456",
      //     image_url: "https://aimoda-ai.oss-us-east-1.aliyuncs.com/aimoda-homepage-image/AIMODA_small.svg",
      //     created_date: "2024-11-12T11:12:05.873813316+08:00"
      //   },
      //   {
      //     history_id: 2,
      //     user_id: 3,
      //     task_id: "task_456",
      //     image_url: "https://aimoda-ai.oss-us-east-1.aliyuncs.com/aimoda-homepage-image/aa4.svg",
      //     created_date: "2024-11-12T11:12:05.873813316+08:00"
      //   }
      // ]

      // 把图片根据日期进行分栏
      // 日期要从今往前排序
      // if (success && data?.length > 0) {
      if (data?.length > 0) {
        const groupedByDate = new Map()

        data.forEach((item: any) => {
          const date = dayjs(item.created_date).format("YYYY-MM-DD")
          // 如果 Map 中还没有这个日期的键，初始化一个空数组
          if (!groupedByDate.has(date)) {
            groupedByDate.set(date, [])
          }
          // 将当前对象的 url 添加到对应日期的数组中
          groupedByDate.get(date).push(item)
        })

        setOriginImgList(data)
        setImgGroupList(Object.fromEntries(groupedByDate))
      }
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
            return <ImageGroupByData key={index} date={date} imageList={urls} selectionMode={selectionMode} selectedImageList={selectedImgList} handleSelect={handleImgSelect} />
          }}
        </For>
      </Box>

      <Show when={selectionMode}>
        <Box p={"8pt 16pt"} position={"fixed"} bottom={0} bgColor={"#fff"} w="100vw" borderRadius={"12px 12px 0 0"} boxShadow={"0px -1px 5px 0px rgba(214, 214, 214, 0.5);"}>
          <Flex alignItems={"center"} justifyContent={"space-between"}>
            <Flex
              gap={"0.53rem"}
              alignItems={"center"}
              onClick={() => {
                if (isAllSelected) {
                  setSelectedImgList([])
                } else {
                  setSelectedImgList(originImgList.map(item => item.history_id))
                }
                setIsAllSelected(!isAllSelected)
              }}
            >
              <Image boxSize="1.12rem" src={isAllSelected ? Selected.src : NoSelect.src} border="0.06rem solid #BFBFBF" backdropFilter="blur(50px)" borderRadius={"50%"}></Image>
              <Text>Select all</Text>
            </Flex>
            <Flex alignItems={"center"} justifyContent={"flex-start"}>
              <Image w={"22pt"} h={"22pt"} ml={"8pt"} src={"/assets/images/favourites/download.svg"} alt="download-icon" />
              <Image w={"22pt"} h={"22pt"} ml={"8pt"} src={"/assets/images/favourites/unliked.svg"} alt="liked-icon" />
              <Image w={"22pt"} h={"22pt"} ml={"8pt"} src={"/assets/images/favourites/buy.svg"} alt="buy-icon" />
            </Flex>
          </Flex>
        </Box>
      </Show>
    </Container>
  )
}

export default Page
