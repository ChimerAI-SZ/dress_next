"use client";
import {
  Button,
  Input,
  Container,
  VStack,
  Text,
  Image,
  Fieldset,
} from "@chakra-ui/react";
import { Field } from "@components/ui/field";
import { InputGroup } from "@components/ui/input-group";
import { useForm } from "react-hook-form";
import Book from "@img/login/book.svg";
import Lock from "@img/login/lock.svg";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CountdownTimer from "./components/CountdownTimer";

interface FormValues {
  email: string;
  userName: string;
  code: string;
  password: string;
}

// 模拟检查邮箱是否已注册的函数
const checkEmailRegistered = async (email: string) => {
  const registeredEmails = ["test@example.com", "user@domain.com"];
  return registeredEmails.includes(email);
};

// 定义页面状态
enum PageState {
  INITIAL, // 初始状态，未发送验证码
  CODE_SENT, // 已发送验证码状态
  VERIFIED, // 验证通过状态
}

const Page = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormValues>();

  const [pageState, setPageState] = useState<PageState>(PageState.INITIAL);

  // 处理发送验证码逻辑
  const handleSendCode = async (data: FormValues) => {
    const emailRegistered = await checkEmailRegistered(data.email);
    if (emailRegistered) {
      setError("email", {
        type: "manual",
        message: "This email is already registered",
      });
    } else {
      setPageState(PageState.CODE_SENT);
    }
  };

  // 处理验证码验证逻辑
  const handleVerifyCode = (data: FormValues) => {
    if (data.code === "1234") {
      // 假设 "1234" 是验证码
      setPageState(PageState.VERIFIED);
    } else {
      setError("code", {
        type: "manual",
        message: "Invalid verification code",
      });
    }
  };

  // 表单最终提交逻辑
  const onSubmit = (data: FormValues) => {
    console.log("Registration data:", data);
    // 执行最终注册逻辑
  };

  return (
    <Container maxW="md" px="1.8rem">
      <VStack align="stretch" minH="100vh">
        <Text
          fontFamily="Arial"
          fontSize="1.5rem"
          fontWeight="400"
          pt="10rem"
          textAlign="center"
        >
          Sign Up
        </Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack pt="2rem" pb="4rem" w="100%">
            <Fieldset.Root w="100%">
              <Fieldset.Content w="100%">
                {/* 用户名输入框 */}
                <Field
                  label="UserName"
                  fontFamily="Arial"
                  fontSize="0.75rem"
                  fontWeight="400"
                  invalid={!!errors.userName}
                >
                  <InputGroup
                    w="100%"
                    startElement={
                      <Image src={Lock.src} alt="Lock" boxSize="0.75rem" />
                    }
                    bg={!!errors.userName ? "#ffe0e0" : ""}
                  >
                    <Input
                      {...register("userName", {
                        required: "userName is required",
                      })}
                      flex="1"
                      name="userName"
                      variant="flushed"
                      placeholder="Type your username"
                      borderBlockEnd="1px solid #A2A2A2"
                      _focusVisible={{
                        borderColor: "#A2A2A2",
                        boxShadow: "none",
                      }}
                    />
                  </InputGroup>
                  {errors.userName && (
                    <Text color="red.500" fontSize="0.75rem">
                      {errors.userName.message}
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
                >
                  <InputGroup
                    w="100%"
                    startElement={
                      <Image src={Book.src} alt="Book" boxSize="0.75rem" />
                    }
                    bg={!!errors.email ? "#ffe0e0" : ""}
                  >
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
                      variant="flushed"
                      placeholder="Type your email"
                      borderBlockEnd="1px solid #A2A2A2"
                      _focusVisible={{
                        borderColor: "#A2A2A2",
                        boxShadow: "none",
                      }}
                    />
                  </InputGroup>
                  {errors.email && (
                    <Text color="red.500" fontSize="0.75rem">
                      {errors.email.message}
                    </Text>
                  )}
                </Field>

                {/* 验证码输入框 */}
                {pageState === PageState.CODE_SENT && (
                  <Field
                    label="Verification code"
                    fontFamily="Arial"
                    fontSize="0.75rem"
                    fontWeight="400"
                    w="100%"
                    invalid={!!errors.code}
                  >
                    <InputGroup
                      w="100%"
                      startElement={
                        <Image src={Book.src} alt="Book" boxSize="0.75rem" />
                      }
                      endElement={
                        <CountdownTimer
                          initialCountdown={40}
                          onResend={handleSendCode}
                          isActive={pageState === PageState.CODE_SENT}
                        />
                      }
                      bg={!!errors.code ? "#ffe0e0" : ""}
                    >
                      <Input
                        {...register("code", {
                          required: "Code is required",
                        })}
                        maxW="md"
                        name="code"
                        variant="flushed"
                        placeholder="Type your code"
                        borderBlockEnd="1px solid #A2A2A2"
                        _focusVisible={{
                          borderColor: "#A2A2A2",
                          boxShadow: "none",
                        }}
                      />
                    </InputGroup>
                    {errors.code && (
                      <Text color="red.500" fontSize="0.75rem">
                        {errors.code.message}
                      </Text>
                    )}
                  </Field>
                )}

                {/* 密码输入框 */}
                {pageState === PageState.VERIFIED && (
                  <Field
                    label="Password"
                    fontFamily="Arial"
                    fontSize="0.75rem"
                    fontWeight="400"
                    invalid={!!errors.password}
                  >
                    <InputGroup
                      w="100%"
                      startElement={
                        <Image src={Lock.src} alt="Lock" boxSize="0.75rem" />
                      }
                      bg={!!errors.password ? "#ffe0e0" : ""}
                    >
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
                        variant="flushed"
                        placeholder="Type your password"
                        borderBlockEnd="1px solid #A2A2A2"
                        _focusVisible={{
                          borderColor: "#A2A2A2",
                          boxShadow: "none",
                        }}
                      />
                    </InputGroup>
                    {errors.password && (
                      <Text color="red.500" fontSize="0.75rem">
                        {errors.password.message}
                      </Text>
                    )}
                  </Field>
                )}
              </Fieldset.Content>
            </Fieldset.Root>
          </VStack>

          {/* 按钮显示不同状态 */}
          <VStack pb="4rem" w="100%">
            {pageState === PageState.INITIAL && (
              <Button
                w="100%"
                onClick={handleSubmit(handleSendCode)}
                py="1.75rem"
              >
                SEND CODE
              </Button>
            )}
            {pageState === PageState.CODE_SENT && (
              <Button
                w="100%"
                onClick={handleSubmit(handleVerifyCode)}
                py="1.75rem"
              >
                VERIFY EMAIL
              </Button>
            )}
            {pageState === PageState.VERIFIED && (
              <Button w="100%" type="submit" py="1.75rem">
                SUBMIT
              </Button>
            )}
          </VStack>
        </form>
      </VStack>
    </Container>
  );
};

export default Page;
