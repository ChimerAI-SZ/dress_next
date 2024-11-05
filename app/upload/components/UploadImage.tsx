"use client";
import { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Image,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import { toaster } from "@components/ui/toaster";

import ImageGuide from "@img/upload/image-guide.svg";
import useAliyunOssUpload from "@hooks/useAliyunOssUpload";
import UploadImage from "@img/upload/upload-image.svg";
import ReUpload from "@img/upload/re-upload.svg";
function Page() {
  const { uploadToOss, isUploading, uploadProgress, uploadedUrl } =
    useAliyunOssUpload();
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;
    try {
      toaster.success({
        title: "Update successful",
        description: "File saved successfully to the server",
      });
      await uploadToOss(files[0]);
    } catch (error) {
      console.error("Upload failed", error);
    }
  };
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
      <Flex
        justifyContent={"space-between"}
        alignItems={"center"}
        py={"0.66rem"}
      >
        <Flex>
          <Text
            fontFamily="PingFangSC"
            fontWeight="500"
            fontSize="1rem"
            color="#171717"
          >
            Upload image
          </Text>
          <Text
            font-family="PingFangSC, PingFang SC"
            font-weight="500"
            font-size="1rem"
            color="#EE3939"
          >
            *
          </Text>
        </Flex>
        <Button w="6.13rem" h="1.38rem" borderRadius="0.94rem" gap={"0.25rem"}>
          <Image src={ImageGuide.src} w="0.75rem" h="0.75rem"></Image>
          <Text
            fontFamily="PingFangSC, PingFang SC"
            fontWeight="400"
            fontSize="0.75rem"
            color="#FFFFFF"
          >
            Image guide
          </Text>
        </Button>
      </Flex>
      <Flex
        width="100%"
        height="19.38rem"
        background="#F5F5F5"
        borderRadius="0.5rem"
        alignItems="center"
        justifyContent="center"
        flexFlow="column"
      >
        {isUploading ? (
          <Spinner size="xl" />
        ) : uploadedUrl ? (
          <Flex
            h="100%"
            w="100%"
            justifyContent="center"
            alignItems="center"
            position="relative"
            overflow="hidden"
          >
            <Image
              src={uploadedUrl}
              alt="Background image"
              h="100%"
              w="100%"
              objectFit="cover"
              filter="blur(10px)"
              position="absolute"
              top={0}
              left={0}
              zIndex={0}
            />
            <Image
              src={uploadedUrl}
              alt="Foreground image"
              h="100%"
              objectFit="contain"
              zIndex={1}
            />
            <Box as="label">
              <Image
                src={ReUpload.src}
                alt="Re-upload icon"
                h="1.1rem"
                w="1.13rem"
                objectFit="cover"
                position={"absolute"}
                zIndex={2}
                bottom="0.75rem"
                right="0.75rem"
              />
              <input
                type="file"
                multiple
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileUpload}
              ></input>
            </Box>
          </Flex>
        ) : (
          <>
            <Button
              w="8.19rem"
              h="2rem"
              borderRadius="1rem"
              bg="rgba(255,255,255,0.5)"
              border="0.06rem solid #EE3939"
              as="label"
              cursor="pointer"
              gap={"0.2rem"}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileUpload}
              />
              <Image src={UploadImage.src} w="1.13rem" h="1.13rem" />
              <Text
                fontFamily="PingFangSC, PingFang SC"
                fontWeight="400"
                fontSize="0.88rem"
                color="#EE3939"
              >
                Upload image
              </Text>
            </Button>

            <Text
              fontFamily="PingFangSC, PingFang SC"
              fontWeight="400"
              fontSize="0.81rem"
              color="#BFBFBF"
              mt="0.38rem"
            >
              10.0MB maximum file size
            </Text>
          </>
        )}
      </Flex>
    </Box>
  );
}

export default Page;
