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
import { fetchReset } from "@lib/request/login";
import { errorCaptureRes } from "@utils/index";
import { set, useForm } from "react-hook-form";
import Right from "@img/login/right.svg";
import { InputGroup } from "@components/ui/input-group";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
interface FormValues {
  email: string;
  first: string;
  last: string;
  code: string;
  password: string;
  newPassword: string;
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
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<FormValues>();

  const password = watch("password");
  const newPassword = watch("newPassword"); // 监控新的密码输入框

  // 检查密码一致性
  const passwordsMatch = password === newPassword;

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
    const [err, res] = await errorCaptureRes(fetchReset, {
      email: params.email,
      new_password: password,
      verification_code: params.code,
    });
    if (res.success) {
      setOpen(true);
    }
  };

  useEffect(() => {
    setIsLengthValid(password?.length >= 8); // 检查密码长度
    setIsUppercaseValid(/[A-Z]/.test(password) && /[a-z]/.test(password)); // 检查大小写字母
    setIsNumberValid(/\d/.test(password)); // 检查是否包含数字
  }, [password]);

  return (
    <VStack align="stretch" minH="100vh" p={3} px={5}>
      <DialogRoot
        open={open}
        placement={"center"}
        motionPreset="slide-in-bottom"
      >
        <DialogContent
          width="18.44rem"
          height="10.69rem"
          background="#FFFFFF"
          borderRadius="0.75rem"
        >
          <Flex
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Text
              fontFamily="PingFangSC, PingFang SC"
              fontWeight="500"
              fontSize="1.06rem"
              color="#171717"
              textAlign={"center"}
              mt={"1.44rem"}
            >
              Congratulations
            </Text>
            <Text
              fontFamily="PingFangSC, PingFang SC"
              fontWeight="400"
              fontSize="0.88rem"
              color="#171717"
              textAlign={"center"}
              mt={"0.38rem"}
              px={"1.5rem"}
            >
              Your password has been reset successfully.
            </Text>
            <Button
              width="14.09rem"
              height="2.44rem"
              background="#EE3939"
              borderRadius="1.25rem"
              mt={"1rem"}
              onClick={() => {
                router.push(`/`);
              }}
            >
              OK
            </Button>
          </Flex>
        </DialogContent>
      </DialogRoot>
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
        Reset Password
      </Text>

      <form>
        <VStack pb="4rem" w="100%" mt={"2.1rem"} pl={"0.25rem"}>
          <Fieldset.Root w="100%">
            <Fieldset.Content w="100%">
              {/* 密码输入框 */}
              <Field
                label="New Password"
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
                <Flex alignItems={"center"} gap={"0.56rem"} mt={"0.7rem"}>
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
                    color={isLengthValid ? "#299E46" : "#737373"}
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
                    color={isUppercaseValid ? "#299E46" : "#737373"}
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
                    color={isNumberValid ? "#299E46" : "#737373"}
                  >
                    At least 1 number
                  </Text>
                </Flex>
              </Field>
              {/* 确认密码输入 */}
              <Field
                label="Retype new password"
                fontFamily="Arial"
                fontSize="0.75rem"
                fontWeight="400"
                invalid={!!errors.newPassword}
                mt={"0.3rem"}
              >
                <InputGroup w="100%" bg={!!errors.newPassword ? "#ffe0e0" : ""}>
                  <Input
                    {...register("newPassword", {
                      required: "Please retype your new password",
                      validate: (value) =>
                        value === password || "Passwords must match", // 验证密码是否一致
                    })}
                    flex="1"
                    name="newPassword"
                    type="password"
                    _focusVisible={{
                      borderColor: "#404040",
                      boxShadow: "none",
                      outlineStyle: "none",
                    }}
                  />
                </InputGroup>
                {errors.newPassword && (
                  <Text color="red.500" fontSize="0.75rem">
                    {errors.newPassword.message}
                  </Text>
                )}
              </Field>
              <VStack pb="4rem" w="100%">
                <Button
                  width="20.44rem"
                  height="2.75rem"
                  background={"#EE3939"}
                  borderRadius="1.38rem"
                  onClick={handleSubmit(handleSendCode)}
                  mt={"0.5rem"}
                  disabled={
                    !(
                      isLengthValid &&
                      isUppercaseValid &&
                      isNumberValid &&
                      passwordsMatch && // 添加一致性检查
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
  );
};

export default Page;
