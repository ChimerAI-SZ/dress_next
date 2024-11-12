"use client";
import { useState, useEffect, useRef } from "react";
import { Text, Box, Image, Flex } from "@chakra-ui/react";
import Spline from "@splinetool/react-spline/next";
import { Application } from "@splinetool/runtime";

import Header from "@components/Header";
import PrintGeneration from "@img/upload/print-generation.svg";
import Bg from "@img/generate/bg.png";
import Waterfall from "../components/Waterfall";
import { useSearchParams, useRouter } from "next/navigation";
import { workflow } from "./workflow/workflow";
import { getResult } from "@lib/request/workflow";
import { fetchUtilWait } from "@lib/request/generate";
import { errorCaptureRes } from "@utils/index";
import {
  ProgressCircleRing,
  ProgressCircleRoot,
  ProgressCircleValueText,
} from "@components/ui/progress-circle";
function Page() {
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  const [imageList, setImageList] = useState<string[]>([]);
  const [splineComponent, setSplineComponent] = useState<JSX.Element | null>(
    null
  );
  const [info, setInfo] = useState({ total_messages: 0, wait_time: 0 });
  const [taskIDs, setTaskIDs] = useState<string[]>([]);
  const router = useRouter(); //
  const hasRunRef = useRef(false);

  const fetchData = async () => {
    const [err, res] = await errorCaptureRes(fetchUtilWait);
    if (res?.success) {
      setInfo((pre) => ({
        ...pre,
        total_messages: Math.ceil(res.total_messages / 3.5),
        wait_time: Math.ceil(res.wait_time / 60),
      }));
    }
  };

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
    fetchData();
  }, []);
  useEffect(() => {
    if (taskIDs.length === 0 && imageList.length > 0) {
      const imageListParam = encodeURIComponent(JSON.stringify(imageList));
      // router.push(
      //   `/generate-result?loadOriginalImage=${params.loadOriginalImage}&imageList=${imageListParam}`
      // );
    }
  }, [taskIDs, imageList, router]);

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
  console.log(taskIDs);
  useEffect(() => {
    const interval = setInterval(() => {
      if (taskIDs.length > 0) {
        taskIDs.forEach((taskID) => {
          getImage(taskID);
        });
        fetchData();
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
    <Box h="100vh" position={"relative"}>
      <Box
        position={"absolute"}
        height="25rem"
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
            height="25.66rem"
            objectFit="cover"
            w={"full"}
          ></Image>
        )}
      </Box>
      <Box pt={4}></Box>
      <Header noTitle={true}></Header>
      <Flex
        justifyContent={"center"}
        alignItems={"center"}
        mt={"5.5rem"}
        position={"relative"}
        flexDirection={"column"}
      >
        <Flex
          zIndex={0}
          bgColor={"transparent"}
          width="8.13rem"
          height="8.13rem"
          background="rgba(255,255,255,0.1)"
          boxShadow="0rem 0rem 0.31rem 0rem rgba(255,255,255,0.5), inset 0rem 0rem 0.47rem 0rem rgba(255,255,255,0.8)"
          border="0.06rem solid #fffeff"
          justifyContent={"center"}
          alignItems={"center"}
          borderRadius="full"
        >
          <Image
            boxSize={"7.13rem"}
            borderRadius="full"
            src={params.loadOriginalImage}
            border="0.06rem solid #fffeff"
          ></Image>
        </Flex>

        <Text
          fontFamily="PingFangSC, PingFang SC"
          fontWeight="600"
          fontSize="1.25rem"
          color="#404040"
          mt={"2.69rem"}
        >
          {info?.total_messages
            ? `Estimated wait ${info?.wait_time ?? "--"} mins`
            : ""}
        </Text>
        <Text
          font-family="PingFangSC, PingFang SC"
          font-weight="400"
          font-size="0.88rem"
          color=" #404040"
          mt={"0.44rem"}
        >
          {!info?.total_messages
            ? "Generating for you..."
            : "Queuing to generate preview..."}
        </Text>
        <Text
          font-family="PingFangSC, PingFang SC"
          font-weight="400"
          font-size="0.88rem"
          color=" #404040"
        >
          {!info?.total_messages
            ? "people before you"
            : "You can check results anytime in history"}
        </Text>
      </Flex>
      <Text
        fontFamily="PingFangSC, PingFang SC"
        fontWeight="500"
        fontSize="1rem"
        color="#171717"
        mt={"4.5rem"}
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
        <Image
          src={PrintGeneration.src}
          w={"0.88rem"}
          h="0.88rem"
          ml={"0.3rem"}
        ></Image>
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
