"use client"

import { useState, useEffect } from "react"
import { Button, Box, Image, Flex, Text, Show, CheckboxGroup, Fieldset, For } from "@chakra-ui/react"
import { Checkbox } from "@components/ui/checkbox"
import { Toaster, toaster } from "@components/Toaster"
import { Provider } from 'react-redux'

import { store } from '../favorites/store'
import Toast from "@components/Toast"
import CollectionDialog from "../favorites/components/AlbumDrawer"

import Header from "@components/Header"
import Download from "@img/generate-result/download.png"
import Like from "@img/generate-result/like.png"
import Shop from "@img/generate-result/shop.png"
import Liked from "@img/generate-result/liked.svg"
import NoSelect from "@img/generate-result/no-select.svg"
import Selected from "@img/generate-result/selected.svg"
import ModalRight from "@img/generate-result/modal-right.svg"
import ModalBack from "@img/generate-result/modal-back.svg"
import addIcon from "@img/favourites/addIcon.svg"

import ToastTest from "@components/ToastTest"
import { FavouriteItem } from "@definitions/favourites" // 收藏夹type
import { errorCaptureRes, storage } from "@utils/index"
import { useSearchParams, useRouter } from "next/navigation"
import { fetchShoppingAdd, fetchAddImage, collectionsList } from "@lib/request/generate-result"
import AllNo from "@img/generate-result/all-no.svg"
import { Alert } from "@components/Alert"
function Page() {
  const router = useRouter() //
  const userId = storage.get("user_id")
  console.log(userId)
  const searchParams = useSearchParams()
  const params = Object.fromEntries(searchParams.entries())
  const [imageList, setImageList] = useState<string[]>(JSON.parse(params.imageList))
  const [selectImage, setSelectImage] = useState(imageList[0])
  const [likeList, setLikeList] = useState<string[]>([])
  const [originImage, setOriginImage] = useState(params.loadOriginalImage)
  const [isAllSelected, setIsAllSelected] = useState(false)
  const [active, setActive] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [make, setMake] = useState(0)
  const [jionLike, setJionLike] = useState<string[]>([])

  // 弹窗visible
  const [collectSuccessVisible, setCollectSuccessVisible] = useState(false) // 收藏成功弹窗
  const [collectionSelectorVisible, setCollectionSelectorVisible] = useState(false) // 选择收藏夹
  const [dialogVisible, setDialogVisible] = useState(false) // 新增收藏夹弹窗

  const [collectionList, setCollectionList] = useState<any[]>([]) // 收藏夹列表
  const [selectedCollection, setSelectedCollection] = useState<string[]>([]) // 添加到收藏夹时选中的收藏夹

  const openDialog = () => {
    if (userId === null) {
      toaster.create({
        description: (
          <Flex justifyContent={"space-between"} alignItems={"center"}>
            <Flex alignItems={"center"} gap={"0.56rem"}>
              <Text fontFamily="PingFangSC, PingFang SC" fontWeight="400" fontSize="0.88rem" color="#171717">
                Login to have generation history
              </Text>
            </Flex>
            <Flex
              alignItems={"center"}
              gap={"0.56rem"}
              onClick={() => {
                router.push("/login")
              }}
            >
              <Text fontFamily="PingFangSC, PingFang SC" fontWeight="400" fontSize="0.88rem" color="#EE3939">
                Log in
              </Text>
              <Image src={ModalBack.src} boxSize={"1rem"}></Image>
            </Flex>
          </Flex>
        )
      })
      return
    }

    setIsOpen(true)
  }
  const fetchData = async (list: string[]) => {
    if (userId === null) {
      toaster.create({
        description: (
          <Flex justifyContent={"space-between"} alignItems={"center"}>
            <Flex alignItems={"center"} gap={"0.56rem"}>
              <Text fontFamily="PingFangSC, PingFang SC" fontWeight="400" fontSize="0.88rem" color="#171717">
                Login to have generation history
              </Text>
            </Flex>
            <Flex
              alignItems={"center"}
              gap={"0.56rem"}
              onClick={() => {
                router.push("/login")
              }}
            >
              <Text fontFamily="PingFangSC, PingFang SC" fontWeight="400" fontSize="0.88rem" color="#EE3939">
                Log in
              </Text>
              <Image src={ModalBack.src} boxSize={"1rem"}></Image>
            </Flex>
          </Flex>
        )
      })
      return
    }
    const [err, res] = await errorCaptureRes(fetchShoppingAdd, {
      user_id: +userId as number,
      img_urls: list,
      phone: phoneNumber
    })
    if (err) {
      Alert.open({
        content: "error request process!"
      })
    }
    if (res?.success) {
      console.log(1)
    } else {
      Alert.open({
        content: res.message
      })
    }
  }

  const fetchCollectionsList = async () => {
    if (userId === null) {
      toaster.create({
        description: (
          <Flex justifyContent={"space-between"} alignItems={"center"}>
            <Flex alignItems={"center"} gap={"0.56rem"}>
              <Text fontFamily="PingFangSC, PingFang SC" fontWeight="400" fontSize="0.88rem" color="#171717">
                Login to have generation history
              </Text>
            </Flex>
            <Flex
              alignItems={"center"}
              gap={"0.56rem"}
              onClick={() => {
                router.push("/login")
              }}
            >
              <Text fontFamily="PingFangSC, PingFang SC" fontWeight="400" fontSize="0.88rem" color="#EE3939">
                Log in
              </Text>
              <Image src={ModalBack.src} boxSize={"1rem"}></Image>
            </Flex>
          </Flex>
        )
      })
      return
    }
    const [err, res] = await errorCaptureRes(collectionsList, {
      user_id: +userId as number
    })
    if (err) {
      Alert.open({
        content: "error request process!"
      })
    }
    if (res?.success) {
      console.log(1)
    } else {
      Alert.open({
        content: res.message
      })
    }
  }

  const AddImage = async (list: string[]) => {
    if (userId === null) {
      toaster.create({
        description: (
          <Flex justifyContent={"space-between"} alignItems={"center"}>
            <Flex alignItems={"center"} gap={"0.56rem"}>
              <Text fontFamily="PingFangSC, PingFang SC" fontWeight="400" fontSize="0.88rem" color="#171717">
                Login to have generation history
              </Text>
            </Flex>
            <Flex
              alignItems={"center"}
              gap={"0.56rem"}
              onClick={() => {
                router.push("/login")
              }}
            >
              <Text fontFamily="PingFangSC, PingFang SC" fontWeight="400" fontSize="0.88rem" color="#EE3939">
                Log in
              </Text>
              <Image src={ModalBack.src} boxSize={"1rem"}></Image>
            </Flex>
          </Flex>
        )
      })
      return
    }
    const [err, res] = await errorCaptureRes(collectionsList, {
      user_id: +userId as number
    })
    let defaultCollectionIds = []
    console.log(res.data)
    if (res) {
      // 筛选出 is_default 为 true 的 collection
      const defaultCollection = res.data.filter((collection: { is_default: boolean }) => collection.is_default === true)

      // 提取 collection_id
      defaultCollectionIds = defaultCollection.map((collection: { collection_id: any }) => collection.collection_id)
    }
    const [err2, res2] = await errorCaptureRes(fetchAddImage, {
      image_urls: list,
      collection_id: defaultCollectionIds[0]
    })

    if (res2?.success) {
      setJionLike(pre => {
        return [...pre, ...list]
      })
    }
  }

  const affirmDialog = () => {
    setIsOpen(false)
    if (make) {
      fetchData(likeList)
    } else {
      fetchData([selectImage])
    }
  }
  const closeDialog = () => setIsOpen(false)
  const cb = (b: boolean) => {
    setActive(b)
  }

  // 批量添加到收藏夹
  const batchAddToCollection = async () => {
    // Promise.all(
    //   selectedCollection.map(item => {
    //     const imgUrls = originImgList
    //       .filter(item => selectedImgList.includes(item.history_id))
    //       .filter(subItem => "" + subItem.collection_id !== item) // 过滤掉已经在默认收藏夹中的图片
    //       .map(item => item.image_url)
    //     const params = {
    //       collection_id: Number(item),
    //       image_urls: imgUrls
    //     }
    //     return addImgToFavourite(params)
    //   })
    // ).then(() => {
    //   setCollectionSelectorVisible(false)
    // })
  }

  useEffect(() => {
    if (active) {
      setIsAllSelected(likeList.length === imageList.length && likeList.every(item => imageList.includes(item)))
    }
  }, [likeList])
  const downloadImage = (url: string) => {
    if (!url) {
      console.error("Invalid image URL")
      return
    }

    const link = document.createElement("a")
    link.href = url
    link.download = url.split("/").pop() || "download" // 提取文件名，如果没有文件名则使用 'download'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  return (
    <Box h="100vh" position={"relative"} pt={4} px="1rem">
      <Header show noTitle cb={cb}></Header>
      <Toaster />
      <Flex height="28.59rem" w={"full"} justifyContent={"center"}>
        <Box height="28.59rem" w={"21.44rem"} position={"relative"} borderRadius="0.63rem" border="0.03rem solid #CACACA" overflow={"hidden"}>
          <Image h={"100%"} w={"21.44rem"} objectFit={"cover"} src={selectImage}></Image>
          {!active && selectImage !== originImage && (
            <Flex position={"absolute"} bottom={0} right={"0"} gap={"1rem"} pb={"0.87rem"} pr={"0.87rem"}>
              <a href={selectImage} download>
                <Image boxSize={"2.25rem"} src={Download.src}></Image>
              </a>
              <Image
                boxSize={"2.25rem"}
                src={jionLike.includes(selectImage) ? Liked.src : Like.src}
                onClick={() => {
                  AddImage([selectImage])
                  toaster.create({
                    description: (
                      <Flex justifyContent={"space-between"} alignItems={"center"}>
                        <Flex alignItems={"center"} gap={"0.56rem"}>
                          <Image src={ModalRight.src} boxSize={"1.38rem"}></Image>
                          <Text fontFamily="PingFangSC, PingFang SC" fontWeight="400" fontSize="0.88rem" color="#171717">
                            Collect in Default
                          </Text>
                        </Flex>
                        <Flex alignItems={"center"} gap={"0.56rem"}>
                          <Text fontFamily="PingFangSC, PingFang SC" fontWeight="400" fontSize="0.88rem" color="#EE3939">
                            Move to
                          </Text>
                          <Image src={ModalBack.src} boxSize={"1rem"}></Image>
                        </Flex>
                      </Flex>
                    )
                  })
                }}
              ></Image>
              <Image
                boxSize={"2.25rem"}
                src={Shop.src}
                onClick={() => {
                  setMake(0)
                  openDialog()
                }}
              ></Image>
            </Flex>
          )}
        </Box>
      </Flex>
      <Flex mt={"1.38rem"} gap={"0.75rem"} overflowY={"auto"}>
        <Box
          position={"relative"}
          height="7.91rem"
          width="5.94rem"
          flexShrink={0}
          border={selectImage === originImage ? "0.09rem solid #ee3939" : "0.09rem solid #CACACA"}
          borderRadius="0.5rem"
          overflow={"hidden"}
        >
          <Box
            position={"absolute"}
            flexShrink={0}
            width="3.25rem"
            height="1.13rem"
            background={selectImage === originImage ? "#ee3939" : "#171717"}
            borderRadius="0.5rem 0rem 0.56rem 0rem"
            top={"0px"}
            left={"0px"}
          >
            <Text color="#FFFFFF" fontSize="0.63rem" textAlign={"center"}>
              Original
            </Text>
          </Box>
          <Image
            borderRadius="0.45rem"
            flexShrink={0}
            height="7.91rem"
            width="5.94rem"
            objectFit={"cover"}
            onClick={() => {
              setSelectImage(originImage)
            }}
            src={originImage}
          ></Image>
        </Box>
        {imageList.map((item, index) => {
          return (
            <Box
              flexShrink={0}
              border={selectImage === item ? "0.09rem solid #EE3939" : "0.09rem solid transparent"}
              borderRadius="0.5rem"
              key={item + index}
              overflow={"hidden"}
              position={"relative"}
            >
              <Image
                flexShrink={0}
                height="7.92rem"
                width="5.94rem"
                objectFit={"cover"}
                src={item}
                borderRadius="0.45rem"
                onClick={() => {
                  if (!active) {
                    setSelectImage(item)
                  } else {
                    setLikeList(prev => {
                      if (prev.includes(item)) {
                        return prev.filter(likeItem => likeItem !== item)
                      } else {
                        return [...prev, item]
                      }
                    })
                  }
                }}
              ></Image>
              {active && (
                <Image
                  flexShrink={0}
                  height="1rem"
                  width="1rem"
                  objectFit={"cover"}
                  src={likeList.includes(item) ? Selected.src : NoSelect.src}
                  position={"absolute"}
                  top={"0.38rem"}
                  right={"0.38rem"}
                ></Image>
              )}

              <Image flexShrink={0} height="1rem" width="1rem" objectFit={"cover"} src={Liked.src} position={"absolute"}></Image>
            </Box>
          )
        })}
      </Flex>
      <Box h={"4.75rem"}></Box>
      <Flex
        height="3.75rem"
        position="fixed"
        bottom="0"
        zIndex={111}
        bg={"#fff"}
        maxW="100vw"
        w={"full"}
        alignItems={"center"}
        justifyContent={"flex-end"}
        left="50%"
        transform="translateX(-50%)"
        borderRadius="0.75rem 0.75rem 0rem 0rem"
        boxShadow="0rem -0.06rem 0.31rem 0rem rgba(214,214,214,0.5)"
      >
        {active ? (
          <Flex justifyContent={"space-between"} width={"full"} h={"3.75rem"} alignItems={"center"} px={"1rem"}>
            <Flex
              gap={"0.53rem"}
              alignItems={"center"}
              onClick={() => {
                if (isAllSelected) {
                  setLikeList([])
                } else {
                  setLikeList(imageList)
                }
              }}
            >
              <Image
                boxSize="1.12rem"
                src={isAllSelected ? Selected.src : AllNo.src}
                // border="0.06rem solid #BFBFBF"
                backdropFilter="blur(50px)"
                borderRadius={"50%"}
              ></Image>
              <Text>Select all</Text>
            </Flex>
            <Flex gap={"1rem"}>
              <Flex
                width="2.5rem"
                height="2.5rem"
                background="rgba(255,255,255,0.5)"
                borderRadius="1.25rem"
                border="0.03rem solid #BFBFBF"
                backdropFilter="blur(50px)"
                alignItems={"center"}
                justifyContent={"center"}
                onClick={() => {
                  likeList.forEach(item => {
                    downloadImage(item)
                  })
                }}
              >
                <Image boxSize={"2.25rem"} src={Download.src}></Image>
              </Flex>
              <Flex
                width="2.5rem"
                height="2.5rem"
                background="rgba(255,255,255,0.5)"
                borderRadius="1.25rem"
                border="0.03rem solid #BFBFBF"
                backdropFilter="blur(50px)"
                alignItems={"center"}
                justifyContent={"center"}
              >
                <Image
                  boxSize={"2.25rem"}
                  src={Like.src}
                  onClick={() => {
                    console.log(111111111, selectImage, jionLike)
                    AddImage(likeList)
                  }}
                />
              </Flex>
              <Flex
                width="2.5rem"
                height="2.5rem"
                background="rgba(255,255,255,0.5)"
                borderRadius="1.25rem"
                border="0.03rem solid #BFBFBF"
                backdropFilter="blur(50px)"
                alignItems={"center"}
                justifyContent={"center"}
              >
                <Image
                  boxSize={"2.25rem"}
                  src={Shop.src}
                  onClick={() => {
                    setMake(1)
                    setIsOpen(true)
                  }}
                ></Image>
              </Flex>
            </Flex>
          </Flex>
        ) : (
          <Button
            colorScheme="teal"
            width="9.5rem"
            height="2.5rem"
            background="#EE3939"
            borderRadius="1.25rem"
            mr={"1rem"}
            // onClick={() => {
            //   router.push("/generate");
            // }}
          >
            Further Generate
          </Button>
        )}
      </Flex>
      <ToastTest isOpen={isOpen} phoneNumber={phoneNumber} onOpen={openDialog} onClose={closeDialog} affirmDialog={affirmDialog} setPhoneNumber={setPhoneNumber}></ToastTest>

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
            <Text fontSize={"1.2rem"} fontWeight={"500"}>
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
                <For each={collectionList}>{(item: FavouriteItem) => <Checkbox value={item.collection_id + ""}>{item.title}</Checkbox>}</For>
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
              <Text fontFamily="PingFangSC, PingFang SC" fontWeight="400" fontSize="0.88rem" color="#171717">
                Collect in Default
              </Text>
            </Flex>
            <Flex alignItems={"center"} gap={"0.56rem"}>
              <Text
                fontFamily="PingFangSC, PingFang SC"
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
        afterSuccess={(newCollection: any) => {
          collectionList.push(newCollection)
          setCollectionList(collectionList)

          setDialogVisible(false)
          setCollectionSelectorVisible(true)
        }}
      />
    </Box>
  )
}

export default () => {
  return (
    <Provider store={store}>
      <Page />
    </Provider>
  )
}