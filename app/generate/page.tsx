"use client";
import { useState, useEffect, useRef } from "react";
import { Text, Box, Image, Flex } from "@chakra-ui/react";
import Spline from "@splinetool/react-spline/next";
import { Application } from "@splinetool/runtime";

import Header from "@components/Header";
import PrintGeneration from "@img/upload/print-generation.svg";
import Bg from "@img/generate/bg.png";
import Waterfall from "../components/Waterfall";
import { useSearchParams } from "next/navigation";
import { workflow } from "./workflow/workflow";
import { getResult } from "@lib/request/generate";
function Page() {
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  const [imageList, setImageList] = useState<string[]>([]);
  const [splineComponent, setSplineComponent] = useState<JSX.Element | null>(
    null
  );
  const [taskIDs, setTaskIDs] = useState<string[]>([]);

  const hasRunRef = useRef(false);
  useEffect(() => {
    if (!hasRunRef.current) {
      workflow(params).then((newTaskIDs) => {
        if (newTaskIDs) {
          setTaskIDs(newTaskIDs);
        }
      });
      hasRunRef.current = true;
    }
  }, [params]);
  useEffect(() => {
    const loadSpline = async () => {
      const component = await Spline({
        scene: "https://prod.spline.design/OeaC0pc8AQW4AwPQ/scene.splinecode",
        onLoad: (app: Application) => {
          app.setZoom(1.5); // 缩小视角，数字越小视角越远
        },
      });
      setSplineComponent(component);
    };
    loadSpline();
  }, []);

  const getImage = async (taskID: string) => {
    try {
      const result = await getResult({ taskID });
      if ("code" in result) {
        console.log(result.code);
        if (result.code !== 0) {
          setTaskIDs((prevIDs) => prevIDs.filter((id) => id !== taskID));
          return;
        }
      }
      const { progress, imageFiles } = result.data;
      if (progress === 100) {
        imageFiles.forEach((element: { url: any }, index: number) => {
          const newUrl = `${element.url}?id=${taskID}`;
          setImageList((pre) => [...pre, newUrl]);
        });
        setTaskIDs((prevIDs) => prevIDs.filter((id) => id !== taskID));
      } else {
        console.log(`Task ${taskID} still in progress`);
      }
    } catch (err) {
      setTaskIDs((prevIDs) => prevIDs.filter((id) => id !== taskID));
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (taskIDs.length > 0) {
        taskIDs.forEach((taskID) => {
          getImage(taskID);
        });
      } else {
        console.log("All tasks complete or no tasks left.");
      }
    }, 15000);

    return () => {
      console.log("Cleaning up interval");
      clearInterval(interval);
    };
  }, [taskIDs]);

  return (
    <Box
      //   bgSize="contain"
      //   bgRepeat={"no-repeat"}
      //   bgImage={`url(${Bg.src})`}
      //   backgroundPositionY="-1rem"
      h="100vh"
      position={"relative"}
    >
      <Box
        position={"absolute"}
        height="28.06rem"
        zIndex={0}
        borderRadius={"0rem  0rem  1.13rem  1.13rem"}
        pointerEvents="none"
        overflow={"hidden"}
        width={"full"}
      >
        {splineComponent || (
          <Image
            src={Bg.src}
            position={"absolute"}
            zIndex={0}
            height="28.06rem"
            objectFit="cover"
            w={"full"}
          ></Image>
        )}
      </Box>
      <Box pt={4}></Box>
      <Header></Header>
      <Flex
        justifyContent={"center"}
        alignItems={"center"}
        mt={"3.63rem"}
        position={"relative"}
        flexDirection={"column"}
      >
        <Image
          boxSize={"7.13rem"}
          borderRadius="full"
          src="https://aimoda-ai.oss-us-east-1.aliyuncs.com/6d73505035e44870b42dc0290f8c3651%20(1).jpg"
        ></Image>
        <Text
          fontFamily="PingFangSC, PingFang SC"
          fontWeight="600"
          fontSize="1.25rem"
          color="#404040"
        >
          Estimated wait 6 mins
        </Text>
        <Text
          font-family="PingFangSC, PingFang SC"
          font-weight="400"
          font-size="0.88rem"
          color=" #404040"
        >
          Queuing to generate preview...
        </Text>
        <Text
          font-family="PingFangSC, PingFang SC"
          font-weight="400"
          font-size="0.88rem"
          color=" #404040"
        >
          8 people before you
        </Text>
      </Flex>
      <Text
        fontFamily="PingFangSC, PingFang SC"
        fontWeight="500"
        fontSize="1rem"
        color="#171717"
        mt={"10rem"}
        px={"1rem"}
      >
        While you wait
      </Text>
      <Flex px={"1rem"}>
        <Text
          fontFamily="PingFangSC, PingFang SC"
          fontWeight="500"
          fontSize="1rem"
          color="#171717"
        >
          Check out our amazing creations!
        </Text>
        <Image src={PrintGeneration.src} w={"0.88rem"} h="0.88rem"></Image>
      </Flex>
      <Box
        overflowY="auto"
        maxH="calc(100vh - 305px)"
        px={"1rem"}
        mt={"0.75rem"}
      >
        <Waterfall />
      </Box>
    </Box>
  );
}

export default Page;
