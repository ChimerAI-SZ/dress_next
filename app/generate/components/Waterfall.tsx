import React, { useState, useRef, useEffect, Suspense, useCallback } from "react"
import Masonry from "react-masonry-css"
import { Box, Image, Flex, Spinner } from "@chakra-ui/react"
import { Alert } from "@components/Alert"
import { fetchHomePage } from "@lib/request/page"
import { errorCaptureRes } from "@utils/index"
import Pages from "./Fullscreen"
import { css, Global } from "@emotion/react"

interface Item {
  image_url: string
  ID: number
  url: string
}

interface WaterfallImageProps {
  item: Item
  index: number
  isLast: boolean
  lastImageRef: (node: HTMLDivElement | null) => void
  onClick: () => void
}

const WaterfallImage = React.memo(({ item, index, isLast, lastImageRef, onClick }: WaterfallImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [showPlaceholder, setShowPlaceholder] = useState(true)

  useEffect(() => {
    setIsLoaded(false)
    setShowPlaceholder(true)
  }, [item.image_url])

  const handleImageLoad = () => {
    setIsLoaded(true)
    setTimeout(() => {
      setShowPlaceholder(false)
    }, 300)
  }

  return (
    <Box
      position="relative"
      mb="0.75rem"
      borderRadius="4px"
      overflow="hidden"
      ref={isLast ? lastImageRef : null}
      cursor="pointer"
      onClick={onClick}
      _hover={{
        transform: "scale(1.02)",
        transition: "transform 0.2s"
      }}
    >
      {showPlaceholder && (
        <Box
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          bg="gray.100"
          borderRadius="4px"
          opacity={isLoaded ? 0 : 1}
          transition="opacity 0.3s ease-in-out"
          zIndex={1}
        />
      )}
      <Image
        src={item.image_url}
        alt={`Image ${index + 1}`}
        width="100%"
        style={{ display: "block" }}
        borderRadius="4px"
        onLoad={handleImageLoad}
        opacity={isLoaded ? 1 : 0}
        transition="opacity 0.3s ease-in-out"
        zIndex={2}
      />
    </Box>
  )
})

WaterfallImage.displayName = "WaterfallImage"

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
} as const

const Waterfall: React.FC = () => {
  const [imageList, setImageList] = useState<Item[]>([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [open, setOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<Item | null>(null)

  const hasFetched = useRef(false)
  const observer = useRef<IntersectionObserver | null>(null)

  const fetchData = useCallback(
    async (callback?: () => void) => {
      if (loading || !hasMore) return
      setLoading(true)
      try {
        const [err, res] = await errorCaptureRes(fetchHomePage, {
          limit: 10,
          offset: page * 10,
          library: "show-new"
        })

        if (err || (res && !res.success)) {
          Alert.open({
            content: err?.message ?? res?.message
          })
        } else if (res?.success) {
          const newImages = res.data
          setImageList(prev => [...prev, ...newImages])
          setHasMore(newImages.length > 0)
          setPage(prev => prev + 1)
          callback?.()
        }
      } finally {
        setLoading(false)
      }
    },
    [hasMore, loading, page]
  )

  useEffect(() => {
    if (!hasFetched.current) {
      fetchData() // 只在第一次进入页面时请求
      hasFetched.current = true // 设置为 true，表示已经请求过
    }
  }, [])

  const lastImageRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()

      const options: IntersectionObserverInit = {
        root: null,
        rootMargin: "10px",
        threshold: 0.1
      }

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          fetchData()
        }
      }, options)

      if (node) observer.current.observe(node)
    },
    [loading, hasMore, fetchData]
  )

  const handleImageClick = useCallback((item: Item) => {
    setSelectedImage(item)
    setOpen(true)
  }, [])

  const handleLoadMore = useCallback(() => {
    fetchData()
  }, [fetchData])

  return (
    <>
      <Global styles={masonryStyles} />
      <Box>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {imageList.map((item, index) => (
            <Suspense fallback={<div>Loading...</div>} key={`${item.ID}-${index}`}>
              <WaterfallImage
                item={item}
                index={index}
                isLast={index === imageList.length - 1}
                lastImageRef={lastImageRef}
                onClick={() => handleImageClick(item)}
              />
            </Suspense>
          ))}
        </Masonry>
        {loading && (
          <Flex justify="center" align="center" mt={4}>
            <Spinner size="lg" />
          </Flex>
        )}
      </Box>
      <Pages
        open={open}
        setOpen={setOpen}
        selectedImage={selectedImage}
        imageList={imageList}
        onLoadMore={handleLoadMore}
        loading={loading}
        hasMore={hasMore}
      />
    </>
  )
}

export default Waterfall
