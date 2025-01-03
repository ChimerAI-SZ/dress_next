"use client"
import dynamic from "next/dynamic"
import { Suspense, useCallback, useMemo, useState, memo } from "react"
import { Container, Text, Flex, Box, Button } from "@chakra-ui/react"
import Header from "../../components/Header"
import { Params } from "@definitions/update"
import { useRouter } from "next/navigation"
import { setWorkInfo, setParams as setStoreParams, setTaskId, setWork } from "@store/features/workSlice"
import { useDispatch, useSelector } from "react-redux"

// 动态导入组件
const TypesClothing = dynamic(() => import("./components/TypesClothing"), {
  loading: () => <Box h="7.81rem" bg="#FFFFFF" borderRadius="0.5rem" />,
  ssr: false
})

const UploadImage = dynamic(() => import("./components/UploadImage"), {
  loading: () => <Box h="12.81rem" bg="#FFFFFF" borderRadius="0.5rem" />,
  ssr: false
})

const PrintSelect = dynamic(() => import("./components/PrintSelect"), {
  loading: () => <Box h="11rem" bg="#FFFFFF" borderRadius="0.5rem" />,
  ssr: false
})

function Page() {
  const dispatch = useDispatch()
  const { params: paramsState } = useSelector((state: any) => state.work)
  const [params, setParams] = useState<Params>({
    loadOriginalImage: paramsState.loadOriginalImage,
    loadPrintingImage: undefined,
    backgroundColor: undefined,
    text: undefined,
    loadFabricImage: undefined
  })
  const router = useRouter()

  // 使用 useCallback 优化回调函数
  const handleParamsUpdate = useCallback((newParams: Params) => {
    console.log("newParams", newParams)
    setParams((prev: Params) => ({
      ...prev,
      ...newParams
    }))
  }, [])

  // 使用 useMemo 优化按钮渲染逻辑
  const generateButton = useMemo(() => {
    const buttonProps = {
      width: "20.38rem",
      height: "2.5rem",
      borderRadius: "1.25rem"
    }

    if (params?.loadOriginalImage) {
      return (
        <Button
          onClick={() => {
            dispatch(setStoreParams(params))
            router.replace("/generate")
          }}
          colorScheme="teal"
          background="#EE3939"
          {...buttonProps}
        >
          Generate
        </Button>
      )
    }

    return (
      <Button colorScheme="teal" background="rgba(238,57,57,0.5)" {...buttonProps}>
        Generate
      </Button>
    )
  }, [params, dispatch, router])

  return (
    <Container bg="#f5f5f5" h="100%" minH="100vh" position="relative" pt={4}>
      <Header />

      <Suspense fallback={<Box h="7.81rem" bg="#FFFFFF" borderRadius="0.5rem" />}>
        <TypesClothing />
      </Suspense>

      <Suspense fallback={<Box h="12.81rem" bg="#FFFFFF" borderRadius="0.5rem" />}>
        <UploadImage onParamsUpdate={handleParamsUpdate} />
      </Suspense>

      <Suspense fallback={<Box h="11rem" bg="#FFFFFF" borderRadius="0.5rem" />}>
        <PrintSelect onParamsUpdate={handleParamsUpdate} />
      </Suspense>

      <Box h="4.55rem" />

      <Flex
        height="3.75rem"
        position="fixed"
        bottom={0}
        zIndex={111}
        bg="#fff"
        maxW="100vw"
        w="full"
        alignItems="center"
        justifyContent="center"
        left="50%"
        transform="translateX(-50%)"
        borderRadius="0.75rem 0.75rem 0rem 0rem"
        boxShadow="0rem -0.06rem 0.31rem 0rem rgba(214,214,214,0.5)"
      >
        {generateButton}
      </Flex>
    </Container>
  )
}

export default memo(Page)
