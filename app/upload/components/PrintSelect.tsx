"use client"

import { useState } from "react"
import { Box, Flex, Text, Image, Textarea } from "@chakra-ui/react"
import PhotoGallery from "./PhotoGallery"
import PrintGeneration from "@img/upload/print-generation.svg"
import ColorSelect from "./ColorSelect"
import { TypesClothingProps } from "@definitions/update"
function Page({ onParamsUpdate }: TypesClothingProps) {
  return (
    <Box
      alignItems="center"
      justifyContent="center"
      mt="0.5rem"
      mb={4}
      width="full"
      position="relative"
      bg={"#FFFFFF"}
      borderRadius={"0.5rem"}
      pt="0.66rem"
    >
      <Flex px="0.75rem">
        <Text fontWeight="600" fontSize="0.94rem" color="#171717">
          Print
        </Text>
      </Flex>
      <Flex px="0.75rem" overflowX={"auto"} overflowY={"hidden"}>
        <PhotoGallery onParamsUpdate={onParamsUpdate}></PhotoGallery>
      </Flex>
    </Box>
  )
}

export default Page
