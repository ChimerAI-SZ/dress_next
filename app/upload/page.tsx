"use client";

import { Container, Text, Flex, Box } from "@chakra-ui/react";
import Header from "./components/Header";
import TypesClothing from "./components/TypesClothing";
import UploadImage from "./components/UploadImage";
import PrintSelect from "./components/PrintSelect";
function Page() {
  return (
    <Container p={3} bg={"#f5f5f5"} h={"100vh"}>
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
    </Container>
  );
}

export default Page;
