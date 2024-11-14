"use client";
import React, { useState, useEffect } from "react";
import { Box, Flex, Text, Button, Image } from "@chakra-ui/react";
import {
  DrawerActionTrigger,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "@components/ui/drawer";
import ColorPicker from "@img/upload/color-picker.svg";
import styled from "@emotion/styled";
import Close from "@img/upload/close.svg";
import ColourDisk from "@img/upload/colour-disk.svg";
import Add from "@img/upload/add.svg";
import ColorRight from "@img/upload/color-right.svg";
import { HexColorPicker } from "react-colorful";
import { TypesClothingProps } from "@definitions/update";
const Page = ({ onParamsUpdate }: TypesClothingProps) => {
  const [color, setColor] = useState("#FDFCFA"); // 初始颜色
  const [customColors, setCustomColors] = useState<string[]>([
    "#FDFCFA",
    "#FDFCFA",
    "#FDFCFA",
    "#FDFCFA",
    "#FDFCFA",
    "#FDFCFA",
    "#FDFCFA",
    "#FDFCFA",
  ]); // 自定义颜色列表
  const [colorList, setColorList] = useState([
    "#d4dab6",
    "#facfc9",
    "#95b9db",
    "#f4d0ba",
    "#f0ebd8",
    "#bcc8c4",
    "#d2a97b",
    "#b49883",
    "#6d7174",
    "#584245",
  ]);

  const handleAddColor = () => {
    setCustomColors((prevColors) => {
      // 如果颜色已存在，先将其从数组中删除
      const updatedColors = prevColors.filter((c) => c !== color);
      // 将颜色添加到数组的第一位
      return [color, ...updatedColors].slice(0, 8);
    });
  };
  useEffect(() => {
    onParamsUpdate({ backgroundColor: color });
  }, [color]);
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      px="0.75rem"
      pt="1.2rem"
    >
      <Flex width={"full"} overflowY={"auto"} gap={"0.56rem"} h={"1.9rem"}>
        <DrawerRoot placement="bottom">
          <DrawerBackdrop />
          <DrawerTrigger asChild>
            <Image
              src={ColourDisk.src}
              width="1.75rem"
              height="1.75rem"
            ></Image>
          </DrawerTrigger>
          <DrawerContent
            roundedTop={"13"}
            borderRadius="0.75rem 0.75rem 0rem 0rem"
          >
            <Flex
              alignItems="center"
              justifyContent="center"
              mt={"0.7rem"}
              width="full"
              position="relative"
              cursor={"pointer"}
            >
              <DrawerActionTrigger asChild>
                <Image
                  src={Close.src}
                  boxSize="1.3rem"
                  position="absolute"
                  left="1rem"
                  top="50%"
                  transform="translateY(-50%)"
                />
              </DrawerActionTrigger>
              <Text
                fontSize="1.06rem"
                fontWeight="500"
                letterSpacing="0.1rem"
                fontFamily="PingFangSC, PingFang SC"
                textAlign="center"
                color="#171717"
              >
                Custom
              </Text>
            </Flex>
            <Box as={CustomColorPickerBox} w={"full"}>
              <HexColorPicker
                color={color}
                onChange={setColor}
                style={{
                  width: "100%",
                  height: "11.4rem",
                  padding: "10px",
                  background: "white",
                  borderRadius: "8px",
                }}
              />
            </Box>
            <Flex
              alignItems={"center"}
              gap={"0.57rem"}
              px="0.75rem"
              overflowY={"auto"}
              mt={"0.3rem"}
            >
              <Button
                onClick={handleAddColor}
                h={"1.69rem"}
                w={"3.94rem"}
                colorScheme="blackAlpha"
                borderRadius="0.84rem"
                flexShrink={0}
              >
                <Image src={Add.src} h={"0.88rem"} w={"0.88rem"}></Image>
                <Text
                  fontFamily="PingFangSC, PingFang SC"
                  fontSize="0.88rem"
                  fontWeight="500"
                >
                  Add
                </Text>
              </Button>
              {customColors.map((item, index) => {
                return (
                  <Flex
                    key={item + index}
                    w="1.69rem"
                    h={"1.69rem"}
                    bg={item}
                    border={
                      item === "#FDFCFA" ? "0.06rem dashed  #979797" : "none"
                    }
                    borderRadius={"50%"}
                    flexShrink={0}
                    onClick={() => {
                      setColor(item);
                    }}
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    {color === item && (
                      <Image
                        src={ColorRight.src}
                        w="0.72rem"
                        h={"0.5rem"}
                      ></Image>
                    )}
                  </Flex>
                );
              })}
            </Flex>

            <DrawerBody></DrawerBody>
          </DrawerContent>
        </DrawerRoot>

        {/* <Image
          src={ColorPicker.src}
          width="1.75rem"
          height="1.75rem"
          border="0.06rem solid #BFBFBF"
          borderRadius={"50%"}
        ></Image> */}

        <Box
          width="1.75rem"
          height="1.75rem"
          borderRadius="50%"
          bg={color}
          border={color === "#FDFCFA" ? "0.06rem solid #BFBFBF" : "none"}
          flexShrink={0}
        ></Box>
        {colorList.map((item) => {
          return (
            <Flex
              width="1.75rem"
              height="1.75rem"
              borderRadius="50%"
              bg={item}
              flexShrink={0}
              key={item}
              alignItems={"center"}
              justifyContent={"center"}
              onClick={() => {
                setColor(item);
              }}
            >
              {color === item && (
                <Image src={ColorRight.src} w="0.72rem" h={"0.5rem"}></Image>
              )}
            </Flex>
          );
        })}
      </Flex>
    </Flex>
  );
};

export default Page;
const CustomColorPickerBox = styled(Box)`
  border-radius: 12px;

  .react-colorful__saturation {
    margin: 15px 0;
    border-radius: 5px;
    border-bottom: none;
  }

  .react-colorful__hue {
    order: 1;
    height: 5px;
    border-radius: 5px;
  }

  .react-colorful__alpha {
    height: 5px;
    border-radius: 5px;
  }

  .react-colorful__hue-pointer,
  .react-colorful__alpha-pointer {
    width: 18px;
    height: 18px;
  }
`;
