import React, { useState, useEffect, useId, memo, useCallback } from "react"
import { Box, Flex, Text, Grid, GridItem, Image, Input } from "@chakra-ui/react"
import ReactLoading from "react-loading"
import useAliyunOssUpload from "@hooks/useAliyunOssUpload"
import { Swiper, SwiperSlide } from "swiper/react"
import { Alert } from "@components/Alert"

import "swiper/css"
import "swiper/css/pagination"

import Add from "@img/upload/add2.svg"
import Delete from "@img/upload/delete.svg"

import { TypesClothingProps } from "@definitions/update"
import { fetchHomePage } from "@lib/request/page"
import { errorCaptureRes } from "@utils/index"

// 添加图片预加载
const preloadImage = (src: string) => {
  const img = document.createElement("img")
  img.src = src
}

const PatternSelector = memo(({ onParamsUpdate, flied }: TypesClothingProps) => {
  const [total, setTotal] = useState(0)
  const { uploadToOss, isUploading, uploadProgress, uploadedUrl } = useAliyunOssUpload()
  const uniqueId = useId()
  const [activeIndex, setActiveIndex] = useState(0)
  const [makr, setMakr] = useState(false)
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

    if (err || (res && !res?.success)) {
      Alert.open({
        content: err?.message || res?.message || "Interface Error"
      })
    } else if (res?.success) {
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
  const handleSelectImage = useCallback((url: string) => {
    setUrlList(prevList => {
      return prevList.map(item => ({
        ...item,
        selected: item.image_url === url ? !item.selected : false
      }))
    })
  }, [])

  // 使用 useEffect 来处理状态更新
  useEffect(() => {
    const selectedItem = urlList.find(item => item.selected)
    onParamsUpdate({
      [flied ? "loadFabricImage" : "loadPrintingImage"]: selectedItem?.image_url || undefined
    })
  }, [urlList, flied, onParamsUpdate])

  // 在组件内添加一个处理 tags 的辅助函数
  const formatTags = (tags: string) => {
    if (!tags) return ""
    // 先清理特殊字符，只保留字母、数字、空格和中文字符
    const cleanedTags = tags.replace(/[^\w\s\u4e00-\u9fff]/g, " ")
    // 处理多个空格为单个空格
    const normalizedTags = cleanedTags.replace(/\s+/g, " ").trim()
    const tagArray = normalizedTags.split(" ")
    if (tagArray.length <= 2) return normalizedTags
    return tagArray.slice(0, 2).join(" ")
  }

  // 预加载下一页图片
  useEffect(() => {
    if (urlList.length > 0) {
      const nextPageImages = urlList.slice(itemsPerPage, itemsPerPage * 2)
      nextPageImages.forEach(item => {
        preloadImage(item.image_url)
      })
    }
  }, [urlList, itemsPerPage])

  // 优化图片渲染
  const renderImage = useCallback(
    ({ item, index }: { item: any; index: number }) => (
      <GridItem
        key={item.image_url + index}
        position="relative"
        w="100%"
        h="4.69rem"
        borderRadius="0.5rem"
        onClick={() => handleSelectImage(item.image_url)}
        border={item.selected ? "1px solid #dd4d4d" : "1px solid transparent"}
        zIndex={33}
      >
        <Image
          src={`${item.image_url}/resize,w_200`}
          alt={`Small Image ${index + 1}`}
          w="100%"
          h="100%"
          objectFit="cover"
          borderRadius="0.5rem"
        />
        {item.tags === "upload" ? (
          <Image
            src={Delete.src}
            alt={`Delete ${index + 1}`}
            w="1rem"
            h="1rem"
            position="absolute"
            top={"-0.5rem"}
            right={"-0.5rem"}
            zIndex={22}
            cursor="pointer"
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
            width="full"
            background={item.selected ? "rgba(213,32,32,0.85)" : "rgba(23,23,23,0.6)"}
            borderRadius="0rem 0rem 0.4rem 0.4rem"
            py={"0.34rem"}
          >
            <Text
              color="white"
              fontSize="0.69rem"
              fontWeight="400"
              textAlign={"center"}
              textTransform="none"
              fontStyle="normal"
              lineHeight={"0.78rem"}
            >
              {formatTags(item.tags)}
            </Text>
          </Flex>
        )}
      </GridItem>
    ),
    [handleSelectImage]
  )

  return (
    <Flex w="full" flexDirection={"column"} alignItems="center">
      <Box h={"11rem"} overflow={"hidden"} w="100%">
        <Swiper
          onSlideChange={swiper => {
            setActiveIndex(swiper.activeIndex)
            if (makr) {
              return
            }
            setMakr(total - (swiper.activeIndex || 0) * (swiper.activeIndex === 0 ? 7 : 8) < 8)
            if (Math.floor(urlList.length / 8) <= swiper.activeIndex) {
              fetchData(swiper.activeIndex)
            }
          }}
          style={{ height: "100%" }}
        >
          {[...Array(totalPages)].map((_, pageIndex) => (
            <SwiperSlide key={pageIndex}>
              <Grid
                templateColumns="repeat(4, 1fr)"
                gap="0.75rem 0.75rem"
                pt={"0.75rem"}
                position={"relative"}
                w="100%"
              >
                {pageIndex === 0 && (
                  <Box position="relative" w="100%" h="4.69rem">
                    <Input
                      type="file"
                      accept="image/*"
                      display="none"
                      id={uniqueId}
                      onChange={e => handleImageChange(e)}
                    />
                    <label htmlFor={uniqueId} style={{ width: "100%", height: "100%", display: "block" }}>
                      <Box w="100%" h="100%" position="relative" borderRadius="0.5rem" background="#F5F5F5">
                        <Flex
                          position="absolute"
                          top="0"
                          left="0"
                          right="0"
                          bottom="0"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Image src={Add.src} alt="Add image" h="1.05rem" w="1.06rem" cursor="pointer" />
                        </Flex>
                      </Box>
                    </label>
                  </Box>
                )}
                {isUploading && pageIndex === 0 && (
                  <Box
                    w="100%"
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

                {urlList
                  .slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage)
                  .map((item, index) => renderImage({ item, index }))}
              </Grid>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
      <Flex justifyContent="center" mt={"0.75rem"} mb={"0.87rem"} gap={2}>
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
})

export default PatternSelector
