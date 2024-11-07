"use client"

import React, { useEffect, useState, useReducer } from "react"
import styled from "@emotion/styled"
import dayjs from "dayjs"
import { Container, Box, For, Grid, GridItem, Image, Flex, Show, Button, Heading, HStack } from "@chakra-ui/react"
import { Radio, RadioGroup } from "@components/ui/radio"
import { useSearchParams } from "next/navigation"

import selectedIcon from "@img/favourites/selectedIcon.svg"
import unselectedIcon from "@img/favourites/unselectedIcon.svg"
import buyIcon from "@img/favourites/buy.svg"
import likedIcon from "@img/favourites/liked.svg"
import downloadIcon from "@img/favourites/download.svg"
import descriptionBg from "@img/favourites/descriptionBg.png"
import AlterWarningIcon from "@img/AlterWarningIcon.svg"

import Toast from "@components/Toast"
import { Alert } from "@components/Alert"
import Header from "./components/Header"

import { featchFavouritesData } from "../mock"

type GroupList = {
  [key: string]: string[]
}

export default function FavouriteItem({ params }: { params: { item: string } }) {
  const searchParams = useSearchParams()
  const favouriteName = searchParams.get("name") ?? ""

  const [imgGroupList, setImgGroupList] = useState<GroupList>({})
  const [selectMode, setSelectMode] = useState<boolean>(false) // 用于标记是否进入多选状态
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
    // setSelectMode(value)

    Alert.open({ content: "Sent Successfully!", icon: <img alt="" src={AlterWarningIcon.src} /> })
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

  useEffect(() => {
    queryData()
  }, [])

  return (
    <Container px={"0"} className="favourite-item-container">
      <Header handleIconClick={handleIconClick} favouriteId={params.item} selectMode={selectMode} handleSetSelectMode={handleSetSelectMode} />
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
            return (
              <Box key={date + index} mb={"1rem"}>
                <SubTitle>{dayjs().isSame(date, "day") ? "Today" : dayjs(date).format("MMMM DD, YYYY")}</SubTitle>
                <Grid templateColumns="repeat(4, 1fr)" gap="3">
                  <For each={urls as string[]}>
                    {(item: string, index: number) => (
                      <GridItem position={"relative"}>
                        <Show when={selectMode}>
                          <Show
                            when={selectedImgList.includes(item)}
                            fallback={
                              <Box
                                onClick={() => {
                                  // todo 这里用url来作为key值是不合理的
                                  selectedImgList.push(item)

                                  setSelectedImgList(selectedImgList)

                                  forceUpdate()
                                }}
                                position={"absolute"}
                                top={"2pt"}
                                right={"2pt"}
                                w={"12pt"}
                                h={"12pt"}
                              >
                                <Image src={unselectedIcon.src} alt="select-icon" />
                              </Box>
                            }
                          >
                            <Box position={"absolute"} top={"2pt"} right={"2pt"} w={"12pt"} h={"12pt"}>
                              <Image
                                onClick={() => {
                                  // todo 这里用url来作为key值是不合理的
                                  selectedImgList.push(item)

                                  setSelectedImgList(selectedImgList.filter(img => img !== item))

                                  forceUpdate()
                                }}
                                src={selectedIcon.src}
                                alt="select-icon"
                              />
                            </Box>
                          </Show>
                        </Show>
                        <Image key={item + index} src={item} />
                      </GridItem>
                    )}
                  </For>
                </Grid>
              </Box>
            )
          }}
        </For>
      </Box>

      <Show when={selectMode}>
        <Box p={"8pt 16pt"} position={"fixed"} bottom={0} bgColor={"#fff"} w="100vw" borderRadius={"12px 12px 0 0"} boxShadow={"0px -1px 5px 0px rgba(214, 214, 214, 0.5);"}>
          <Flex alignItems={"center"} justifyContent={"space-between"}>
            <HStack>
              <RadioGroup size="sm">
                <Radio value="1">Select all</Radio>
              </RadioGroup>
            </HStack>
            <Flex alignItems={"center"} justifyContent={"flex-start"}>
              <Image w={"22pt"} h={"22pt"} src={downloadIcon.src} alt="download-icon" />
              <Image w={"22pt"} h={"22pt"} src={likedIcon.src} alt="liked-icon" />
              <Image w={"22pt"} h={"22pt"} src={buyIcon.src} alt="buy-icon" />
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

const SubTitle = styled.div`
  color: #737373;
  font-weight: 400;
  font-size: 1.2rem;
  padding-bottom: 0.5rem;
`
