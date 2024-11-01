"use client";

import {
  Container,
  Flex,
  Link,
  IconButton,
  Text,
  Image,
} from "@chakra-ui/react";
import ArrowLeft from "@img/upload/arrow-left.svg";
function Page() {
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      mb={4}
      width="full"
      position="relative"
    >
      {/* 将 IconButton 位置固定在左侧 */}
      <Link href="/">
        <IconButton
          variant="ghost"
          aria-label="Back"
          position="absolute"
          left="0" // 微调 IconButton 的位置
          top="50%" // 垂直居中
          transform="translateY(-50%)"
        >
          <Image src={ArrowLeft.src} boxSize="1.9rem" />
        </IconButton>
      </Link>

      <Text
        fontSize="1.3rem"
        fontWeight="bold"
        letterSpacing="0.1rem"
        fontFamily="Arial"
        textAlign="center"
      >
        CREAMODA
      </Text>
    </Flex>
  );
}

export default Page;
