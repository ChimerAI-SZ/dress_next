import React, { useState, useEffect, useId } from "react"
import { Box, Flex, Text, Grid, GridItem, Image, Input } from "@chakra-ui/react"
import ReactLoading from "react-loading"
import useAliyunOssUpload from "@hooks/useAliyunOssUpload"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/pagination"
import Add from "@img/upload/add2.svg"
import Delete from "@img/upload/delete.svg"
import { TypesClothingProps } from "@definitions/update"
import { fetchHomePage } from "@lib/request/page"
import { errorCaptureRes } from "@utils/index"
const PatternSelector = ({ onParamsUpdate, flied }: TypesClothingProps) => {
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)
  const { uploadToOss, isUploading, uploadProgress, uploadedUrl } = useAliyunOssUpload()
  const uniqueId = useId()
  const [activeIndex, setActiveIndex] = useState(0)

  const [urlList, setUrlList] = useState<{ image_url: string; tags: string; selected?: boolean }[]>([])
  const itemsPerPage = activeIndex === 0 ? 7 : 8
  const totalPages = Math.ceil(total / itemsPerPage)
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        await uploadToOss(file)
      } catch (err) {}
    }
  }
  const handleImageDelete = (src: string) => {
    setUrlList(prevList => prevList.filter(item => item?.image_url !== src))
  }
  const fetchData = async (index?: number) => {
    const [err, res] = await errorCaptureRes(fetchHomePage, {
      limit: index === 0 ? 7 : 8,
      offset: (index || 0) * (index === 0 ? 7 : 8),
      library: flied ? "fabric" : "print"
    })
    if (res?.success) {
      const newImages = res?.data
      setTotal(res.total)
      setUrlList(prev => [...prev, ...newImages])
    }
  }
  useEffect(() => {
    if (uploadProgress === 100) {
      setUrlList(prevList => {
        if (typeof uploadedUrl === "string") {
          // 确保 uploadedUrl 是 string 类型
          // 检查是否有 selected: true 的项
          const selectedIndex = prevList.findIndex(item => item.selected === true)

          if (selectedIndex !== -1) {
            // 如果找到了 selected: true 的项，替换它
            const updatedList = [...prevList]
            updatedList[selectedIndex] = {
              image_url: uploadedUrl, // 现在可以安全地赋值了
              tags: "upload",
              selected: true // 保持 selected 为 true
            }
            return updatedList
          } else {
            // 如果没有 selected: true 的项，直接添加上传的 URL 到列表的开头，selected 默认为 true
            return [{ image_url: uploadedUrl, tags: "upload", selected: true }, ...prevList]
          }
        } else {
          // 如果 uploadedUrl 不是有效的字符串，可以选择返回原始列表或其他处理方式
          console.error("Uploaded URL is not valid")
          return prevList
        }
      })
    }
  }, [uploadProgress])

  useEffect(() => {
    fetchData()
  }, [])
  const handleSelectImage = (url: string) => {
    setUrlList(prevList => {
      return prevList.map(item => {
        if (item.image_url === url) {
          // 如果该项已经被选中，点击时取消选中
          const updatedItem = { ...item, selected: !item.selected }

          return updatedItem
        } else {
          // 其他项都取消选中
          return { ...item, selected: false }
        }
      })
    })
  }

  // 使用 useEffect 来处理状态更新
  useEffect(() => {
    const selectedItem = urlList.find(item => item.selected)

    if (selectedItem) {
      // 如果某项被选中，更新参数
      if (flied) {
        onParamsUpdate({ loadFabricImage: selectedItem.image_url })
      } else {
        onParamsUpdate({ loadPrintingImage: selectedItem.image_url })
      }
    } else {
      if (flied) {
        onParamsUpdate({ loadFabricImage: "" })
      } else {
        onParamsUpdate({ loadPrintingImage: "" })
      }
    }
  }, [urlList, flied]) // 监听 urlList 和 flied 的变化

  return (
    <Flex w="full" flexDirection={"column"}>
      <Box h={"11rem"} overflow={"hidden"}>
        <Swiper
          onSlideChange={swiper => {
            console.log(Math.floor(urlList.length / 8), swiper.activeIndex)
            if (Math.floor(urlList.length / 8) <= swiper.activeIndex) {
              fetchData(swiper.activeIndex)
            }
            setActiveIndex(swiper.activeIndex)
          }}
        >
          {[...Array(totalPages)].map((_, pageIndex) => (
            <SwiperSlide key={pageIndex}>
              <Grid templateColumns="repeat(4, 1fr)" gap={2} pt={"0.75rem"} position={"relative"}>
                {pageIndex === 0 && (
                  <Box position="relative">
                    <Input
                      type="file"
                      accept="image/*"
                      display="none"
                      id={uniqueId}
                      onChange={e => handleImageChange(e)}
                    />
                    <label htmlFor={uniqueId}>
                      <Box
                        w="4.69rem"
                        h="4.69rem"
                        borderRadius="0.5rem"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        background="#F5F5F5"
                      >
                        <Image src={Add.src} alt="Like" h="1.05rem" w="1.06rem" cursor="pointer" />
                      </Box>
                    </label>
                  </Box>
                )}
                {isUploading && pageIndex === 0 && (
                  <Box
                    w="4.69rem"
                    h="4.69rem"
                    borderRadius="0.5rem"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    background="rgba(23,23,23,0.6);"
                  >
                    <ReactLoading type={"spinningBubbles"} color={"#ffffff"} height={"1.38rem"} width={"1.38rem"} />
                  </Box>
                )}

                {urlList.slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage).map((item, index) => (
                  <GridItem
                    key={item.image_url + index}
                    position="relative"
                    w="4.68rem"
                    h="4.67rem"
                    borderRadius="0.5rem"
                    onClick={() => handleSelectImage(item.image_url)}
                    border={item.selected ? "1px solid #dd4d4d" : "1px solid transparent"}
                    zIndex={33}
                  >
                    <Image
                      src={`${item.image_url}`}
                      alt={`Small Image ${index + 1}`}
                      w="4.68rem"
                      h="4.5rem"
                      objectFit="cover"
                      cursor="pointer"
                      borderRadius="0.5rem"
                    />
                    {item.tags === "upload" ? (
                      <Image
                        src={Delete.src}
                        alt={`Small Image ${index + 1}`}
                        w="1rem"
                        h="1rem"
                        position="absolute"
                        top={"-0.5rem"}
                        right={"-0.5rem"}
                        zIndex={22}
                        cursor={"pointer"}
                        onClick={e => {
                          e.stopPropagation()
                          handleImageDelete(item.image_url)
                        }}
                      />
                    ) : (
                      <Flex
                        align="center"
                        justify="center"
                        position="absolute"
                        bottom="0"
                        w="full"
                        background={item.selected ? "rgba(213,32,32,0.85)" : "rgba(23,23,23,0.6)"}
                        borderRadius="0rem 0rem 0.4rem 0.4rem"
                        px={"0.2rem"}
                      >
                        <Text
                          fontFamily="PingFangSC, PingFang SC"
                          color="white"
                          fontSize="0.69rem"
                          whiteSpace="normal"
                          wordBreak="break-word"
                          fontWeight="400"
                          textAlign={"center"}
                        >
                          {item.tags}
                        </Text>
                      </Flex>
                    )}
                  </GridItem>
                ))}
              </Grid>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
      <Flex justifyContent="center" mt={4} gap={2}>
        {[...Array(totalPages)].map((_, index) => (
          <Box
            key={index}
            width={index === activeIndex ? "1rem" : "0.44rem"}
            height="0.44rem"
            bg={index === activeIndex ? "#EE3939" : "#E5E5E5"}
            borderRadius="0.22rem"
            transition="width 0.3s, background-color 0.3s"
          />
        ))}
      </Flex>
    </Flex>
  )
}

export default PatternSelector
