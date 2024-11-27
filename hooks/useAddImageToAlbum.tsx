import React, { useState } from "react"

import { Box, For, Image, Flex, Show, Text, CheckboxGroup, Fieldset, Button } from "@chakra-ui/react"
import { Checkbox } from "@components/ui/checkbox"

import { Alert } from "@components/Alert"
import Toast from "@components/Toast"
import AlbumDrawer from "../app/album/components/AlbumDrawer"

import { storage, errorCaptureRes } from "@utils/index"
import { queryAlbumList } from "@lib/request/album" // 查询收藏夹列表的接口
import { addImgToAlbum } from "@lib/request/history"
import { AlbumItem } from "@definitions/album"

import ModalRight from "@img/generate-result/modal-right.svg"
import ModalBack from "@img/generate-result/modal-back.svg"
import addIcon from "@img/album/addIcon.svg"

interface originImageType {
  collection_id: number // 图片所在的收藏夹id
  image_url: string // 图片url
}

const useAddImageToAlbum = () => {
  const [originImage, setOriginImage] = useState<originImageType[]>([]) // 要收藏的图片 url 列表
  const [albumList, setAlbumList] = useState<AlbumItem[]>([]) // 收藏夹列表
  const [selectedAlbum, setSelectedAlbum] = useState<string[]>([]) // 添加到收藏夹时选中的收藏夹

  // 弹窗 visible
  const [collectSuccessVisible, setCollectSuccessVisible] = useState(false) // 收藏成功的 toast 的弹窗
  const [dialogVisible, setDialogVisible] = useState(false) // 新增收藏夹弹窗
  const [collectionSelectorVisible, setCollectionSelectorVisible] = useState(false) // 选择收藏夹

  const handleCollect = async (imgList: originImageType[]) => {
    const user_id = storage.get("user_id")

    if (user_id && imgList.length > 0) {
      const [err, res] = await errorCaptureRes(queryAlbumList, { user_id: +user_id as number })

      if (err || (res && !res?.success)) {
        Alert.open({
          content: err.message ?? res.message
        })
      } else if (res?.success && res.data?.length > 0) {
        setAlbumList(res.data)

        // 虽然没有 is_default 的情况很夸张，但是测试环境真的遇到了！！！
        // 默认把图片添加到默认收藏夹
        const defalutCollection = res.data.find((item: AlbumItem) => item.is_default) ?? res.data[0]
        // 过滤掉已经在默认收藏夹里的图片
        const imgUrls = imgList
          .filter(item => item.collection_id !== defalutCollection.collection_id) // 过滤掉已经在默认收藏夹中的图片
          .map(item => item.image_url)
        const params = {
          collection_id: defalutCollection.collection_id,
          image_urls: imgUrls
        }

        if (imgUrls.length > 0) {
          const [err, res] = await errorCaptureRes(addImgToAlbum, params)
          if (err || (res && !res?.success)) {
            Alert.open({
              content: err.message ?? res.message
            })
          } else if (res?.success) {
            setCollectSuccessVisible(true)
          }
        } else {
          // 如果都已经在了的话
          setCollectSuccessVisible(true)
        }
      }
    }
  }

  const batchAddToCollection = async () => {
    Promise.all(
      selectedAlbum.map(item => {
        const imgUrls = originImage
          .filter(subItem => "" + subItem.collection_id !== item) // 过滤掉已经在默认收藏夹中的图片
          .map(item => item.image_url)
        const params = {
          collection_id: Number(item),
          image_urls: imgUrls
        }
        return addImgToAlbum(params)
      })
    ).then(() => {
      setCollectionSelectorVisible(false)
    })
  }

  // 获取要添加到收藏夹的图片
  const handldeSetImage = (imgList: originImageType[]) => {
    setOriginImage(imgList)

    handleCollect(imgList)
  }

  const AddImageToAlbum = (): React.JSX.Element => {
    return (
      <div>
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
                <Image src={"/assets/images/album/closeIcon.svg"} boxSize={"14pt"} />
              </Flex>
              <Text fontSize={"1.06rem"} fontWeight={"500"} font-size="1.06rem" color="#171717">
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
                  setSelectedAlbum(value)
                }}
              >
                <Fieldset.Content>
                  <For each={albumList}>
                    {(item: AlbumItem) => <Checkbox value={item.collection_id + ""}>{item.title}</Checkbox>}
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
              width: "75vw",
              bottom: "10vh",
              top: "unset",
              padding: "12pt"
            }}
          >
            <Flex justifyContent={"space-between"} alignItems={"center"}>
              <Flex alignItems={"center"} gap={"0.56rem"}>
                <Image src={ModalRight.src} boxSize={"1.38rem"}></Image>
                <Text fontWeight="400" fontSize="0.88rem" lineHeight={"1.38rem"} color="#171717">
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

        <AlbumDrawer
          type="add"
          visible={dialogVisible}
          close={() => {
            setDialogVisible(false)
          }}
          onSuccess={(newCollection: any) => {
            albumList.push(newCollection)
            setAlbumList(albumList)

            setDialogVisible(false)
            setCollectionSelectorVisible(true)
          }}
        />
      </div>
    )
  }

  return {
    handldeSetImage,
    AddImageToAlbum
  }
}

export default useAddImageToAlbum
