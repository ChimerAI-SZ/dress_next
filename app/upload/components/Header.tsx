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
      <Link href="/">
        <IconButton
          variant="ghost"
          aria-label="Back"
          position="absolute"
          left="0"
          top="50%"
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
