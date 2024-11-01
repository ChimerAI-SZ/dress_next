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
function Page() {
  const [loading, setLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;

    setLoading(true);
    try {
      const newImages: string[] = [];
      for (const file of files) {
        const imageUrl = URL.createObjectURL(file); // 模拟上传，使用本地URL
        newImages.push(imageUrl);
      }
      setUploadedImages((prev) => [...prev, ...newImages]);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setLoading(false);
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
        <Button w="6.13rem" h="1.38rem" borderRadius="0.94rem">
          <Image
            src="https://aimoda-ai.oss-us-east-1.aliyuncs.com/6d73505035e44870b42dc0290f8c3651%20(1).jpg"
            w="0.75rem"
            h="0.75rem"
          ></Image>
          <Text
            fontFamily="PingFangSC, PingFang SC"
            fontWeight="400"
            fontSize=" 0.75rem"
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
        {/* 上传图片的展示区域 */}
        <VStack spacing="0.5rem" mb="1rem">
          {uploadedImages.map((src, index) => (
            <Image
              key={index}
              src={src}
              alt={`Uploaded image ${index + 1}`}
              boxSize="6rem"
              objectFit="cover"
              borderRadius="0.5rem"
            />
          ))}
        </VStack>

        {/* 上传按钮及文件选择 */}
        <Button
          w="8.19rem"
          h="2rem"
          borderRadius="1rem"
          bg="rgba(255,255,255,0.5)"
          border="0.06rem solid #EE3939"
          as="label"
          cursor="pointer"
        >
          <input
            type="file"
            multiple
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />
          {loading ? (
            <Spinner color="#EE3939" size="sm" mr="0.5rem" />
          ) : (
            <Image
              src="https://aimoda-ai.oss-us-east-1.aliyuncs.com/6d73505035e44870b42dc0290f8c3651%20(1).jpg"
              w="0.81rem"
              h="0.81rem"
              mr="0.5rem"
            />
          )}
          <Text
            fontFamily="PingFangSC, PingFang SC"
            fontWeight="400"
            fontSize="0.88rem"
            color="#EE3939"
          >
            {loading ? "Uploading..." : "Upload image"}
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
      </Flex>
    </Box>
  );
}

export default Page;
