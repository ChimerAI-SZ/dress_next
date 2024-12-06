"use client"
import { useState } from "react"
import { Container, Text, Flex, Box, Button } from "@chakra-ui/react"
import Header from "../../components/Header"
import TypesClothing from "./components/TypesClothing"
import UploadImage from "./components/UploadImage"
import PrintSelect from "./components/PrintSelect"
import Fabric from "./components/Fabric"
import Link from "next/link"
import { Params } from "@definitions/update"
import { useRouter } from "next/navigation"
import { setWorkInfo, setParams as setStoreParams, setTaskId, setWork } from "@store/features/workSlice"
import { useDispatch, useSelector } from "react-redux"
function Page() {
  const dispatch = useDispatch()
  const [params, setParams] = useState<Params>({
    loadOriginalImage: undefined,
    loadPrintingImage: undefined,
    backgroundColor: undefined,
    text: undefined,
    loadFabricImage: undefined
  })
  const router = useRouter()
  // 通过回调函数传递数据
  const handleParamsUpdate = (newParams: Params) => {
    setParams((prev: Params) => ({
      ...prev,
      ...newParams
    }))
  }
  return (
    <Container bg={"#f5f5f5"} h={"100%"} position={"relative"} pt={4}>
      <Header></Header>
      <TypesClothing></TypesClothing>
      <UploadImage onParamsUpdate={handleParamsUpdate}></UploadImage>
      <PrintSelect onParamsUpdate={handleParamsUpdate}></PrintSelect>
      {/* <Fabric onParamsUpdate={handleParamsUpdate}></Fabric> */}
      <Box h="4.55rem"></Box>
      <Flex
        height="3.75rem"
        position="fixed"
        bottom="0"
        zIndex={111}
        bg={"#fff"}
        maxW="100vw"
        w={"full"}
        alignItems={"center"}
        justifyContent={"center"}
        left="50%"
        transform="translateX(-50%)"
        borderRadius="0.75rem 0.75rem 0rem 0rem"
        boxShadow="0rem -0.06rem 0.31rem 0rem rgba(214,214,214,0.5)"
      >
        {params?.loadOriginalImage ? (
          <Button
            onClick={() => {
              dispatch(setStoreParams(params))
              router.replace("/generate")
            }}
            colorScheme="teal"
            width="20.38rem"
            height="2.5rem"
            background="#EE3939"
            borderRadius="1.25rem"
          >
            Generate
          </Button>
        ) : (
          <Button
            colorScheme="teal"
            width="20.38rem"
            height="2.5rem"
            background="rgba(238,57,57,0.5)"
            borderRadius="1.25rem"
          >
            Generate
          </Button>
        )}
      </Flex>
    </Container>
  )
}

export default Page
