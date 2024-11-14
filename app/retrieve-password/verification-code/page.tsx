"use client";
import {
  Button,
  Input,
  Container,
  VStack,
  Text,
  Image,
  Flex,
  Box,
} from "@chakra-ui/react";
import { PinInput } from "@components/ui/pin-input";
import { useSearchParams, useRouter } from "next/navigation";
import Back from "@img/login/back.svg";
import { useState, useEffect } from "react";
import { Alert } from "@components/Alert";
import {
  fetchCheckEmail,
  fetchRegister,
  fetchReset,
  fetchResetPassword,
} from "@lib/request/login";
import { errorCaptureRes } from "@utils/index";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  const [seconds, setSeconds] = useState(60); // 初始倒计时秒数
  const [canResend, setCanResend] = useState(false); // 控制是否可以重新发送验证码
  const [code, setCode] = useState("");
  useEffect(() => {
    if (seconds === 0) {
      setCanResend(true); // 倒计时结束后，允许重新发送验证码
      return;
    }

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  // 处理发送验证码逻辑
  const handleSendCode = async () => {
    // const emailRegistered = await checkEmailRegistered(data.email);
    const [err, res] = await errorCaptureRes(fetchResetPassword, {
      email: params.email,
    });
    if (res) {
      setSeconds(60);
      setCanResend(false);
      Alert.open({
        content: "Sent Successfully!",
      });
    }
  };

  const vertify = async () => {
    const [err, res] = await errorCaptureRes(fetchCheckEmail, {
      ...params,
      verification_code: code,
    });
    if (res.success) {
      router.push(
        `/retrieve-password/new-password?email=${params.email}&code=${code}`
      );
    }
  };
  return (
    <VStack align="stretch" minH="100vh" p={3} px={5}>
      <Flex h={"2.75rem"} w={"full"} alignItems={"center"}>
        <Image
          src={Back.src}
          w={"1.38rem"}
          h={"1.38rem"}
          onClick={() => {
            router.back();
          }}
        ></Image>
      </Flex>
      <Text
        fontSize="1.38rem"
        fontWeight="600"
        color="#171717"
        fontFamily="PingFangSC, PingFang SC"
        mt={"0.1rem"}
        pl={"0.25rem"}
      >
        Vertify Email
      </Text>
      <Text
        fontFamily="PingFangSC, PingFang SC"
        fontSize="0.88rem"
        fontWeight="400"
        color="#737373"
        mt={"0.19rem"}
        pl={"0.25rem"}
      >
        Please check your mail. We've sent a code to:
      </Text>
      <Text
        fontFamily="PingFangSC, PingFang SC"
        fontSize="0.88rem"
        fontWeight="700"
        color="#000"
        mt={"-0.2rem"}
        pl={"0.25rem"}
      >
        {params.email}
      </Text>
      <Text
        fontFamily="PingFangSC, PingFang SC"
        fontSize="0.81rem"
        fontWeight="400"
        color="#737373"
        mt={"2.1rem"}
        pl={"0.25rem"}
      >
        Please enter verification code below:
      </Text>
      <PinInput
        placeholder=""
        mt={"0.5rem"}
        onValueComplete={(e) => {
          setCode(e.valueAsString);
        }}
        css={{
          _focusVisible: {
            borderColor: "#ef4444",
            boxShadow: "none",
            outlineStyle: "none",
          },
        }}
      ></PinInput>
      <Text
        fontFamily="PingFangSC, PingFang SC"
        fontSize="0.81rem"
        fontWeight="400"
        color="#737373"
        mt={"0rem"}
        pl={"0.25rem"}
      >
        {canResend ? (
          <Text color="#EE3939" onClick={handleSendCode}>
            Resend code
          </Text>
        ) : (
          `Resend code in ${seconds}s`
        )}
      </Text>
      <VStack pb="4rem" w="100%" mt={"1.2rem"}>
        <Button
          width="20.44rem"
          height="2.75rem"
          background={"#EE3939"}
          borderRadius="1.38rem"
          onClick={vertify}
        >
          <Text
            fontFamily="PingFangSC, PingFang SC"
            fontWeight="600"
            fontSize="1.06rem"
            color="#FFFFFF"
          >
            Vertify
          </Text>
        </Button>
      </VStack>
    </VStack>
  );
};

export default Page;
