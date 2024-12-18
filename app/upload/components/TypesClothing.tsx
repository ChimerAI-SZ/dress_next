"use client"

import { Box, Flex, Text, Image } from "@chakra-ui/react"
import ComingSoon from "@img/upload/comingSoon.jpg"
import ComingSoon2 from "@img/upload/comingSoon2.jpg"
import ComingSoon3 from "@img/upload/comingSoon3.jpg"
import Dress from "@img/upload/dress.jpg"
import comingSvg from "@img/upload/comingSoon.svg"
function Page() {
  return (
    <Box
      alignItems="center"
      justifyContent="center"
      mt={5}
      width="full"
      position="relative"
      bg={"#FFFFFF"}
      borderRadius={"0.5rem"}
      py="0.66rem"
      px="0.75rem"
      objectFit={"auto"}
    >
      <Flex>
        <Text fontWeight="600" fontSize="0.94rem" color="#171717">
          Category
        </Text>
        <Text font-weight="500" font-size="1rem" color="#EE3939">
          *
        </Text>
      </Flex>
      <Flex mt="0.75rem" gap="0.75rem" overflowX={"auto"} overflowY={"hidden"}>
        <Box
          w="5.94rem"
          h="7.81rem"
          bg="#F5F5F5"
          borderRadius="0.6rem"
          border=" 0.09rem solid #D52020"
          position={"relative"}
          flexShrink="0"
          overflow={"hidden"}
        >
          <Image src={Dress.src} w="100%" h="100%"></Image>
          <Box bg="rgba(213,32,32,0.85)" position={"absolute"} bottom={"0"} w="100%" height="1.55rem">
            <Text fontWeight="400" fontSize="0.75rem" color="#FFFFFF" textAlign={"center"} lineHeight={"1.53rem"}>
              Printing dress
            </Text>
          </Box>
        </Box>

        <Box
          w="5.94rem"
          h="7.81rem"
          bg="#F5F5F5"
          borderRadius="0.5rem"
          overflow={"hidden"}
          position={"relative"}
          flexShrink="0"
        >
          <Image src={ComingSoon.src} w="100%" h="100%"></Image>
          <Flex
            w="5.94rem"
            h="7.81rem"
            borderRadius="0.6rem"
            bg="rgba(23,23,23,0.4)"
            position={"absolute"}
            top={0}
            justifyContent="center"
            alignItems="center"
            flexFlow={"column"}
            overflow={"hidden"}
          >
            <Image src={comingSvg.src} w="1.13rem" h="1.13rem" borderRadius="0.5rem"></Image>
            <Text
              fontWeight="400"
              fontSize="0.81rem"
              color="#E5E5E5"
              textAlign={"center"}
              whiteSpace="normal" // 允许文本自动换行
              maxWidth="80%" // 限制最大宽度
              lineHeight="0.8rem"
            >
              Coming soon
            </Text>
            <Box bg="rgba(23,23,23,0.6)" position={"absolute"} bottom={"0"} w="100%" height="1.55rem">
              <Text fontWeight="400" fontSize="0.75rem" color="#FFFFFF" textAlign={"center"} lineHeight={"1.53rem"}>
                T-shirt
              </Text>
            </Box>
          </Flex>
        </Box>
        <Box
          w="5.94rem"
          h="7.81rem"
          bg="#F5F5F5"
          borderRadius="0.6rem"
          overflow={"hidden"}
          position={"relative"}
          flexShrink="0"
        >
          <Image src={ComingSoon2.src} w="100%" h="100%" borderRadius="0.5rem"></Image>
          <Flex
            w="5.94rem"
            h="7.81rem"
            borderRadius="0.6rem"
            bg="rgba(23,23,23,0.5)"
            position={"absolute"}
            top={0}
            justifyContent="center"
            alignItems="center"
            flexFlow={"column"}
          >
            <Image src={comingSvg.src} w="1.13rem" h="1.13rem"></Image>
            <Text
              fontWeight="400"
              fontSize="0.81rem"
              color="#E5E5E5"
              textAlign={"center"}
              whiteSpace="normal" // 允许文本自动换行
              maxWidth="80%" // 限制最大宽度
              lineHeight="0.8rem"
            >
              Coming soon
            </Text>
            <Box
              bg="rgba(23,23,23,0.6)"
              position={"absolute"}
              bottom={"0"}
              borderBottomRadius="0.5rem"
              w="100%"
              height="1.55rem"
            >
              <Text fontWeight="400" fontSize="0.75rem" color="#FFFFFF" textAlign={"center"} lineHeight={"1.53rem"}>
                Hoodie
              </Text>
            </Box>
          </Flex>
        </Box>
        <Box w="5.94rem" h="7.81rem" bg="#F5F5F5" borderRadius="0.5rem" position={"relative"} flexShrink="0">
          <Image src={ComingSoon3.src} w="100%" h="100%" borderRadius="0.5rem"></Image>
          <Flex
            w="5.94rem"
            h="7.81rem"
            borderRadius="0.6rem"
            bg="rgba(23,23,23,0.4)"
            position={"absolute"}
            top={0}
            justifyContent="center"
            alignItems="center"
            flexFlow={"column"}
          >
            <Image src={comingSvg.src} w="1.13rem" h="1.13rem" borderRadius="0.5rem" mb={"0.2rem"}></Image>
            <Text
              fontWeight="400"
              fontSize="0.81rem"
              color="#E5E5E5"
              textAlign={"center"}
              whiteSpace="normal" // 允许文本自动换行
              maxWidth="80%" // 限制最大宽度
              lineHeight="0.8rem"
            >
              Coming soon
            </Text>
            <Box
              bg="rgba(23,23,23,0.6)"
              position={"absolute"}
              bottom={"0"}
              borderBottomRadius="0.5rem"
              w="100%"
              height="1.55rem"
            >
              <Text fontWeight="400" fontSize="0.75rem" color="#FFFFFF" textAlign={"center"} lineHeight={"1.53rem"}>
                Swimwear
              </Text>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Box>
  )
}

export default Page
