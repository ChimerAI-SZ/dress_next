"use client"
import { Button, Input, VStack, Text, Flex, Fieldset, Box } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { Field } from "@components/ui/field"
import { InputGroup } from "@components/ui/input-group"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { fetchLogin } from "@lib/request/login"
import { errorCaptureRes, storage } from "@utils/index"
import Bg from "@img/login/bg.png"
import { Toaster, toaster } from "@components/Toaster"
import { Alert } from "@components/Alert"
import { PasswordInput } from "@components/ui/password-input"
interface FormValues {
  email: string
  first: string
  last: string
  code: string
  password: string
}

const Page = () => {
  const router = useRouter()
  const [isLengthValid, setIsLengthValid] = useState(false)
  const [isUppercaseValid, setIsUppercaseValid] = useState(false)
  const [isNumberValid, setIsNumberValid] = useState(false)
  const [emailError, setEmailError] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch
  } = useForm<FormValues>()
  const email = watch("email")
  const password = watch("password")

  useEffect(() => {
    setIsLengthValid(password?.length >= 8)
    setIsUppercaseValid(/[A-Z]/.test(password) && /[a-z]/.test(password))
    setIsNumberValid(/\d/.test(password))
  }, [password])

  // 邮箱格式验证
  const validateEmail = (value: string) => {
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
    // 匹配不合法字符，包括中文字符和其他符号
    const invalidSymbolsRegex = /[^\x00-\x7F]/ // 这个正则会匹配非ASCII字符，也可以匹配中文字符
    if (invalidSymbolsRegex.test(value)) {
      return "Invalid email format"
    }
    if (!emailRegex.test(value)) {
      return "Invalid email format"
    }
    return true
  }

  // 处理输入过程中校验
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // 正则检测非法字符（包含中文符号、标点符号）
    const invalidSymbolsRegex = /[^\x00-\x7F]/ // 匹配非ASCII字符（例如中文）
    if (invalidSymbolsRegex.test(value)) {
      setEmailError("Invalid email format") // 如果包含非法字符，给出提示
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
      setEmailError("Invalid email format") // 邮箱格式不对时提示
    } else {
      setEmailError("") // 如果没有错误，清除错误提示
    }
  }

  const handleSendCode = async (data: FormValues) => {
    if (loading) {
      return
    }
    setLoading(true)
    const [err, res] = await errorCaptureRes(fetchLogin, data)

    if (err || !res.success) {
      Alert.open({
        content: err.message ?? res.message
      })
    } else if (res.success) {
      storage.set("user_id", res.data.user_id.toString())
      storage.set("token", `Bearer ${res.data.token}`)
      router.push("/")
    }

    setLoading(false)
  }

  const onSubmit = (data: FormValues) => {
    console.log("Registration data:", data)
    // 执行最终注册逻辑
  }

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
        <Text fontSize="2.75rem" fontWeight="600" color="#EE3939" mt={"3.25rem"}>
          Welcome
        </Text>
        <Text fontSize="2.75rem" fontWeight="600" color="#171717" mt={"-0.9rem"}>
          back!
        </Text>
        <Text fontSize="0.81rem" fontWeight="400" color="#737373" mt={"0.64rem"}>
          Please login before you like a design!
        </Text>
        <Toaster />
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack p={3} px={5} pb="1.5rem" w="100%" mt={"-1rem"}>
          <Fieldset.Root w="100%">
            <Fieldset.Content w="100%">
              {/* 邮箱输入框 */}
              <Field label="Email" fontSize="0.75rem" fontWeight="400" w="100%" invalid={!!errors.email}>
                <InputGroup w="100%" bg={!!errors.email ? "#ffe0e0" : ""}>
                  <Input
                    {...register("email", {
                      required: "Email is required",
                      validate: validateEmail
                    })}
                    name="email"
                    type="email"
                    flex="1"
                    placeholder="Type your email"
                    _focusVisible={{
                      borderColor: "#404040",
                      boxShadow: "none",
                      outlineStyle: "none"
                    }}
                    onChange={handleEmailChange}
                    caretColor="black"
                  />
                </InputGroup>
                {emailError && (
                  <Text color="red.500" fontSize="0.75rem">
                    {emailError} {/* 显示动态错误提示 */}
                  </Text>
                )}
              </Field>
              {/* 密码输入框 */}
              <Field label="Password" fontSize="0.75rem" fontWeight="400" invalid={!!errors.password} mt={"1rem"}>
                <InputGroup w="100%" bg={!!errors.password ? "#ffe0e0" : ""}>
                  <PasswordInput
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters"
                      }
                    })}
                    flex="1"
                    name="password"
                    type="password"
                    placeholder="Type your password"
                    _focusVisible={{
                      borderColor: "#404040",
                      boxShadow: "none",
                      outlineStyle: "none"
                    }}
                    caretColor="black"
                  />
                </InputGroup>
                {errors.password && (
                  <Text color="red.500" fontSize="0.75rem">
                    {errors.password.message}
                  </Text>
                )}
              </Field>
            </Fieldset.Content>
            <Flex justifyContent={"flex-end"}>
              <Text
                fontFamily="PingFangSC, PingFang SC"
                fontWeight="400"
                fontSize="0.88rem"
                color="#737373"
                textAlign={"right"}
                cursor={"pointer"}
                onClick={() => {
                  router.push("/retrieve-password")
                }}
              >
                Forgot password？
              </Text>
            </Flex>
          </Fieldset.Root>
        </VStack>

        <VStack pb="4rem" w="100%">
          <Button
            onClick={handleSubmit(handleSendCode)}
            width="20.44rem"
            height="2.75rem"
            background={"#EE3939"}
            borderRadius="1.38rem"
            disabled={!(isLengthValid && isUppercaseValid && isNumberValid && Object.keys(errors).length === 0)}
          >
            <Text fontWeight="600" fontSize="1.06rem" color="#FFFFFF">
              Log in
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
        <Text fontWeight="400" fontSize="0.88rem" color="#404040">
          Don’t have an account?
        </Text>
        <Text
          fontWeight="400"
          fontSize="0.88rem"
          color="#EE3939"
          onClick={() => {
            router.push("register")
          }}
        >
          &ensp;Sign Up
        </Text>
      </Flex>
    </VStack>
  )
}

export default Page
