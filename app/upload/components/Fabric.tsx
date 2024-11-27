"use client";

import { useState } from "react";
import { Box, Flex, Text, Image, Textarea } from "@chakra-ui/react";
import PhotoGallery from "./PhotoGallery";
import { TypesClothingProps } from "@definitions/update";

function Page({ onParamsUpdate }: TypesClothingProps) {
  return (
    <Box
      alignItems="center"
      justifyContent="center"
      mt={4}
      width="full"
      position="relative"
      bg={"#FFFFFF"}
      borderRadius={"0.5rem"}
      py="0.66rem"
    >
      <Flex px="0.75rem">
        <Text
          fontWeight="500"
          fontSize="1rem"
          color="#171717"
        >
          Fabric
        </Text>
      </Flex>
      <Flex gap="0.75rem" px="0.75rem" overflowX={"auto"} overflowY={"hidden"}>
        <PhotoGallery
          onParamsUpdate={onParamsUpdate}
          flied="Fabric"
        ></PhotoGallery>
      </Flex>
    </Box>
  );
}

export default Page;
