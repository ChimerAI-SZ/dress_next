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
import {
  fetchVerification,
  fetchRegister,
  fetchReset,
} from "@lib/request/login";
import { errorCaptureRes } from "@utils/index";
import {
  loadPublicKey,
  importPublicKey,
  encryptData,
  arrayBufferToBase64,
} from "../utils";
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

  const getEncryption = async () => {
    try {
      const pem = await loadPublicKey("/public_key.pem");
      const publicKey = await importPublicKey(pem);

      const data = {
        email: params.email,
        timestamp: Math.floor(Date.now() / 1000),
      };

      const encryptedData = await encryptData(publicKey, data);

      return arrayBufferToBase64(encryptedData);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  // 处理发送验证码逻辑
  const handleSendCode = async () => {
    const encryptedBase64 = await getEncryption();
    // const emailRegistered = await checkEmailRegistered(data.email);
    const [err, res] = await errorCaptureRes(fetchVerification, {
      signature: encryptedBase64,
    });
    if (res) {
      setSeconds(60);
      setCanResend(false);
    }
  };

  const vertify = async () => {
    if (code.length === 4 && !params.retrievePassword) {
      const [err, res] = await errorCaptureRes(fetchRegister, {
        ...params,
        verification_code: code,
      });
      if (res.success) {
        router.push(`/login`);
      }
    } else if (code.length === 4 && params.retrievePassword) {
      const [err, res] = await errorCaptureRes(fetchReset, {
        ...params,
        verification_code: code,
      });
      if (res.success) {
        router.push(`/retrieve-password/new-password?email=${params.email}`);
      }
    }
  };
  return (
    <Flex maxW="md" px="1.5rem" justifyContent={"center"} alignItems={"center"}>
      <VStack align="stretch" minH="100vh">
        <Flex h={"2.75rem"} w={"full"} alignItems={"center"}>
          <Image src={Back.src} w={"1.38rem"} h={"1.38rem"}></Image>
        </Flex>
        <Text
          fontSize="1.38rem"
          fontWeight="600"
          color="#171717"
          fontFamily="PingFangSC, PingFang SC"
          mt={"0.5rem"}
        >
          Vertify Email
        </Text>
        <Text
          fontFamily="PingFangSC, PingFang SC"
          fontSize="0.88rem"
          fontWeight="400"
          color="#737373"
          mt={"0.75rem"}
        >
          Please check your mail. We've sent a code to:
        </Text>
        <Text
          fontFamily="PingFangSC, PingFang SC"
          fontSize="0.88rem"
          fontWeight="700"
          color="#000"
        >
          {params.email}
        </Text>
        <Text
          fontFamily="PingFangSC, PingFang SC"
          fontSize="0.81rem"
          fontWeight="400"
          color="#737373"
          mt={"2.5rem"}
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
          mt={"0.5rem"}
        >
          {canResend ? (
            <Text color="#EE3939" onClick={handleSendCode}>
              Resend code
            </Text>
          ) : (
            `Resend code in ${seconds}s`
          )}
        </Text>
        <VStack pb="4rem" w="100%">
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
    </Flex>
  );
};

export default Page;
