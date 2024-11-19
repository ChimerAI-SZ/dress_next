"use client"
import { useEffect, useState, useReducer } from "react"
import dayjs from "dayjs"
import styled from "@emotion/styled"
import { Provider } from "react-redux"

import { Container, Box, For, Image, Flex, Show, Text, CheckboxGroup, Fieldset, Button } from "@chakra-ui/react"
import { Checkbox } from "@components/ui/checkbox"

import ImageGroupByData from "@components/ImageGroupByDate"
import CollectionDialog from "../favorites/components/AlbumDrawer"

import NoSelect from "@img/generate-result/no-select.svg"
import Selected from "@img/generate-result/selected.svg"
import ModalRight from "@img/generate-result/modal-right.svg"
import ModalBack from "@img/generate-result/modal-back.svg"
import addIcon from "@img/favourites/addIcon.svg"

import Header from "./components/Header"
import Toast from "@components/Toast"
import { Alert } from "@components/Alert"

import { FavouriteItem } from "@definitions/favourites"
import { HistoryItem } from "@definitions/history"
import { storage } from "@utils/index"
import { store } from "../favorites/store"

// 接口 - 收藏夹列表
import { queryCollectionList } from "@lib/request/favourites"
import { queryHistory, addImgToFavourite } from "@lib/request/history"

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

  const [collectionList, setCollectionList] = useState<any[]>([])
  const [selectedCollection, setSelectedCollection] = useState<string[]>([]) // 添加到收藏夹时选中的收藏夹

  // 弹窗visible
  const [dialogVisible, setDialogVisible] = useState(false) // 新增收藏夹弹窗
  const [collectSuccessVisible, setCollectSuccessVisible] = useState(false) // 收藏成功弹窗
  const [collectionSelectorVisible, setCollectionSelectorVisible] = useState(false) // 选择收藏夹

  const [, forceUpdate] = useReducer(x => x + 1, 0)

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

      if (user_id) {
        const params = {
          user_id: +user_id as number,
          start_date: dayjs().subtract(1, "year").format("YYYY-MM-DD"),
          end_date: dayjs().add(1, "day").format("YYYY-MM-DD")
        }
        const { message, data, success } = await queryHistory(params)

        // 把图片根据日期进行分栏
        // 日期要从今往前排序
        if (success && data?.length > 0) {
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
      }
    } catch (err: any) {
      // todo error hanlder
    }
  }

  // 批量收藏
  const handleCollect = async () => {
    const user_id = storage.get("user_id")

    if (user_id && selectedImgList.length > 0) {
      const { message, data: collectionList, success } = await queryCollectionList({ user_id: +user_id })

      if (success && collectionList?.length > 0) {
        setCollectionList(collectionList)

        // 虽然没有 is_default 的情况很夸张，但是测试环境真的遇到了！！！
        const defalutCollection = collectionList.find((item: FavouriteItem) => item.is_default) ?? collectionList[0]
        const imgUrls = originImgList
          .filter(item => selectedImgList.includes(item.history_id))
          .filter(item => item.collection_id !== defalutCollection.collection_id) // 过滤掉已经在默认收藏夹中的图片
          .map(item => item.image_url)
        const params = {
          collection_id: defalutCollection.collection_id,
          image_urls: imgUrls
        }

        if (imgUrls.length > 0) {
          const { message, data, success } = await addImgToFavourite(params)

          if (success) {
            setCollectSuccessVisible(true)
          } else {
            Alert.open({
              content: message
            })
          }
        } else {
          // 如果都已经在了的话
          setCollectSuccessVisible(true)
        }
      } else {
        Alert.open({
          content: message
        })
      }
    }
  }

  const handleDownload = () => {
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

    if (selectedImgList.length > 0) {
      const imgUrls = originImgList
        .filter(item => selectedImgList.includes(item.history_id))
        .map(item => item.image_url)

      imgUrls.forEach(img => {
        downloadImage(img)
      })
    }
  }

  const batchAddToCollection = async () => {
    Promise.all(
      selectedCollection.map(item => {
        const imgUrls = originImgList
          .filter(item => selectedImgList.includes(item.history_id))
          .filter(subItem => "" + subItem.collection_id !== item) // 过滤掉已经在默认收藏夹中的图片
          .map(item => item.image_url)
        const params = {
          collection_id: Number(item),
          image_urls: imgUrls
        }

        return addImgToFavourite(params)
      })
    ).then(() => {
      setCollectionSelectorVisible(false)
    })
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
              ></Image>
              <Text>Select all</Text>
            </Flex>
            <Flex alignItems={"center"} justifyContent={"flex-start"}>
              <StyledImage
                selectedImgList={selectedImgList}
                onClick={handleDownload}
                src={"/assets/images/favourites/download.svg"}
                alt="download-icon"
              />
              <StyledImage
                selectedImgList={selectedImgList}
                onClick={handleCollect}
                src={"/assets/images/favourites/unliked.svg"}
                alt="liked-icon"
              />
              <StyledImage selectedImgList={selectedImgList} src={"/assets/images/favourites/buy.svg"} alt="buy-icon" />
            </Flex>
          </Flex>
        </Box>
      </Show>

      {/* 选择收藏夹的弹窗 */}
      <Show when={collectionSelectorVisible}>
        <Toast
          close={() => {
            setCollectSuccessVisible(false)
          }}
          maskVisible={false}
          boxStyle={{
            boxShadow: "0px 2px 8px 0px rgba(17,17,17,0.12)",
            borderRadius: "16px 16px 0 0",
            width: "100vw",
            bottom: "0",
            left: "0",
            right: "0",
            top: "unset",
            transform: "unset",
            padding: "12pt",
            pt: "0",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <Flex alignItems={"center"} justifyContent={"space-between"} my={"8pt"}>
            <Flex
              onClick={() => {
                setCollectionSelectorVisible(false)
              }}
              boxSize={"22pt"}
              alignItems={"center"}
              justifyContent={"center"}
              fontSize={"1.5rem"}
              borderRadius={"50%"}
            >
              <Image src={"/assets/images/favourites/closeIcon.svg"} boxSize={"14pt"} />
            </Flex>
            <Text
              fontSize={"1.06rem"}
              fontWeight={"500"}
              font-family="PingFangSC, PingFang SC"
              font-size="1.06rem"
              color="#171717"
            >
              Select Albums
            </Text>
            <Flex
              onClick={() => {
                setCollectionSelectorVisible(false)
                setDialogVisible(true)
              }}
              boxSize={"20pt"}
              alignItems={"center"}
              justifyContent={"center"}
              fontSize={"1.5rem"}
              borderRadius={"50%"}
              border={"1px solid #BFBFBF"}
            >
              <Image src={addIcon.src} boxSize={"14pt"} alt="add icon" />
            </Flex>
          </Flex>
          <Fieldset.Root flexGrow={1} maxH={"30vh"} minH={"20vh"} overflow={"auto"}>
            <CheckboxGroup
              onValueChange={value => {
                setSelectedCollection(value)
              }}
            >
              <Fieldset.Content>
                <For each={collectionList}>
                  {(item: FavouriteItem) => <Checkbox value={item.collection_id + ""}>{item.title}</Checkbox>}
                </For>
              </Fieldset.Content>
            </CheckboxGroup>
          </Fieldset.Root>
          <Box mt={"16pt"}>
            <Button w={"100%"} bgColor={"#ee3939"} borderRadius={"40px"} type="submit" onClick={batchAddToCollection}>
              Done
            </Button>
          </Box>
        </Toast>
      </Show>

      {/* 收藏成功弹窗 */}
      <Show when={collectSuccessVisible}>
        <Toast
          close={() => {
            setCollectSuccessVisible(false)
          }}
          maskVisible={false}
          boxStyle={{
            boxShadow: "0px 2px 8px 0px rgba(17,17,17,0.12)",
            borderRadius: "8px",
            width: "70vw",
            bottom: "10vh",
            top: "unset",
            padding: "12pt"
          }}
        >
          <Flex justifyContent={"space-between"} alignItems={"center"}>
            <Flex alignItems={"center"} gap={"0.56rem"}>
              <Image src={ModalRight.src} boxSize={"1.38rem"}></Image>
              <Text fontWeight="400" fontSize="0.88rem" color="#171717">
                Collect in Default
              </Text>
            </Flex>
            <Flex alignItems={"center"} gap={"0.56rem"}>
              <Text
                fontWeight="400"
                fontSize="0.88rem"
                color="#EE3939"
                onClick={() => {
                  // 关闭收藏成功的提示，打开选择收藏夹的底部抽屉
                  setCollectSuccessVisible(false)
                  setCollectionSelectorVisible(true)
                }}
              >
                Move to
              </Text>
              <Image src={ModalBack.src} boxSize={"1rem"} />
            </Flex>
          </Flex>
        </Toast>
      </Show>

      <CollectionDialog
        type="add"
        visible={dialogVisible}
        close={() => {
          setDialogVisible(false)
        }}
        onSuccess={(newCollection: any) => {
          collectionList.push(newCollection)
          setCollectionList(collectionList)

          setDialogVisible(false)
          setCollectionSelectorVisible(true)
        }}
      />
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

const CollectionSelector = styled.div`
  position
`

export default () => {
  return (
    <Provider store={store}>
      <Page />
    </Provider>
  )
}
