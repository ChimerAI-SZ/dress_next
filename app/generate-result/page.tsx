"use client";

import { useState, useEffect } from "react";
import { Button, Box, Image, Flex, Text } from "@chakra-ui/react";
import { Toaster, toaster } from "@components/Toaster";
import Header from "@components/Header";
import Download from "@img/generate-result/download.png";
import Like from "@img/generate-result/like.png";
import Shop from "@img/generate-result/shop.png";
import Liked from "@img/generate-result/liked.svg";
import NoSelect from "@img/generate-result/no-select.svg";
import Selected from "@img/generate-result/selected.svg";
import ModalRight from "@img/generate-result/modal-right.svg";
import ModalBack from "@img/generate-result/modal-back.svg";
import { useSearchParams } from "next/navigation";
import ToastTest from "@components/ToastTest";
import { errorCaptureRes, storage } from "@utils/index";
import { fetchShoppingAdd, fetchAddImage } from "@lib/request/generate-result";
import AllNo from "@img/generate-result/all-no.svg";
function Page() {
  const userId = storage.get("user_id");

  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  const [imageList, setImageList] = useState<string[]>(
    JSON.parse(params.imageList)
  );
  const [selectImage, setSelectImage] = useState(imageList[0]);
  const [likeList, setLikeList] = useState<string[]>([]);
  const [originImage, setOriginImage] = useState(params.loadOriginalImage);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [active, setActive] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [make, setMake] = useState(0);
  const openDialog = () => setIsOpen(true);
  const fetchData = async (list: string[]) => {
    if (userId === null) {
      throw new Error("userId cannot be null");
    }
    const [err, res] = await errorCaptureRes(fetchShoppingAdd, {
      user_id: +userId as number,
      img_urls: list,
      phone: phoneNumber,
    });
    if (res?.success) {
      console.log(1);
    }
  };

  const AddImage = async (list: string[]) => {
    if (userId === null) {
      throw new Error("userId cannot be null");
    }
    const [err, res] = await errorCaptureRes(fetchAddImage, {
      user_id: +userId as number,
      img_urls: list,
    });
    if (res?.success) {
      console.log(1);
    }
  };

  const affirmDialog = () => {
    setIsOpen(false);
    if (make) {
      fetchData(likeList);
    } else {
      fetchData([selectImage]);
    }
  };
  const closeDialog = () => setIsOpen(false);
  const cb = (b: boolean) => {
    setActive(b);
  };
  useEffect(() => {
    if (active) {
      setIsAllSelected(
        likeList.length === imageList.length &&
          likeList.every((item) => imageList.includes(item))
      );
    }
  }, [likeList]);
  return (
    <Box h="100vh" position={"relative"} pt={4} px="1rem">
      <Header show noTitle cb={cb}></Header>
      <Toaster />
      <Flex height="28.59rem" w={"full"} justifyContent={"center"}>
        <Box height="28.59rem" w={"21.44rem"} position={"relative"}>
          <Image
            h={"100%"}
            w={"21.44rem"}
            objectFit={"cover"}
            src={selectImage}
          ></Image>
          {!active && selectImage !== originImage && (
            <Flex
              position={"absolute"}
              bottom={0}
              right={"0"}
              gap={"1rem"}
              pb={"0.87rem"}
              pr={"0.87rem"}
            >
              <a href={selectImage} download>
                <Image boxSize={"2.25rem"} src={Download.src}></Image>
              </a>
              <Image
                boxSize={"2.25rem"}
                src={Like.src}
                onClick={() => {
                  AddImage([selectImage]);
                  toaster.create({
                    description: (
                      <Flex
                        justifyContent={"space-between"}
                        alignItems={"center"}
                      >
                        <Flex alignItems={"center"} gap={"0.56rem"}>
                          <Image
                            src={ModalRight.src}
                            boxSize={"1.38rem"}
                          ></Image>
                          <Text
                            fontFamily="PingFangSC, PingFang SC"
                            fontWeight="400"
                            fontSize="0.88rem"
                            color="#171717"
                          >
                            Collect in Default
                          </Text>
                        </Flex>
                        <Flex alignItems={"center"} gap={"0.56rem"}>
                          <Text
                            fontFamily="PingFangSC, PingFang SC"
                            fontWeight="400"
                            fontSize="0.88rem"
                            color="#EE3939"
                          >
                            Move to
                          </Text>
                          <Image src={ModalBack.src} boxSize={"1rem"}></Image>
                        </Flex>
                      </Flex>
                    ),
                  });
                }}
              ></Image>
              <Image
                boxSize={"2.25rem"}
                src={Shop.src}
                onClick={() => {
                  setMake(0);
                  openDialog();
                }}
              ></Image>
            </Flex>
          )}
        </Box>
      </Flex>
      <Flex mt={"1.38rem"} gap={"0.75rem"} overflowY={"auto"}>
        <Box
          position={"relative"}
          height="7.91rem"
          width="5.94rem"
          flexShrink={0}
          border={
            selectImage === originImage
              ? "0.09rem solid #ee3939"
              : "0.09rem solid #CACACA"
          }
          borderRadius="0.5rem"
          overflow={"hidden"}
        >
          <Box
            position={"absolute"}
            flexShrink={0}
            width="3.25rem"
            height="1.13rem"
            background={selectImage === originImage ? "#ee3939" : "#171717"}
            borderRadius="0.5rem 0rem 0.56rem 0rem"
            top={"0px"}
            left={"0px"}
          >
            <Text color="#FFFFFF" fontSize="0.63rem" alignItems={"center"}>
              Original
            </Text>
          </Box>
          <Image
            borderRadius="0.45rem"
            flexShrink={0}
            height="7.91rem"
            width="5.94rem"
            objectFit={"cover"}
            onClick={() => {
              setSelectImage(originImage);
            }}
            src={originImage}
          ></Image>
        </Box>
        {imageList.map((item, index) => {
          return (
            <Box
              flexShrink={0}
              border={
                selectImage === item
                  ? "0.09rem solid #EE3939"
                  : "0.09rem solid transparent"
              }
              borderRadius="0.5rem"
              key={item + index}
              overflow={"hidden"}
              position={"relative"}
            >
              <Image
                flexShrink={0}
                height="7.92rem"
                width="5.94rem"
                objectFit={"cover"}
                src={item}
                borderRadius="0.45rem"
                onClick={() => {
                  if (!active) {
                    setSelectImage(item);
                  } else {
                    setLikeList((prev) => {
                      if (prev.includes(item)) {
                        return prev.filter((likeItem) => likeItem !== item);
                      } else {
                        return [...prev, item];
                      }
                    });
                  }
                }}
              ></Image>
              {active && (
                <Image
                  flexShrink={0}
                  height="1rem"
                  width="1rem"
                  objectFit={"cover"}
                  src={likeList.includes(item) ? Selected.src : NoSelect.src}
                  position={"absolute"}
                  top={"0.38rem"}
                  right={"0.38rem"}
                ></Image>
              )}

              <Image
                flexShrink={0}
                height="1rem"
                width="1rem"
                objectFit={"cover"}
                src={Liked.src}
                position={"absolute"}
              ></Image>
            </Box>
          );
        })}
      </Flex>
      <Box h={"4.75rem"}></Box>
      <Flex
        height="3.75rem"
        position="fixed"
        bottom="0"
        zIndex={111}
        bg={"#fff"}
        maxW="100vw"
        w={"full"}
        alignItems={"center"}
        justifyContent={"flex-end"}
        left="50%"
        transform="translateX(-50%)"
        borderRadius="0.75rem 0.75rem 0rem 0rem"
        boxShadow="0rem -0.06rem 0.31rem 0rem rgba(214,214,214,0.5)"
      >
        {active ? (
          <Flex
            justifyContent={"space-between"}
            width={"full"}
            h={"3.75rem"}
            alignItems={"center"}
            px={"1rem"}
          >
            <Flex
              gap={"0.53rem"}
              alignItems={"center"}
              onClick={() => {
                if (isAllSelected) {
                  setLikeList([]);
                } else {
                  setLikeList(imageList);
                }
              }}
            >
              <Image
                boxSize="1.12rem"
                src={isAllSelected ? Selected.src : AllNo.src}
                // border="0.06rem solid #BFBFBF"
                backdropFilter="blur(50px)"
                borderRadius={"50%"}
              ></Image>
              <Text>Select all</Text>
            </Flex>
            <Flex gap={"1rem"}>
              <Flex
                width="2.5rem"
                height="2.5rem"
                background="rgba(255,255,255,0.5)"
                borderRadius="1.25rem"
                border="0.03rem solid #BFBFBF"
                backdropFilter="blur(50px)"
                alignItems={"center"}
                justifyContent={"center"}
              >
                <Image boxSize={"2.25rem"} src={Download.src}></Image>
              </Flex>
              <Flex
                width="2.5rem"
                height="2.5rem"
                background="rgba(255,255,255,0.5)"
                borderRadius="1.25rem"
                border="0.03rem solid #BFBFBF"
                backdropFilter="blur(50px)"
                alignItems={"center"}
                justifyContent={"center"}
              >
                <Image
                  boxSize={"2.25rem"}
                  src={Like.src}
                  onClick={() => {
                    AddImage(likeList);
                  }}
                ></Image>
              </Flex>
              <Flex
                width="2.5rem"
                height="2.5rem"
                background="rgba(255,255,255,0.5)"
                borderRadius="1.25rem"
                border="0.03rem solid #BFBFBF"
                backdropFilter="blur(50px)"
                alignItems={"center"}
                justifyContent={"center"}
              >
                <Image
                  boxSize={"2.25rem"}
                  src={Shop.src}
                  onClick={() => {
                    setMake(1);
                    setIsOpen(true);
                  }}
                ></Image>
              </Flex>
            </Flex>
          </Flex>
        ) : (
          <Button
            colorScheme="teal"
            width="9.5rem"
            height="2.5rem"
            background="#EE3939"
            borderRadius="1.25rem"
            mr={"1rem"}
            // onClick={() => {
            //   router.push("/generate");
            // }}
          >
            Further Generate
          </Button>
        )}
      </Flex>
      <ToastTest
        isOpen={isOpen}
        phoneNumber={phoneNumber}
        onOpen={openDialog}
        onClose={closeDialog}
        affirmDialog={affirmDialog}
        setPhoneNumber={setPhoneNumber}
      ></ToastTest>
    </Box>
  );
}

export default Page;
