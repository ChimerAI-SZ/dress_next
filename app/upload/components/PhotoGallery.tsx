import React, { useState, useEffect, useId } from "react";
import {
  Box,
  Flex,
  IconButton,
  Text,
  Grid,
  GridItem,
  Image,
  Input,
  Button,
  Spinner,
} from "@chakra-ui/react";
import useAliyunOssUpload from "@hooks/useAliyunOssUpload";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import Add from "@img/upload/add.svg";
import Delete from "@img/upload/delete.svg";

const PatternSelector = () => {
  const { uploadToOss, isUploading, uploadProgress, uploadedUrl } =
    useAliyunOssUpload();
  const uniqueId = useId();
  const [urlList, setUrlList] = useState([
    {
      url: "https://aimoda-ai.oss-us-east-1.aliyuncs.com/6d73505035e44870b42dc0290f8c3651%20(1).jpg?id=1",
      drc: "asdk",
      selected: false,
    },
    {
      url: "https://aimoda-ai.oss-us-east-1.aliyuncs.com/6d73505035e44870b42dc0290f8c3651%20(1).jpg?id=2",
      drc: "asdk",
      selected: false,
    },
    {
      url: "https://aimoda-ai.oss-us-east-1.aliyuncs.com/6d73505035e44870b42dc0290f8c3651%20(1).jpg?id=3",
      drc: "asdk",
      selected: false,
    },
    {
      url: "https://aimoda-ai.oss-us-east-1.aliyuncs.com/6d73505035e44870b42dc0290f8c3651%20(1).jpg?id=7",
      drc: "asdk",
      selected: false,
    },
    {
      url: "https://aimoda-ai.oss-us-east-1.aliyuncs.com/6d73505035e44870b42dc0290f8c3651%20(1).jpg?id=4",
      drc: "asdkkasdhgakssdafhkua",
      selected: false,
    },
    {
      url: "https://aimoda-ai.oss-us-east-1.aliyuncs.com/6d73505035e44870b42dc0290f8c3651%20(1).jpg?id=5",
      drc: "asdk",
      selected: false,
    },
    {
      url: "https://aimoda-ai.oss-us-east-1.aliyuncs.com/6d73505035e44870b42dc0290f8c3651%20(1).jpg?id=6",
      drc: "asdk",
      selected: false,
    },
  ]);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(urlList.length / itemsPerPage);
  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await uploadToOss(file);
        console.log(uploadedUrl);
      } catch (err) {}
    }
  };
  const handleImageDelete = (src: string) => {
    setUrlList((prevList) => prevList.filter((item) => item.url !== src));
  };
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    if (uploadProgress === 100) {
      setUrlList((pre) =>
        uploadedUrl
          ? [{ url: uploadedUrl, drc: "upload", selected: false }, ...pre]
          : pre
      );
    }
  }, [uploadProgress]);

  const handleSelectImage = (url: string) => {
    setUrlList((prevList) =>
      prevList.map((item) =>
        item.url === url
          ? { ...item, selected: true }
          : { ...item, selected: false }
      )
    );
  };

  return (
    <Flex w="full" flexDirection={"column"}>
      <Box h={"11rem"} overflow={"hidden"}>
        <Swiper onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}>
          {[...Array(2)].map((_, pageIndex) => (
            <SwiperSlide key={pageIndex}>
              <Grid
                templateColumns="repeat(3, 1fr)"
                gap={2}
                pt={"0.75rem"}
                position={"relative"}
              >
                {pageIndex === 0 && (
                  <Box position="relative">
                    <Input
                      type="file"
                      accept="image/*"
                      display="none"
                      id={uniqueId}
                      onChange={(e) => handleImageChange(e)}
                    />
                    <label htmlFor={uniqueId}>
                      <Box
                        w="4.69rem"
                        h="4.69rem"
                        borderRadius="0.5rem"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        background="#F5F5F5"
                      >
                        <Image
                          src={Add.src}
                          alt="Like"
                          h="1.05rem"
                          w="1.06rem"
                          cursor="pointer"
                        />
                      </Box>
                    </label>
                  </Box>
                )}
                {isUploading && pageIndex === 0 && (
                  <Box
                    w="4.69rem"
                    h="4.69rem"
                    borderRadius="0.5rem"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    background="#F5F5F5"
                  >
                    <Spinner size="xl" />
                  </Box>
                )}
                {urlList
                  .slice(
                    pageIndex * itemsPerPage,
                    (pageIndex + 1) * itemsPerPage
                  )
                  .map((item, index) => (
                    <GridItem
                      key={item.url}
                      position="relative"
                      w="4.68rem"
                      h="4.67rem"
                      borderRadius="0.5rem"
                      onClick={() => handleSelectImage(item.url)}
                      border={
                        item.selected
                          ? "1px solid #dd4d4d"
                          : "1px solid transparent"
                      }
                      zIndex={33}
                    >
                      <Image
                        src={`${item.url}`}
                        alt={`Small Image ${index + 1}`}
                        w="4.68rem"
                        h="4.5rem"
                        objectFit="cover"
                        cursor="pointer"
                        borderRadius="0.5rem"
                      />
                      {item.drc === "upload" ? (
                        <Image
                          src={Delete.src}
                          alt={`Small Image ${index + 1}`}
                          w="1rem"
                          h="1rem"
                          position="absolute"
                          top={"-0.5rem"}
                          right={"-0.5rem"}
                          zIndex={22}
                          cursor={"pointer"}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImageDelete(item.url);
                          }}
                        />
                      ) : (
                        <Flex
                          align="center"
                          justify="center"
                          position="absolute"
                          bottom="0"
                          w="full"
                          background={
                            item.selected
                              ? "rgba(213,32,32,0.85)"
                              : "rgba(23,23,23,0.6)"
                          }
                          borderRadius="0rem 0rem 0.4rem 0.4rem"
                        >
                          <Text
                            fontFamily="PingFangSC, PingFang SC"
                            color="white"
                            fontSize="0.69rem"
                            whiteSpace="normal"
                            wordBreak="break-word"
                            fontWeight="400"
                          >
                            {item.drc}
                          </Text>
                        </Flex>
                      )}
                    </GridItem>
                  ))}
              </Grid>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
      <Flex justifyContent="center" mt={4} gap={2}>
        {[...Array(4)].map((_, index) => (
          <Box
            key={index}
            width={index === activeIndex ? "1rem" : "0.44rem"}
            height="0.44rem"
            bg={index === activeIndex ? "#EE3939" : "#E5E5E5"}
            borderRadius="0.22rem"
            transition="width 0.3s, background-color 0.3s"
          />
        ))}
      </Flex>
    </Flex>
  );
};

export default PatternSelector;
