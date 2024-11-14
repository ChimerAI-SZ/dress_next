"use client"

import React, { useEffect, useState, useReducer } from "react"
import { Container, Box, For, Image, Flex, Show, Button, Heading, Text } from "@chakra-ui/react"
import { useSearchParams } from "next/navigation"
import { Provider, useSelector } from "react-redux"

import styled from "@emotion/styled"
import { useRouter } from "next/navigation"

import NoSelect from "@img/generate-result/no-select.svg"
import Selected from "@img/generate-result/selected.svg"
import buyIcon from "@img/favourites/buy.svg"
import likedIcon from "@img/favourites/liked.svg"
import downloadIcon from "@img/favourites/download.svg"
import descriptionIcon from "@img/favourites/collectionDescription.svg"

import Toast from "@components/Toast"
import ImageGroupByData from "@components/ImageGroupByDate"
import Header from "./components/Header"
import FavouritesDialog from "../components/AlbumDrawer"

import { FavouriteItem, FavouriteItemImage } from "@definitions/favourites"
import { queryAllImageInCollection, deleteCollection } from "@lib/request/favourites"
import { store } from "../store"
import dayjs from "dayjs"

type GroupList = {
  [key: string]: FavouriteItemImage[]
}
interface FavouriteItemProps {
  params: { item: string }
}

const Collection: React.FC<FavouriteItemProps> = ({ params }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const favouriteName = searchParams.get("name") ?? ""
  const collectionList = useSelector((state: any) => state.collectionList.value)

  const [dialogVisible, setDialogVisible] = useState<boolean>(false) // 编辑收藏夹信息的弹窗是否可以见
  const [imgGroupList, setImgGroupList] = useState<GroupList>({})
  const [selectionMode, setSelectionMode] = useState<boolean>(false) // 用于标记是否进入多选状态
  const [selectedImgList, setSelectedImgList] = useState<number[]>([]) // 多选图片列表
  const [deleteToastVisible, setDeleteToastVisible] = useState(false)
  const [isAllSelected, setIsAllSelected] = useState<boolean>(false)
  // 分组前的图片列表
  const [originImgList, setOriginImgList] = useState<FavouriteItemImage[]>([])

  const [, forceUpdate] = useReducer(x => x + 1, 0)

  const handleIconClick = (type: string): void => {
    console.log(type)
    if (type === "delete") {
      setDeleteToastVisible(true)
    } else if (type === "edit") {
      setDialogVisible(true)
    }
  }

  const handleSetSelectMode = (value: boolean) => {
    setSelectionMode(value)
  }

  // 查询收藏夹数据
  const queryData = async () => {
    try {
      const res = await queryAllImageInCollection({ collection_id: +params.item })
      const { data, success } = res

      // 把图片根据日期进行分栏
      // 日期要从今往前排序
      if (success && data?.length > 0) {
        const groupedByDate = new Map()

        data.forEach((item: any) => {
          const date = dayjs(item.added_at).format("YYYY-MM-DD")
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

      console.log(res, "res")
    } catch (err: any) {
      // todo error hanlder
    }
  }

  const handleDelete = async () => {
    try {
      const res = await deleteCollection({ collection_id: +params.item })
      const { data, success } = res

      if (success) {
        router.back()
      } else {
      }
    } catch (err: any) {}
  }

  // 选择模式下图片的选择、取消选择事件
  // 通过已选图片列表中是否有这个图片来判断是选择还是取消选择
  const handleImgSelect = (img: number) => {
    if (selectedImgList.includes(img)) {
      setSelectedImgList(selectedImgList.filter(item => item !== img))
    } else {
      selectedImgList.push(img)
      setSelectedImgList(selectedImgList)
    }

    forceUpdate()
  }

  // 关闭弹窗
  const closeDialog = () => {
    setDialogVisible(false)
  }

  useEffect(() => {
    // 查询收藏夹数据
    queryData()
  }, [])

  return (
    <Container px={"0"} className="favourite-item-container">
      <Header handleIconClick={handleIconClick} collectionId={params.item} selectMode={selectionMode} handleSetSelectMode={handleSetSelectMode} />
      {/* 收藏夹名称 */}
      <Heading p={"0 16pt"} mb={"8pt"}>
        {decodeURIComponent(favouriteName)}
      </Heading>
      {/* 收藏夹说明 */}
      <Show when={collectionList.find((item: FavouriteItem) => item.collection_id + "" === params.item)?.description}>
        <Box>
          <DescriptionBox>
            <Flex fontWeight={500} fontSize={"1.3rem"} p={"8pt 16pt 2pt"} alignItems={"center"} justifyContent={"flex-start"}>
              <Image w={"28pt"} h={"28pt"} src={descriptionIcon.src} alt="description-icon" />
              <span>Description</span>
            </Flex>
            <Box px={"16pt"}>{collectionList.find((item: FavouriteItem) => item.collection_id + "" === params.item)?.description}</Box>
          </DescriptionBox>
        </Box>
      </Show>
      <Box px={"1rem"} mt={"8pt"} position={"relative"}>
        <For each={Object.entries(imgGroupList)}>
          {([date, urls], index: number): React.ReactNode => {
            return <ImageGroupByData key={index} imgKey="id" date={date} imageList={urls} selectionMode={selectionMode} selectedImageList={selectedImgList} handleSelect={handleImgSelect} />
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
                  setSelectedImgList(originImgList.map(item => item.id))
                }
                setIsAllSelected(!isAllSelected)
              }}
            >
              <Image boxSize="16pt" src={isAllSelected ? Selected.src : NoSelect.src} border="0.06rem solid #BFBFBF" backdropFilter="blur(50px)" borderRadius={"50%"}></Image>
              <Text>Select all</Text>
            </Flex>
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
              <Button borderRadius={"40px"} w={"40%"} bgColor={"#EE3939"} onClick={handleDelete}>
                Delete
              </Button>
            </Flex>
          </Box>
        </Toast>
      </Show>

      <FavouritesDialog type="edit" collectionId={+params.item} visible={dialogVisible} close={closeDialog} />
    </Container>
  )
}

const DescriptionBox = styled.div`
  background: #ffeaf4;
  margin: 0 1rem;
  border-radius: 8px;
  position: relative;
  padding-bottom: 20px;
  &:: after {
    content: "";
    padding: 10px;
    height: 10px;
    display: inline-block;
    width: 100%;
    bottom: -5px;
    position: absolute;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
  }
`

export default ({ params }: FavouriteItemProps) => {
  return (
    <Provider store={store}>
      <Collection params={params} />
    </Provider>
  )
}
