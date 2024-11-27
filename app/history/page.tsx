"use client"
import { useEffect, useState, useReducer } from "react"
import dayjs from "dayjs"
import styled from "@emotion/styled"
import { useDebounceFn } from "ahooks"
import { Provider } from "react-redux"

import { Container, Box, For, Image, Flex, Show, Text, Button } from "@chakra-ui/react"

import ImageViewer from "@components/ImageViewer"
import ImageGroupByData from "@components/ImageGroupByDate"

import NoSelect from "@img/generate-result/no-select.svg"
import Selected from "@img/generate-result/selected.svg"

import Header from "./components/Header"
import { Alert } from "@components/Alert"

import { HistoryItem } from "@definitions/history"
import { storage, errorCaptureRes } from "@utils/index"
import { store } from "@store/index"

// 接口 - 收藏夹列表
import { queryHistory, removeImgFromAlbum } from "@lib/request/history"
import useAddImageToAlbum from "@hooks/useAddImageToAlbum"

type GroupList = {
  [key: string]: HistoryItem[]
}

function Page() {
  const [selectionMode, setSelectionMode] = useState<boolean>(false) // 用于标记是否进入多选状态
  // 把图片按日期分组
  const [imgGroupList, setImgGroupList] = useState<GroupList>({})
  // 分组前的图片列表
  const [originImgList, setOriginImgList] = useState<HistoryItem[]>([])
  const [lastImageId, setLastImageId] = useState<number | undefined>()
  const [loading, setLoading] = useState<boolean>(false)

  const [selectedImgList, setSelectedImgList] = useState<number[]>([]) // 多选图片列表
  const [selectedImg, setSelectedImg] = useState<HistoryItem | null>(null) // 非多选的时候查看图片大图的url
  const [isAllSelected, setIsAllSelected] = useState<boolean>(false)

  // 弹窗visible

  const [viewDetail, setViewDetail] = useState(false) // 查看图片详情

  // 懒加载
  const [offset, setOffset] = useState(0)
  const [limit, setLimit] = useState(40) // 第一次加载40张

  const [, forceUpdate] = useReducer(x => x + 1, 0)

  const { handldeSetImage, AddImageToAlbum } = useAddImageToAlbum()

  const handleSetSelectMode = (mode: any) => {
    setSelectionMode(mode)

    // 取消之后清空已选图片
    if (!mode) {
      setSelectedImgList([])
    }
  }

  // 选择模式下图片的选择、取消选择事件
  // 通过已选图片列表中是否有这个图片来判断是选择还是取消选择
  const handleImgSelect = (img: number) => {
    // 多选态
    if (selectionMode) {
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
    }
    // 不处于多选态时查看图片的大图
    else {
      setSelectedImg(originImgList.find(item => item.history_id === img) ?? null)
      setViewDetail(true)
    }

    forceUpdate()
  }

  const queryData = async () => {
    const user_id = storage.get("user_id")

    if (user_id) {
      const params = {
        user_id: +user_id as number,
        start_date: dayjs().subtract(1, "year").format("YYYY-MM-DD"),
        end_date: dayjs().add(1, "day").format("YYYY-MM-DD"),
        offset,
        limit
      }
      const [err, res] = await errorCaptureRes(queryHistory, params)

      // 把图片根据日期进行分栏
      // 日期要从今往前排序
      if (err || (res && !res?.success)) {
        Alert.open({
          content: err.message ?? res.message
        })
      } else if (res?.success && res?.data?.length > 0) {
        setOffset(offset + res.data.length)
        setLimit(20) //第一次之后每次只加载 20 张

        const groupedByDate = new Map()

        const oriImgList = [...originImgList, ...res.data]
        setOriginImgList(oriImgList)

        oriImgList.forEach((item: any) => {
          const date = dayjs(item.created_date).format("YYYY-MM-DD")
          // 如果 Map 中还没有这个日期的键，初始化一个空数组
          if (!groupedByDate.has(date)) {
            groupedByDate.set(date, [])
          }
          // 将当前对象的 url 添加到对应日期的数组中
          groupedByDate.get(date).push(item)
        })

        setImgGroupList(Object.fromEntries(groupedByDate))

        // 这里取倒数第10张图片开始加载下一组
        setLastImageId(oriImgList.at(-10)?.history_id ?? oriImgList.at(-1)?.history_id)

        // 重置一下选中的图片的数据
        selectedImg &&
          setSelectedImg(oriImgList.find((item: HistoryItem) => item.history_id === selectedImg.history_id))
      }
    }
  }

  const hanldeLastImageInView = () => {
    queryData()
  }

  // 批量收藏
  const { run: handleCollect } = useDebounceFn(
    async () => {
      handldeSetImage(
        selectedImgList
          .map(id => {
            const img = originImgList.find(item => item.history_id === id)

            if (img) {
              return { collection_id: img?.collection_id ?? 0, image_url: img?.image_url ?? "" }
            }

            return null
          })
          .filter(item => item !== null)
      )
    },
    { wait: 500 }
  )

  // 下载
  const handleDownload = (defaultUrls?: string[]) => {
    const downloadImage = (url: string) => {
      if (!url) {
        console.error("Invalid image URL")
        return
      }

      const link = document.createElement("a")
      link.href = url?.split("?")[0]
      link.download = url.split("/").pop() || "download" // 提取文件名，如果没有文件名则使用 'download'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    // 传参进来说明不是多选模式的批量下载
    if (Array.isArray(defaultUrls) && defaultUrls.length > 0) {
      defaultUrls.forEach(img => {
        downloadImage(img)
      })
    } else {
      if (selectedImgList.length > 0) {
        const imgUrls = originImgList
          .filter(item => selectedImgList.includes(item.history_id))
          .map(item => item.image_url)

        imgUrls.forEach(img => {
          downloadImage(img)
        })
      }
    }
  }

  // 取消收藏
  // defaultImages 需要同在一个收藏夹里
  const hanldeRemoveFromCollection = async (defaultImages?: HistoryItem[]) => {
    if (defaultImages) {
      const imgurls = defaultImages.map(img => img.image_url)
      const collection_id = defaultImages[0].collection_id

      const [err, res] = await errorCaptureRes(removeImgFromAlbum, { image_urls: imgurls, collection_id })

      if (err || (res && !res?.success)) {
        Alert.open({
          content: err.message ?? res.message
        })
      } else if (res.success) {
        queryData()
        // todo 做成懒加载之后就不应该刷新接口而是把图片从imagelist中去除
      }
    }
  }

  useEffect(() => {
    // fetchCollectionList
    queryData()
  }, [])

  return (
    <Container p={0}>
      {/* <Toaster /> */}
      <Header selectionMode={selectionMode} handleSetSelectMode={handleSetSelectMode} />
      <Box px={"1rem"} position={"relative"}>
        <For each={Object.entries(imgGroupList)}>
          {([date, urls], index: number): React.ReactNode => {
            return (
              <ImageGroupByData
                imgKey="history_id"
                key={index}
                date={date}
                imageList={urls}
                selectionMode={selectionMode}
                selectedImageList={selectedImgList}
                handleSelect={handleImgSelect}
                lastImageId={lastImageId}
                hanldeLastImageInView={hanldeLastImageInView}
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
                if (isAllSelected) {
                  setSelectedImgList([])
                } else {
                  setSelectedImgList(originImgList.map(item => item.history_id))
                }
                setIsAllSelected(!isAllSelected)
              }}
            >
              <Image
                boxSize="16pt"
                src={isAllSelected ? Selected.src : NoSelect.src}
                border="0.06rem solid #BFBFBF"
                backdropFilter="blur(50px)"
                borderRadius={"50%"}
              />
              <Text>Select all</Text>
            </Flex>
            <Flex alignItems={"center"} justifyContent={"flex-start"}>
              <StyledImage
                selectedImgList={selectedImgList}
                onClick={() => {
                  handleDownload()
                }}
                src={"/assets/images/album/download.svg"}
                alt="download-icon"
              />
              <StyledImage
                selectedImgList={selectedImgList}
                onClick={handleCollect}
                src={"/assets/images/album/unliked.svg"}
                alt="liked-icon"
              />
              <StyledImage selectedImgList={selectedImgList} src={"/assets/images/album/buy.svg"} alt="buy-icon" />
            </Flex>
          </Flex>
        </Box>
      </Show>

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
                  if (selectedImg) {
                    // 如果没有被收藏
                    if (/^0$/.test(selectedImg?.collection_id + "")) {
                      setSelectedImgList([selectedImg.history_id])

                      handleCollect()
                    } else {
                      hanldeRemoveFromCollection([selectedImg])
                    }
                  }
                }}
                src={`/assets/images/album/${/^0$/.test(selectedImg?.collection_id + "") ? "unliked" : "liked"}.svg`}
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

      <AddImageToAlbum />
    </Container>
  )
}

interface StyledImageProps {
  selectedImgList: number[]
}
const StyledImage = styled(Image)<StyledImageProps>`
  width: 28pt;
  height: 28pt;
  margin: 0 8pt;

  opacity: ${props => (props.selectedImgList.length <= 0 ? "0.4" : "unset")};
  transition: opacity 0.5s ease;
`

export default () => {
  return (
    <Provider store={store}>
      <Page />
    </Provider>
  )
}
