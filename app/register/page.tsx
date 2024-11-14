"use client";
import {
  Button,
  Input,
  Container,
  VStack,
  Text,
  Flex,
  Fieldset,
  Box,
  Image,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { Field } from "@components/ui/field";
import { InputGroup } from "@components/ui/input-group";
import { useForm } from "react-hook-form";
import Right from "@img/login/right.svg";
import Lock from "@img/login/.svg";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { fetchVerification } from "@lib/request/login";
import { errorCaptureRes } from "@utils/index";
import Bg from "@img/login/bg.png";
import {
  loadPublicKey,
  importPublicKey,
  encryptData,
  arrayBufferToBase64,
} from "./utils";
interface FormValues {
  email: string;
  first: string;
  last: string;
  code: string;
  password: string;
}

// 定义页面状态
const Page = () => {
  const router = useRouter();
  const [isLengthValid, setIsLengthValid] = useState(false);
  const [isUppercaseValid, setIsUppercaseValid] = useState(false);
  const [isNumberValid, setIsNumberValid] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<FormValues>();
  // 使用 watch 获取当前表单中的 email 值
  const email = watch("email");
  const password = watch("password");
  useEffect(() => {
    setIsLengthValid(password?.length >= 8); // 检查密码长度
    setIsUppercaseValid(/[A-Z]/.test(password) && /[a-z]/.test(password)); // 检查大小写字母
    setIsNumberValid(/\d/.test(password)); // 检查是否包含数字
  }, [password]);
  const getEncryption = async () => {
    try {
      const pem = await loadPublicKey("/public_key.pem");
      const publicKey = await importPublicKey(pem);

      const data = { email: email, timestamp: Math.floor(Date.now() / 1000) };

      const encryptedData = await encryptData(publicKey, data);

      return arrayBufferToBase64(encryptedData);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  // 处理发送验证码逻辑
  const handleSendCode = async (data: FormValues) => {
    const encryptedBase64 = await getEncryption();
    // const emailRegistered = await checkEmailRegistered(data.email);
    const [err, res] = await errorCaptureRes(fetchVerification, {
      signature: encryptedBase64,
    });
    if (res) {
      const queryString = new URLSearchParams(data as any).toString();
      router.push(`/register/verification-code?${queryString}`);
    }
  };

  // 表单最终提交逻辑
  const onSubmit = (data: FormValues) => {
    console.log("Registration data:", data);
    // 执行最终注册逻辑
  };

  return (
    <VStack align="stretch" minH="100vh" position={"relative"}>
      <Box
        height="16.15rem"
        bgImage={`url(${Bg.src})`}
        bgSize="cover"
        bgRepeat="no-repeat"
        position="center"
        width={"100%"}
        p={3}
        px={5}
      >
        <Text
          fontSize="2.75rem"
          fontWeight="600"
          color="#EE3939"
          fontFamily="PingFangSC, PingFang SC"
          mt={"3.25rem"}
        >
          Hello
        </Text>
        <Text
          fontFamily="PingFangSC, PingFang SC"
          fontSize="2.75rem"
          fontWeight="600"
          color="#171717"
          mt={"-0.9rem"}
        >
          there!
        </Text>
        <Text
          fontFamily="PingFangSC, PingFang SC"
          fontSize="0.81rem"
          fontWeight="400"
          color="#737373"
          mt={"0.64rem"}
        >
          Sign up before you generate crazy ideas!
        </Text>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack p={3} px={5} pb="1.5rem" w="100%" mt={"-1rem"}>
          <Fieldset.Root w="100%">
            <Fieldset.Content w="100%">
              {/* 用户名输入框 */}
              <Field
                label="First name"
                fontFamily="Arial"
                fontSize="0.75rem"
                fontWeight="400"
                invalid={!!errors.first}
              >
                <InputGroup w="100%" bg={!!errors.first ? "#ffe0e0" : ""}>
                  <Input
                    {...register("first", {
                      required: "first name is required",
                    })}
                    flex="1"
                    name="first"
                    // placeholder="Type your username"
                    _focusVisible={{
                      borderColor: "#404040",
                      boxShadow: "none",
                      outlineStyle: "none",
                    }}
                  />
                </InputGroup>
                {errors.first && (
                  <Text color="red.500" fontSize="0.75rem">
                    {errors.first.message}
                  </Text>
                )}
              </Field>
              {/* 用户名输入框 */}
              <Field
                label="Last name"
                fontFamily="Arial"
                fontSize="0.75rem"
                fontWeight="400"
                invalid={!!errors.last}
                mt={"1.0rem"}
              >
                <InputGroup w="100%" bg={!!errors.last ? "#ffe0e0" : ""}>
                  <Input
                    {...register("last", {
                      required: "last name is required",
                    })}
                    flex="1"
                    name="last"
                    // placeholder="Type your last name"
                    _focusVisible={{
                      borderColor: "#404040",
                      boxShadow: "none",
                      outlineStyle: "none",
                    }}
                  />
                </InputGroup>
                {errors.last && (
                  <Text color="red.500" fontSize="0.75rem">
                    {errors.last.message}
                  </Text>
                )}
              </Field>
              {/* 邮箱输入框 */}
              <Field
                label="Email"
                fontFamily="Arial"
                fontSize="0.75rem"
                fontWeight="400"
                w="100%"
                invalid={!!errors.email}
                mt={"1.0rem"}
              >
                <InputGroup w="100%" bg={!!errors.email ? "#ffe0e0" : ""}>
                  <Input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                        message: "Invalid email format",
                      },
                    })}
                    maxW="md"
                    name="email"
                    type="email"
                    _focusVisible={{
                      borderColor: "#404040",
                      boxShadow: "none",
                      outlineStyle: "none",
                    }}
                  />
                </InputGroup>
                {errors.email && (
                  <Text color="red.500" fontSize="0.75rem">
                    {errors.email.message}
                  </Text>
                )}
              </Field>
              {/* 密码输入框 */}
              <Field
                label="Password"
                fontFamily="Arial"
                fontSize="0.75rem"
                fontWeight="400"
                invalid={!!errors.password}
                mt={"1.0rem"}
              >
                <InputGroup w="100%" bg={!!errors.password ? "#ffe0e0" : ""}>
                  <Input
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    flex="1"
                    name="password"
                    type="password"
                    _focusVisible={{
                      borderColor: "#404040",
                      boxShadow: "none",
                      outlineStyle: "none",
                    }}
                  />
                </InputGroup>
                {errors.password && (
                  <Text color="red.500" fontSize="0.75rem">
                    {errors.password.message}
                  </Text>
                )}
                <Flex alignItems={"center"} gap={"0.56rem"}>
                  {isLengthValid ? (
                    <Image src={Right.src} boxSize="0.44rem"></Image>
                  ) : (
                    <Box
                      boxSize={"0.19rem"}
                      bg={"#737373"}
                      borderRadius={"50%"}
                    ></Box>
                  )}

                  <Text
                    fontFamily="PingFangSC, PingFang SC"
                    fontWeight="400"
                    fontSize="0.81rem"
                    color={isLengthValid ? "#299E46" : "#737373"} // 动态变色
                  >
                    At least 8 characters
                  </Text>
                </Flex>
                <Flex alignItems={"center"} gap={"0.56rem"}>
                  {isUppercaseValid ? (
                    <Image src={Right.src} boxSize="0.44rem"></Image>
                  ) : (
                    <Box
                      boxSize={"0.19rem"}
                      bg={"#737373"}
                      borderRadius={"50%"}
                    ></Box>
                  )}
                  <Text
                    fontFamily="PingFangSC, PingFang SC"
                    fontWeight="400"
                    fontSize="0.81rem"
                    color={isUppercaseValid ? "#299E46" : "#737373"} // 动态变色
                  >
                    Both upper and lower case letters
                  </Text>
                </Flex>
                <Flex alignItems={"center"} gap={"0.56rem"}>
                  {isNumberValid ? (
                    <Image src={Right.src} boxSize="0.44rem"></Image>
                  ) : (
                    <Box
                      boxSize={"0.19rem"}
                      bg={"#737373"}
                      borderRadius={"50%"}
                    ></Box>
                  )}
                  <Text
                    fontFamily="PingFangSC, PingFang SC"
                    fontWeight="400"
                    fontSize="0.81rem"
                    color={isNumberValid ? "#299E46" : "#737373"} // 动态变色
                  >
                    At least 1 number
                  </Text>
                </Flex>
              </Field>
            </Fieldset.Content>
          </Fieldset.Root>
        </VStack>

        <VStack w="100%">
          <Button
            onClick={handleSubmit(handleSendCode)}
            width="20.44rem"
            height="2.75rem"
            background={"#EE3939"}
            borderRadius="1.38rem"
            disabled={
              !(
                isLengthValid &&
                isUppercaseValid &&
                isNumberValid &&
                Object.keys(errors).length === 0
              )
            }
          >
            <Text
              fontFamily="PingFangSC, PingFang SC"
              fontWeight="600"
              fontSize="1.06rem"
              color="#FFFFFF"
            >
              Create an Account
            </Text>
          </Button>
        </VStack>
      </form>
      <Flex
        alignItems={"center"}
        justifyContent={"center"}
        position="relative" // 取消固定定位
        bottom="0"
        width={"100vw"}
        left="50%"
        transform="translateX(-50%)"
        zIndex={0}
        mt="auto" // 这个可以确保元素被推到页面的底部
        mb={"1.5rem"}
      >
        <Text
          fontFamily="PingFangSC, PingFang SC"
          fontWeight="400"
          fontSize="0.88rem"
          color="#404040"
        >
          Already have an account?
        </Text>
        <Text
          fontFamily="PingFangSC, PingFang SC"
          fontWeight="400"
          fontSize="0.88rem"
          color="#EE3939"
          onClick={() => {
            router.push("login");
          }}
        >
          &ensp;Log in
        </Text>
      </Flex>
    </VStack>
  );
};

export default Page;
