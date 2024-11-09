"use client";
import { useState } from "react";
import {
  Container,
  Flex,
  Link,
  IconButton,
  Text,
  Image,
} from "@chakra-ui/react";
import ArrowLeft from "@img/upload/arrow-left.svg";
import SelectMore from "@img/generate-result/select-more.svg";
import Active from "@img/generate-result/active.svg";
function Page({ show, cb }: { show?: boolean; cb?: (e: boolean) => void }) {
  const [active, setActive] = useState(false);
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
      {show && (
        <IconButton
          variant="ghost"
          aria-label="Back"
          position="absolute"
          right="0"
          top="50%"
          transform="translateY(-50%)"
          onClick={() => {
            cb && cb(!active);
            setActive(!active);
          }}
        >
          <Image src={active ? Active.src : SelectMore.src} boxSize="1.9rem" />
        </IconButton>
      )}
    </Flex>
  );
}

export default Page;
