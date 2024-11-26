"use client"

import React, { useEffect, useState, useReducer } from "react"
import dayjs from "dayjs"
import styled from "@emotion/styled"
import { useSelector } from "react-redux"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"

import { Container, Box, For, Image, Flex, Show, Button, Heading, Text } from "@chakra-ui/react"

import { Alert } from "@components/Alert"
import Toast from "@components/Toast"
import ImageGroupByData from "@components/ImageGroupByDate"
import Header from "./components/Header"
import AlbumDrawer from "../components/AlbumDrawer"
import ImageViewer from "@components/ImageViewer"

import { AlbumItem, AlbumItemImage } from "@definitions/album"
import { queryAllImageInAlbum, deleteAlbum, removeImgFromAlbum } from "@lib/request/album"
import { errorCaptureRes } from "@utils/index"

type GroupList = {
  [key: string]: AlbumItemImage[]
}
interface AlbumItemProps {
  params: { item: string }
}

const Album: React.FC<AlbumItemProps> = ({ params }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const albumList = useSelector((state: any) => state.collectionList.value)

  const [dialogVisible, setDialogVisible] = useState<boolean>(false) // 编辑收藏夹信息的弹窗是否可以见
  const [selectionMode, setSelectionMode] = useState<boolean>(false) // 用于标记是否进入多选状态
  const [deleteToastVisible, setDeleteToastVisible] = useState(false)
  const [imgGroupList, setImgGroupList] = useState<GroupList>({})
  const [selectedImgList, setSelectedImgList] = useState<number[]>([]) // 多选图片列表
  const [isAllSelected, setIsAllSelected] = useState<boolean>(false) // 全选状态
  const [originImgList, setOriginImgList] = useState<AlbumItemImage[]>([]) // 分组前的图片列表
  const [selectedImg, setSelectedImg] = useState<AlbumItemImage | null>(null) // 非多选的时候查看图片大图的url
  const [viewDetail, setViewDetail] = useState(false) // 查看图片详情

  // 收藏夹信息
  const [description, setDescription] = useState(
    albumList.find((item: AlbumItem) => item.collection_id + "" === params.item)?.description
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
      const [err, res] = await errorCaptureRes(queryAllImageInAlbum, { collection_id: +params.item })

      // 把图片根据日期进行分栏
      // 日期要从今往前排序
      if (err || (res && !res?.success)) {
        Alert.open({
          content: err.message ?? res.message
        })
      } else if (res.success && res.data?.length > 0) {
        const groupedByDate = new Map()

        res.data.forEach((item: any) => {
          const date = dayjs(item.added_at).format("YYYY-MM-DD")
          // 如果 Map 中还没有这个日期的键，初始化一个空数组
          if (!groupedByDate.has(date)) {
            groupedByDate.set(date, [])
          }
          // 将当前对象的 url 添加到对应日期的数组中
          groupedByDate.get(date).push(item)
        })

        setOriginImgList(res.data)
        setImgGroupList(Object.fromEntries(groupedByDate))
      }

      console.log(res, "res")
    } catch (err: any) {
      Alert.open({
        content: err.message
      })
    }
  }

  // 删除收藏夹
  const handleDelete = async () => {
    const [err, res] = await errorCaptureRes(deleteAlbum, { collection_id: +params.item })

    if (err || (res && !res?.success)) {
      Alert.open({
        content: err.message ?? res.message
      })
    } else if (res.success) {
      router.back()
    }
  }

  // 选择模式下图片的选择、取消选择事件
  // 通过已选图片列表中是否有这个图片来判断是选择还是取消选择
  const handleImgSelect = (img: number) => {
    if (selectionMode) {
      if (selectedImgList.includes(img)) {
        setSelectedImgList(selectedImgList.filter(item => item !== img))
      } else {
        selectedImgList.push(img)
        setSelectedImgList(selectedImgList)
      }
    } else {
      setSelectedImg(originImgList.find(item => item.id === img) ?? null)
      setViewDetail(true)
    }

    forceUpdate()
  }

  // 关闭弹窗
  const closeDialog = () => {
    setDialogVisible(false)
  }

  // 下载图片
  const handleDownload = (defaultUrls?: string[]) => {
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

    if (Array.isArray(defaultUrls) && defaultUrls.length > 0) {
      downloadImage(defaultUrls)
    } else {
      if (selectedImgList.length > 0) {
        const imgUrls = originImgList.filter(item => selectedImgList.includes(item.id)).map(item => item.image_url)

        downloadImage(imgUrls)
      }
    }
  }

  // 取消收藏
  // defaultImages 需要同在一个收藏夹里
  const hanldeRemoveFromCollection = async (defaultImages?: AlbumItemImage[]) => {
    if (defaultImages) {
      const imgurls = defaultImages.map(img => img.image_url)
      const collection_id = defaultImages[0].collection_id

      const [err, res] = await errorCaptureRes(removeImgFromAlbum, { image_urls: imgurls, collection_id })

      if (err || (res && !res?.success)) {
        Alert.open({
          content: err.message ?? res.message
        })
      } else if (res.success) {
        setViewDetail(false)
        queryData()
      }
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
    <Container px={"0"} className="album-item-container">
      <Header
        handleIconClick={handleIconClick}
        collectionId={params.item}
        selectMode={selectionMode}
        handleSetSelectMode={handleSetSelectMode}
      />
      {/* 收藏夹名称 */}
      <Heading p={"0 1rem"} mb={"8pt"}>
        {(function () {
          const ablumData = albumList.find((item: AlbumItem) => item.collection_id + "" === params.item)

          return ablumData
            ? ablumData.is_default
              ? "Default Album"
              : ablumData.title
            : decodeURIComponent(searchParams.get("name") ?? "")
        })()}
      </Heading>
      {/* 收藏夹说明 */}
      <Show when={description}>
        <Box>
          <DescriptionBox>
            <Flex fontWeight={500} fontSize={"1.3rem"} alignItems={"center"} justifyContent={"flex-start"}>
              <Image
                boxSize={"2rem"}
                mr={"0.5rem"}
                src={"/assets/images/album/collectionDescription.svg"}
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
                src={"/assets/images/album/download.svg"}
                onClick={() => {
                  handleDownload()
                }}
                alt="download-icon"
              />
              <Image w={"22pt"} h={"22pt"} ml={"8pt"} src={"/assets/images/album/liked.svg"} alt="liked-icon" />
              <Image w={"22pt"} h={"22pt"} ml={"8pt"} src={"/assets/images/album/buy.svg"} alt="buy-icon" />
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

      <AlbumDrawer
        type="edit"
        collectionId={+params.item}
        visible={dialogVisible}
        close={closeDialog}
        onSuccess={onAblumEditSuccess}
      />

      <Show when={viewDetail && selectedImg}>
        <ImageViewer
          imgUrl={selectedImg?.image_url ?? ""}
          close={() => {
            setViewDetail(false)
          }}
          footer={
            <Flex alignItems={"center"} justifyContent={"flex-end"} mx={"1rem"} width={"100%"}>
              <Image
                boxSize={"2.2rem"}
                mx={"0.5rem"}
                onClick={() => {
                  handleDownload([selectedImg?.image_url ?? ""])
                }}
                src={"/assets/images/album/download.svg"}
                alt="download-icon"
              />
              <Image
                boxSize={"2.2rem"}
                mx={"0.5rem"}
                onClick={() => {
                  selectedImg && hanldeRemoveFromCollection([selectedImg])
                }}
                src={`/assets/images/album/liked.svg`}
                alt="liked-icon"
              />
              <Image boxSize={"2.2rem"} mx={"0.5rem"} src={"/assets/images/album/buy.svg"} alt="buy-icon" />
              <Button ml={"0.5rem"} bgColor={"#ee3939"} borderRadius={"40px"}>
                Further Generate
              </Button>
            </Flex>
          }
        />
      </Show>
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

export default ({ params }: AlbumItemProps) => {
  return <Album params={params} />
}
