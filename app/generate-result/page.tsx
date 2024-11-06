"use client";

import { useState } from "react";
import { Button, Box, Image, Flex, Text } from "@chakra-ui/react";
import Header from "@components/Header";
import Bg from "@img/generate/bg.png";
import PrintGeneration from "@img/upload/print-generation.svg";
import Waterfall from "../components/Waterfall";
import Download from "@img/generate-result/download.png";
import Like from "@img/generate-result/like.png";
import Shop from "@img/generate-result/shop.png";

function Page() {
  const [imageList, setImageList] = useState<string[]>([
    "https://mind-file.oss-cn-beijing.aliyuncs.com/5f3efc5648b5436d8d50dcf5bbd68e63?x-oss-process=image/format,jpg",
    "https://mind-file.oss-cn-beijing.aliyuncs.com/5f3efc5648b5436d8d50dcf5bbd68e63?x-oss-process=image/format,jpg",
    "https://mind-file.oss-cn-beijing.aliyuncs.com/5f3efc5648b5436d8d50dcf5bbd68e63?x-oss-process=image/format,jpg",
    "https://mind-file.oss-cn-beijing.aliyuncs.com/5f3efc5648b5436d8d50dcf5bbd68e63?x-oss-process=image/format,jpg",
    "https://mind-file.oss-cn-beijing.aliyuncs.com/5f3efc5648b5436d8d50dcf5bbd68e63?x-oss-process=image/format,jpg",
    "https://mind-file.oss-cn-beijing.aliyuncs.com/5f3efc5648b5436d8d50dcf5bbd68e63?x-oss-process=image/format,jpg",
  ]);
  return (
    <Box h="100vh" position={"relative"} pt={4} px="1rem">
      <Header></Header>
      <Flex height="28.59rem" w={"full"} justifyContent={"center"}>
        <Box height="28.59rem" w={"21.44rem"} position={"relative"}>
          <Image
            h={"100%"}
            w={"21.44rem"}
            objectFit={"cover"}
            src="https://mind-file.oss-cn-beijing.aliyuncs.com/5f3efc5648b5436d8d50dcf5bbd68e63?x-oss-process=image/format,jpg"
          ></Image>
          <Flex
            position={"absolute"}
            bottom={0}
            right={"0"}
            gap={"1rem"}
            pb={"0.87rem"}
            pr={"0.87rem"}
          >
            <Image boxSize={"2.25rem"} src={Download.src}></Image>
            <Image boxSize={"2.25rem"} src={Like.src}></Image>
            <Image boxSize={"2.25rem"} src={Shop.src}></Image>
          </Flex>
        </Box>
      </Flex>
      <Flex mt={"1.38rem"} gap={"0.75rem"} overflowY={"auto"}>
        <Box
          position={"relative"}
          height="7.91rem"
          width="5.94rem"
          flexShrink={0}
          border="0.03rem solid #CACACA"
          borderRadius="0.5rem"
        >
          <Box
            position={"absolute"}
            flexShrink={0}
            width="3.25rem"
            height="1.13rem"
            background="#171717"
            borderRadius="0.5rem 0rem 0.56rem 0rem"
            top={"0px"}
            left={"0px"}
          >
            <Text color="#FFFFFF" fontSize="0.63rem" alignItems={"center"}>
              Original
            </Text>
          </Box>
          <Image
            borderRadius="0.5rem"
            flexShrink={0}
            height="7.91rem"
            width="5.94rem"
            objectFit={"cover"}
            src="https://mind-file.oss-cn-beijing.aliyuncs.com/5f3efc5648b5436d8d50dcf5bbd68e63?x-oss-process=image/format,jpg"
          ></Image>
        </Box>
        {imageList.map((item, index) => {
          return (
            <Box
              flexShrink={0}
              border="0.09rem solid #EE3939"
              borderRadius="0.5rem"
              key={item + index}
            >
              <Image
                flexShrink={0}
                height="7.92rem"
                width="5.94rem"
                objectFit={"cover"}
                src={item}
                borderRadius="0.45rem"
              ></Image>
            </Box>
          );
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
      </Flex>
    </Box>
  );
}

export default Page;
