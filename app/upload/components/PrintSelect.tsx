"use client";

import { useState } from "react";
import { Box, Flex, Text, Image, Textarea } from "@chakra-ui/react";
import PhotoGallery from "./PhotoGallery";
import PrintGeneration from "@img/upload/print-generation.svg";
import ColorSelect from "./ColorSelect";
import { TypesClothingProps } from "@definitions/update";
function Page({ onParamsUpdate }: TypesClothingProps) {
  const [text, setText] = useState("");
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputText = event.target.value;
    if (inputText.length <= 200) {
      setText(inputText);
      onParamsUpdate({ text: inputText });
    }
  };
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
      py="0.66rem"
    >
      <Flex px="0.75rem">
        <Text
          fontFamily="PingFangSC"
          fontWeight="500"
          fontSize="1rem"
          color="#171717"
        >
          Print selection
        </Text>
      </Flex>
      <Flex gap="0.75rem" px="0.75rem" overflowX={"auto"} overflowY={"hidden"}>
        <PhotoGallery onParamsUpdate={onParamsUpdate}></PhotoGallery>
      </Flex>
      <Flex
        mt="0.66rem"
        borderTop="0.03rem solid #E4E4E4"
        px="0.75rem"
        pt={"0.75rem"}
      >
        <Text
          fontFamily="PingFangSC"
          fontWeight="500"
          fontSize="1rem"
          color="#171717"
        >
          Print selection
        </Text>
        <Image
          w="0.88rem"
          h="0.88rem"
          src={PrintGeneration.src}
          ml={"0.3rem"}
        ></Image>
      </Flex>
      <ColorSelect onParamsUpdate={onParamsUpdate}></ColorSelect>
      <Flex px="0.75rem" mt={"0.7rem"}>
        <Textarea
          value={text}
          onChange={handleChange}
          placeholder="Provide more creative descriptions"
          resize="vertical"
          width="full"
          height="10.31rem"
          background="#F5F5F5"
          borderRadius="0.5rem"
          mt={"0.5rem"}
        />
      </Flex>
    </Box>
  );
}

export default Page;
