"use client";

import { useState } from "react";
import { Button, Flex, Text, Image, VStack, Box, Grid } from "@chakra-ui/react";
import ImageGuide from "@img/upload/image-guide.svg";
import {
  DrawerActionTrigger,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "@components/ui/drawer";
import Close from "@img/upload/close.svg";
import Index1 from "@img/upload/index-1.png";
import Index2 from "@img/upload/index-2.png";
import Index3 from "@img/upload/index-3.png";
import Index4 from "@img/upload/index-4.png";
import Index5 from "@img/upload/index-5.png";
import Index6 from "@img/upload/index-6.png";

function Page() {
  return (
    <>
      <DrawerRoot placement="bottom">
        <DrawerBackdrop />
        <DrawerTrigger asChild>
          <Button
            w="6.13rem"
            h="1.38rem"
            borderRadius="0.94rem"
            gap={"0.25rem"}
          >
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
        </DrawerTrigger>
        <DrawerContent roundedTop={"13"}>
          <Flex
            alignItems="center"
            justifyContent="center"
            mt={"0.56rem"}
            width="full"
            position="relative"
            cursor={"pointer"}
          >
            <DrawerActionTrigger asChild>
              <Image
                src={Close.src}
                w={"0.81rem"}
                h={"0.81rem"}
                position="absolute"
                left="0.7rem"
                top="50%"
                transform="translateY(-50%)"
              />
            </DrawerActionTrigger>
            <Text
              fontSize="1.06rem"
              fontWeight="500"
              letterSpacing="0.1rem"
              fontFamily="Arial"
              textAlign="center"
              color="#171717"
            >
              Image guide
            </Text>
          </Flex>
          <Text
            mb={4}
            color="gray"
            fontFamily="Arial"
            fontSize="0.8rem"
            fontWeight="400"
            px={"0.75rem"}
          >
            In order to have a better generative result, please upload a full
            display of the dress, as shown below:
          </Text>
          <VStack align="stretch" h="47vh" overflowY="auto" px={"0.75rem"}>
            <Box>
              <Text
                mb={2}
                fontFamily="PingFang SC"
                fontSize="0.8rem"
                fontWeight="400"
              >
                Outfit
              </Text>
              <Grid templateColumns="repeat(2, 1fr)" gap="4">
                <Image src={Index1.src} alt="Correct Outfit" flex={1} />
                <Image
                  src={Index2.src}
                  alt="Correct Outfit"
                  borderRadius="0px"
                  flex={1}
                />
              </Grid>
            </Box>
            <Box>
              <Text
                mb={2}
                fontFamily="PingFang SC"
                fontSize="0.8rem"
                fontWeight="400"
              >
                Print
              </Text>
              <Grid templateColumns="repeat(2, 1fr)" gap="4">
                <Image
                  src={Index3.src}
                  alt="Correct Outfit"
                  borderRadius="0px"
                />
                <Image
                  src={Index4.src}
                  alt="Correct Outfit"
                  borderRadius="0px"
                />
              </Grid>
            </Box>
            <Box>
              <Text
                mb={2}
                fontFamily="PingFang SC"
                fontSize="0.8rem"
                fontWeight="400"
              >
                Fabric
              </Text>
              <Grid templateColumns="repeat(2, 1fr)" gap="4">
                <Image
                  src={Index5.src}
                  alt="Correct Outfit"
                  borderRadius="0px"
                />
                <Image
                  src={Index6.src}
                  alt="Correct Outfit"
                  borderRadius="0px"
                />
              </Grid>
            </Box>
          </VStack>
          <DrawerBody></DrawerBody>
        </DrawerContent>
      </DrawerRoot>
    </>
  );
}

export default Page;
