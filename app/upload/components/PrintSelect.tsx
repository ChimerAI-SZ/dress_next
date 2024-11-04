"use client";

import { Box, Flex, Text, Image } from "@chakra-ui/react";
import PhotoGallery from "./PhotoGallery";
function Page() {
  return (
    <Box
      alignItems="center"
      justifyContent="center"
      mt={4}
      mb={4}
      width="full"
      position="relative"
      bg={"#FFFFFF"}
      borderRadius={"0.5rem"}
      py="0.66rem"
      px="0.75rem"
    >
      <Flex>
        <Text
          fontFamily="PingFangSC"
          fontWeight="500"
          fontSize="1rem"
          color="#171717"
        >
          Print selection
        </Text>
      </Flex>
      <Flex mt="0.75rem" gap="0.75rem" overflowX={"auto"} overflowY={"hidden"}>
        <PhotoGallery></PhotoGallery>
      </Flex>
    </Box>
  );
}

export default Page;
