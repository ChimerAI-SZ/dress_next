"use client";
import {
  Button,
  Input,
  Box,
  VStack,
  Text,
  Image,
  Flex,
  Fieldset,
} from "@chakra-ui/react";
import { Field } from "@components/ui/field";
import { useSearchParams, useRouter } from "next/navigation";
import Back from "@img/login/back.svg";
import { useState, useEffect } from "react";
import { fetchResetPassword } from "@lib/request/login";
import { errorCaptureRes } from "@utils/index";
import { useForm } from "react-hook-form";
import Right from "@img/login/right.svg";
import { InputGroup } from "@components/ui/input-group";
interface FormValues {
  email: string;
  first: string;
  last: string;
  code: string;
  password: string;
}
const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  const [seconds, setSeconds] = useState(60); // 初始倒计时秒数
  const [canResend, setCanResend] = useState(false); // 控制是否可以重新发送验证码
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
  const password = watch("password");
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
  const handleSendCode = async (data: FormValues) => {
    const [err, res] = await errorCaptureRes(fetchResetPassword, data);
    if (res.success) {
      router.push(
        `/register/verification-code?email=${data.email}&retrieve-password=true`
      );
    }
  };
  useEffect(() => {
    setIsLengthValid(password?.length >= 8); // 检查密码长度
    setIsUppercaseValid(/[A-Z]/.test(password) && /[a-z]/.test(password)); // 检查大小写字母
    setIsNumberValid(/\d/.test(password)); // 检查是否包含数字
  }, [password]);
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
          Reset Password
        </Text>

        <form>
          <VStack pb="4rem" w="100%" mt={"2.25rem"}>
            <Fieldset.Root w="100%">
              <Fieldset.Content w="100%">
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
                <VStack pb="4rem" w="100%">
                  <Button
                    width="20.44rem"
                    height="2.75rem"
                    background={"#EE3939"}
                    borderRadius="1.38rem"
                    onClick={handleSubmit(handleSendCode)}
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
                      Reset
                    </Text>
                  </Button>
                </VStack>
              </Fieldset.Content>
            </Fieldset.Root>
          </VStack>
        </form>
      </VStack>
    </Flex>
  );
};

export default Page;
