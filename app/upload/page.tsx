"use client";

import { Container, Text, Flex, Box, Button } from "@chakra-ui/react";
import Header from "./components/Header";
import TypesClothing from "./components/TypesClothing";
import UploadImage from "./components/UploadImage";
import PrintSelect from "./components/PrintSelect";
import Fabric from "./components/Fabric";
function Page() {
  return (
    <Container bg={"#f5f5f5"} h={"100%"} position={"relative"} pt={4}>
      <Header></Header>
      <TypesClothing></TypesClothing>
      <UploadImage></UploadImage>
      <Flex alignItems="center" justifyContent="center" w="100%">
        <Box
          flex="1"
          height="0.06rem"
          bg="linear-gradient( 90deg,#f4f4f4 0%, #e3e3e3 14%, #cacaca 47%, #c4c4c4 87%, #c0c0c0 100%)"
        />
        <Text
          fontFamily="PingFangSC, PingFang SC"
          fontWeight="400"
          fontSize="0.81rem"
          color=" #737373"
          mx={"0.75rem"}
        >
          Advanced design
        </Text>
        <Box
          flex="1"
          height="0.06rem"
          bg="linear-gradient(270deg, #f4f4f4 0%, #e3e3e3 14%, #cacaca 47%, #c4c4c4 87%, #c0c0c0 100%)"
        />
      </Flex>
      <PrintSelect></PrintSelect>
      <Fabric></Fabric>
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
      >
        <Button
          colorScheme="teal"
          width="20.38rem"
          height="2.5rem"
          background="#EE3939"
          borderRadius="1.25rem"
        >
          Generate
        </Button>
      </Flex>
    </Container>
  );
}

export default Page;
