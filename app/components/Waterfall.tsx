"use client"
import React, { useState, useRef, useEffect, Suspense, useCallback, useReducer } from "react"
import Masonry from "react-masonry-css"
import styled from "@emotion/styled"
import { css, Global, keyframes } from "@emotion/react"

import { Box, Flex, Spinner, Image, Show, Button } from "@chakra-ui/react"

import { fetchHomePage } from "@lib/request/page"
import { errorCaptureRes } from "@utils/index"

import { Alert } from "@components/Alert"
import ImageOverlay from "./ImageOverlay"
import ImageViewer from "./ImagePreviewVoter"
import { setParams } from "@store/features/workSlice"
import loadingIcon from "@img/mainPage/loading.svg"
interface Item {
  image_url: string
  ID: number
  url: string
}

const masonryStyles = css`
  .my-masonry-grid {
    display: flex;
    width: auto;
    margin-left: -15px;
  }

  .my-masonry-grid_column {
    padding-left: 15px;
    background-clip: padding-box;
  }
`

const breakpointColumnsObj = {
  default: 3,
  1100: 3,
  700: 3,
  500: 2
}

import { useDispatch } from "react-redux"

const NUMBER_OF_IMAGES_LOADED_EACH_TURN = 10 //每次加载的图片数量

const Waterfall = ({ viewDetail, setViewDetail }: { viewDetail: boolean; setViewDetail: (value: boolean) => void }) => {
  const dispatch = useDispatch()

  const [hasMore, setHasMore] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [imageList, setImageList] = useState<Item[]>([])
  const [page, setPage] = useState(0)

  // 图库里一共有多少张
  const [totalImagesCount, setTotalImagesCount] = useState<number>(50)

  const [usedIndexes, setUsedIndexes] = useState(new Set())

  const [selectedImg, setSelectedImg] = useState("") // 选中的图片
  const loaderRef = useRef(null)
  const observer = useRef<IntersectionObserver | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const hasFetchedOnce = useRef(false)

  const [, forceUpdate] = useReducer(x => x + 1, 0)

  const fetchData = useCallback(
    async (refreshType: "pullDown" | "pullUp" = "pullUp", callback?: (newImages: Item[]) => void) => {
      if (loading || !hasMore) return // 避免重复请求
      setLoading(true)

      const generateRandomIndex = () => {
        let index: number
        let availableIndexes: boolean

        do {
          // 生成一个随机索引
          index = Math.floor(Math.random() * (totalImagesCount - NUMBER_OF_IMAGES_LOADED_EACH_TURN))
          // 检查接下来的4个索引是否可用
          availableIndexes = Array.from({ length: NUMBER_OF_IMAGES_LOADED_EACH_TURN }, (_, i) => index + i).every(
            i => !usedIndexes.has(i)
          )
        } while (!availableIndexes)

        return index
      }

      const randomIndex = generateRandomIndex()

      const [err, res] = await errorCaptureRes(fetchHomePage, {
        limit: NUMBER_OF_IMAGES_LOADED_EACH_TURN,
        offset: randomIndex,
        library: "show-new"
      })

      if (err || (res && !res?.success)) {
        Alert.open({
          content: err.message ?? res.message
        })
      } else if (res.success && res.data?.length > 0) {
        setTotalImagesCount(res.total)
        const newImages = res.data.slice().sort(() => Math.random() - 0.5)

        // 下拉刷新的话重置imglist
        setImageList(prev => (refreshType === "pullUp" ? [...prev, ...newImages] : [...newImages]))

        setHasMore(newImages.length > 0)

        setPage(prev => prev + 1)

        // 存一下本次使用到的图片
        setUsedIndexes(prevIndexes => {
          // 如果是下拉刷新的话，重置
          let newSet = refreshType === "pullUp" ? new Set(prevIndexes) : new Set()

          for (let i = 0; i < NUMBER_OF_IMAGES_LOADED_EACH_TURN; i++) {
            newSet.add(randomIndex + i)
          }

          // 由于是随机开始查询的，如果剩下可用的图片已经没有两倍的单次请求数量的，重置。
          if (newSet.size >= totalImagesCount - NUMBER_OF_IMAGES_LOADED_EACH_TURN * 2) {
            return new Set()
          }

          return newSet
        })

        callback && callback(newImages)
      }

      setLoading(false)
    },
    [hasMore, page]
  )

  const lastImageRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || !hasMore) return // 如果正在加载或没有更多数据，避免触发

      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting) {
            fetchData() // 当最后一张图片进入视口时加载更多
          }
        },
        { rootMargin: "100px", threshold: 0.2 }
      )

      if (node) observer.current.observe(node)
    },
    [fetchData, hasMore, loading]
  )

  const handleImageClick = (src: string) => {
    setSelectedImg(src)
  }

  useEffect(() => {
    if (!hasFetchedOnce.current) {
      fetchData() // 只在第一次进入页面时请求
      hasFetchedOnce.current = true // 设置为 true，表示已经请求过
    }
  }, [fetchData])

  useEffect(() => {
    if (containerRef.current) {
      const app = containerRef.current
      const originTop = app.getBoundingClientRect().top
      let startP: any, moveLen
      // 是否执行有效下拉回调标志位
      let refreshStatus = false

      const pullCallback = () => {
        fetchData("pullDown", () => {
          app.style["transition"] = "transform 0.4s"
          app.style["transform"] = "translate(0, 0px)"
        })
      }

      const _pullHandler = (moveLen: any) => {
        // 下拉元素距离视口顶部距离
        const top_distance = app.getBoundingClientRect().top
        // 有效下拉才做处理
        if (top_distance >= 0) {
          // 下拉效果
          if (moveLen > 0 && moveLen < 50) {
            app.style["transform"] = "translate(0, " + moveLen + "px)"
          } else if (moveLen >= 50 && moveLen < 100) {
            // 到刷新标志，下拉阻尼增大
            const _moveLen = 50 + (moveLen - 50) * 0.6
            app.style["transform"] = "translate(0, " + _moveLen + "px)"
          }

          // 下拉触发
          if (top_distance - originTop < 50) {
            refreshStatus = false
          } else {
            refreshStatus = true
          }
        }
      }
      const touchstart = (e: any) => {
        startP = e.touches[0].pageY
        app.style["transition"] = "transform 0s"
      }
      const touchmove = (e: any) => {
        moveLen = e.touches[0].pageY - startP
        _pullHandler(moveLen)
      }
      const touchend = () => {
        // 下拉元素距离视口顶部距离
        const top_distance = app.getBoundingClientRect().top

        // 拖动一定距离之后才会触发
        if (top_distance - originTop > 10) {
          // 当有效下拉发生后动画归位，重置样式
          if (refreshStatus) {
            pullCallback()
          }
        }
      }

      app.addEventListener("touchstart", touchstart)
      app.addEventListener("touchmove", touchmove)
      app.addEventListener("touchend", touchend)

      return () => {
        app.removeEventListener("touchstart", touchstart)
        app.removeEventListener("touchmove", touchmove)
        app.removeEventListener("touchend", touchend)
      }
    }
  }, [containerRef.current])

  return (
    <>
      <Global styles={masonryStyles} />
      <Box ref={containerRef} position={"relative"}>
        <Box
          className="main-page-hidden-loading-icon"
          position={"absolute"}
          top={"-40pt"}
          left={"50%"}
          transform={"translateX(-50%)"}
        >
          <StyledLoading src={loadingIcon.src} alt="loading-icon" boxSize="24pt" />
        </Box>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {imageList.map((item, index) => (
            <Suspense fallback={<div>Loading...</div>} key={item.ID}>
              <Box>
                <ImageOverlay
                  src={item.image_url}
                  ref={index === imageList.length - 1 ? lastImageRef : null}
                  onClick={() => handleImageClick(item.image_url)}
                />
              </Box>
            </Suspense>
          ))}
        </Masonry>
        <Box ref={loaderRef}>
          {loading && (
            <Flex justify="center" align="center" mt={4}>
              <Spinner size="lg" />
            </Flex>
          )}
        </Box>
      </Box>

      {viewDetail && (
        <ImageViewer
          initImgUrl={selectedImg}
          imgList={imageList}
          fetchData={fetchData}
          close={() => {
            setViewDetail(false)

            forceUpdate()
          }}
        />
      )}
    </>
  )
}

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`
const StyledLoading = styled(Image)`
  animation: ${spin} 2s linear infinite; /* 旋转动画持续2秒，线性变化，无限循环 */
`

const Bg = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(16px);
`
const StyledImg = styled(Image)`
  max-width: 90vw;
  z-index: 1;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0px 2px 17px 0px rgba(0, 0, 0, 0.07);
  border-radius: 12px;
  border: 1px solid rgba(182, 182, 182, 0.5);
`
const Footer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  padding: 8pt 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px -1px 5px 0px rgba(214, 214, 214, 0.5);
  border-radius: 12px 12px 0px 0px;
`
export default Waterfall
