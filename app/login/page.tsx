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
import { fetchLogin } from "@lib/request/login";
import { errorCaptureRes } from "@utils/index";

interface FormValues {
  email: string;
  first: string;
  last: string;
  code: string;
  password: string;
}

// 模拟检查邮箱是否已注册的函数
const checkEmailRegistered = async (email: string) => {
  const registeredEmails = ["test@example.com", "user@domain.com"];
  return registeredEmails.includes(email);
};

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
      router.push("/");
    }
  };

  // 表单最终提交逻辑
  const onSubmit = (data: FormValues) => {
    console.log("Registration data:", data);
    // 执行最终注册逻辑
  };

  return (
    <VStack align="stretch" minH="100vh" px={"1.5rem"} position={"relative"}>
      <Box height="16.15rem">
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
        >
          back!
        </Text>
        <Text
          fontFamily="PingFangSC, PingFang SC"
          fontSize="0.81rem"
          fontWeight="400"
          color="#737373"
          mt={"0.63rem"}
        >
          Please login before you like a design!
        </Text>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack pb="4rem" w="100%">
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
                    maxW="md"
                    name="email"
                    type="email"
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
        bottom="1.25rem"
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
          Sign Up
        </Text>
      </Flex>
    </VStack>
  );
};

export default Page;
