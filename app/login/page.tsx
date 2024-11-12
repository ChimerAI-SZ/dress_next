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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { fetchLogin } from "@lib/request/login";
import { errorCaptureRes, storage } from "@utils/index";
import Bg from "@img/login/bg.png";
import { Toaster, toaster } from "@components/Toaster";
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
  // 处理发送验证码逻辑
  const handleSendCode = async (data: FormValues) => {
    const [err, res] = await errorCaptureRes(fetchLogin, data);
    if (res.success) {
      storage.set("user_id", res.data.user_id.toString());
      storage.set("token", res.data.token);
      router.push("/");
    } else {
      toaster.create({
        title: res.message,
        type: "error",
      });
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
          Welcome
        </Text>
        <Text
          fontFamily="PingFangSC, PingFang SC"
          fontSize="2.75rem"
          fontWeight="600"
          color="#171717"
          mt={"-0.9rem"}
        >
          back!
        </Text>
        <Text
          fontFamily="PingFangSC, PingFang SC"
          fontSize="0.81rem"
          fontWeight="400"
          color="#737373"
          mt={"0.64rem"}
        >
          Please login before you like a design!
        </Text>
        <Toaster />
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack p={3} px={5} pb="1.5rem" w="100%" mt={"-1rem"}>
          <Fieldset.Root w="100%">
            <Fieldset.Content w="100%">
              {/* 邮箱输入框 */}
              <Field
                label="Email"
                fontFamily="Arial"
                fontSize="0.75rem"
                fontWeight="400"
                w="100%"
                invalid={!!errors.email}
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
                    name="email"
                    type="email"
                    flex="1"
                    placeholder="Type your email"
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
                mt={"1rem"}
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
                    placeholder="Type your password"
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
              </Field>
            </Fieldset.Content>
            <Text
              fontFamily="PingFangSC, PingFang SC"
              fontWeight="400"
              fontSize="0.88rem"
              color="#737373"
              textAlign={"right"}
              cursor={"pointer"}
              onClick={() => {
                router.push("/retrieve-password");
              }}
            >
              Forgot password？
            </Text>
          </Fieldset.Root>
        </VStack>

        <VStack pb="4rem" w="100%">
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
              Log in
            </Text>
          </Button>
        </VStack>
      </form>
      <Flex
        alignItems={"center"}
        justifyContent={"center"}
        position="fixed"
        bottom="2.25rem"
        width={"100vw"}
        left="50%"
        transform="translateX(-50%)"
      >
        <Text
          fontFamily="PingFangSC, PingFang SC"
          fontWeight="400"
          fontSize="0.88rem"
          color="#404040"
        >
          Don’t have an account?
        </Text>
        <Text
          fontFamily="PingFangSC, PingFang SC"
          fontWeight="400"
          fontSize="0.88rem"
          color="#EE3939"
          onClick={() => {
            router.push("register");
          }}
        >
          &ensp;Sign Up
        </Text>
      </Flex>
    </VStack>
  );
};

export default Page;
