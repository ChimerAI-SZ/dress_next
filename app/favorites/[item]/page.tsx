"use client"

import React, { useEffect, useState, useReducer } from "react"
import dayjs from "dayjs"
import styled from "@emotion/styled"
import { Provider, useSelector } from "react-redux"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"

import { Container, Box, For, Image, Flex, Show, Button, Heading, Text } from "@chakra-ui/react"

import Toast from "@components/Toast"
import ImageGroupByData from "@components/ImageGroupByDate"
import Header from "./components/Header"
import FavouritesDialog from "../components/AlbumDrawer"

import { FavouriteItem, FavouriteItemImage } from "@definitions/favourites"
import { queryAllImageInCollection, deleteCollection } from "@lib/request/favourites"

import { store } from "../store"

type GroupList = {
  [key: string]: FavouriteItemImage[]
}
interface FavouriteItemProps {
  params: { item: string }
}

const Collection: React.FC<FavouriteItemProps> = ({ params }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const collectionList = useSelector((state: any) => state.collectionList.value)

  const [dialogVisible, setDialogVisible] = useState<boolean>(false) // 编辑收藏夹信息的弹窗是否可以见
  const [selectionMode, setSelectionMode] = useState<boolean>(false) // 用于标记是否进入多选状态
  const [deleteToastVisible, setDeleteToastVisible] = useState(false)
  const [imgGroupList, setImgGroupList] = useState<GroupList>({})
  const [selectedImgList, setSelectedImgList] = useState<number[]>([]) // 多选图片列表
  const [isAllSelected, setIsAllSelected] = useState<boolean>(false) // 全选状态
  const [originImgList, setOriginImgList] = useState<FavouriteItemImage[]>([]) // 分组前的图片列表
  // 收藏夹信息
  const [description, setDescription] = useState(
    collectionList.find((item: FavouriteItem) => item.collection_id + "" === params.item)?.description
  )
  const [title, setTitle] = useState(decodeURIComponent(searchParams.get("name") ?? ""))

  const [, forceUpdate] = useReducer(x => x + 1, 0)

  // Header 组件中右侧按钮的点击回调事件
  const handleIconClick = (type: string): void => {
    switch (type) {
      case "delete":
        setDeleteToastVisible(true)
        break
      case "edit":
        setDialogVisible(true)
        break
    }
  }

  // 进入多选
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

  // 删除收藏夹
  const handleDelete = async () => {
    const res = await deleteCollection({ collection_id: +params.item })
    const { data, success } = res

    if (success) {
      router.back()
    } else {
      // todo error handler
    }
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

  // 下载图片
  const handleDownload = () => {
    // const downloadImage = (urls: string[]) => {
    //   urls.forEach((url, index) => {
    //     // 创建一个新的 iframe 元素
    //     let iframe = document.createElement("iframe")

    //     // 将 iframe 的 'src' 属性设置为文件的 URL
    //     iframe.src = url

    //     // 设置 iframe 的 'id' 以便稍后移除
    //     iframe.id = "download_iframe_" + index

    //     // 将 iframe 设置为隐藏
    //     iframe.style.display = "none"

    //     // 将 iframe 添加到页面中
    //     document.body.appendChild(iframe)
    //   })

    //   // 一段时间后移除这些 iframe
    //   setTimeout(() => {
    //     urls.forEach((url, index) => {
    //       let iframe = document.getElementById("download_iframe_" + index)
    //       if (iframe) {
    //         document.body.removeChild(iframe)
    //       }
    //     })
    //   }, 5000)

    //   // const link = document.createElement("a")
    //   // link.href = url?.split("?")[0]
    //   // link.download = url.split("/").pop() || "download" // 提取文件名，如果没有文件名则使用 'download'
    //   // document.body.appendChild(link)
    //   // link.click()
    //   // document.body.removeChild(link)
    //   // saveAs(url, "image.png")
    // }

    const downloadImage = (imageUrls: string[]) => {
      const download = (index: number) => {
        if (index < imageUrls.length) {
          const link = document.createElement("a")
          link.href = imageUrls[index]
          link.download = "" // 有些浏览器不允许设置下载名称，可以留空或尝试设置文件名
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)

          // 设置定时器，1秒后下载下一张图片
          setTimeout(() => {
            download(index + 1)
          }, 1000)
        }
      }

      // 从第一张图片开始下载
      download(0)
    }

    if (selectedImgList.length > 0) {
      const imgUrls = originImgList.filter(item => selectedImgList.includes(item.id)).map(item => item.image_url)

      downloadImage(imgUrls)
    }
  }

  // 编辑收藏夹回调
  const onAblumEditSuccess = (newCollectionData: any) => {
    setDescription(newCollectionData.description)
    setTitle(newCollectionData.title)
  }

  useEffect(() => {
    queryData()
  }, [])

  return (
    <Container px={"0"} className="favourite-item-container">
      <Header
        handleIconClick={handleIconClick}
        collectionId={params.item}
        selectMode={selectionMode}
        handleSetSelectMode={handleSetSelectMode}
      />
      {/* 收藏夹名称 */}
      <Heading p={"0 16pt"} mb={"8pt"}>
        {title}
      </Heading>
      {/* 收藏夹说明 */}
      <Show when={description}>
        <Box>
          <DescriptionBox>
            <Flex fontWeight={500} fontSize={"1.3rem"} alignItems={"center"} justifyContent={"flex-start"}>
              <Image
                boxSize={"2rem"}
                mr={"0.5rem"}
                src={"/assets/images/favourites/collectionDescription.svg"}
                alt="description-icon"
              />
              <Text display={"inline-block"} mt={"0.5rem"} fontWeight={500} fontSize={"1.1rem"}>
                Description
              </Text>
            </Flex>
            <Box px={"0.8rem"} mt={"0.5rem"}>
              {description}
            </Box>
          </DescriptionBox>
        </Box>
      </Show>
      <Box px={"1rem"} mt={"8pt"} position={"relative"}>
        <For each={Object.entries(imgGroupList)}>
          {([date, urls], index: number): React.ReactNode => {
            return (
              <ImageGroupByData
                key={index}
                imgKey="id"
                date={date}
                imageList={urls}
                selectionMode={selectionMode}
                selectedImageList={selectedImgList}
                handleSelect={handleImgSelect}
              />
            )
          }}
        </For>
      </Box>

      <Show when={selectionMode}>
        <Box
          p={"8pt 16pt"}
          position={"fixed"}
          bottom={0}
          bgColor={"#fff"}
          w="100vw"
          borderRadius={"12px 12px 0 0"}
          boxShadow={"0px -1px 5px 0px rgba(214, 214, 214, 0.5);"}
        >
          <Flex alignItems={"center"} justifyContent={"space-between"}>
            <Flex
              gap={"0.53rem"}
              alignItems={"center"}
              onClick={() => {
                setSelectedImgList(isAllSelected ? [] : originImgList.map(item => item.id))

                setIsAllSelected(!isAllSelected)
              }}
            >
              <Image
                boxSize="16pt"
                src={
                  isAllSelected
                    ? "/assets/images/generate-result/selected.svg"
                    : "/assets/images/generate-result/no-select.svg"
                }
                border="0.06rem solid #BFBFBF"
                backdropFilter="blur(50px)"
                borderRadius={"50%"}
              ></Image>
              <Text>Select all</Text>
            </Flex>
            <Flex alignItems={"center"} justifyContent={"flex-start"}>
              <Image
                w={"22pt"}
                h={"22pt"}
                ml={"8pt"}
                src={"/assets/images/favourites/download.svg"}
                onClick={handleDownload}
                alt="download-icon"
              />
              <Image w={"22pt"} h={"22pt"} ml={"8pt"} src={"/assets/images/favourites/liked.svg"} alt="liked-icon" />
              <Image w={"22pt"} h={"22pt"} ml={"8pt"} src={"/assets/images/favourites/buy.svg"} alt="buy-icon" />
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

      <FavouritesDialog
        type="edit"
        collectionId={+params.item}
        visible={dialogVisible}
        close={closeDialog}
        onSuccess={onAblumEditSuccess}
      />
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
