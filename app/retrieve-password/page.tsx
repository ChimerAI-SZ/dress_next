"use client"
import { Button, Input, Container, VStack, Text, Image, Flex, Fieldset } from "@chakra-ui/react"
import { Field } from "@components/ui/field"
import { useSearchParams, useRouter } from "next/navigation"
import Back from "@img/login/back.svg"
import { useState, useEffect } from "react"
import { fetchResetPassword } from "@lib/request/login"
import { errorCaptureRes } from "@utils/index"
import { useForm } from "react-hook-form"
import { InputGroup } from "@components/ui/input-group"
import { Alert } from "@components/Alert"
interface FormValues {
  email: string
  first: string
  last: string
  code: string
  password: string
}
const Page = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = Object.fromEntries(searchParams.entries())
  const [seconds, setSeconds] = useState(60) // 初始倒计时秒数
  const [canResend, setCanResend] = useState(false) // 控制是否可以重新发送验证码
  const [code, setCode] = useState("")
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch
  } = useForm<FormValues>()
  useEffect(() => {
    if (seconds === 0) {
      setCanResend(true) // 倒计时结束后，允许重新发送验证码
      return
    }

    const timer = setInterval(() => {
      setSeconds(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [seconds])

  // 处理发送验证码逻辑
  const handleSendCode = async (data: FormValues) => {
    const [err, res] = await errorCaptureRes(fetchResetPassword, data)
    if (res.success) {
      router.push(`/retrieve-password/verification-code?email=${data.email}`)
    } else {
      Alert.open({
        content: `${res.message}`
      })
    }
  }

  return (
    <VStack align="stretch" minH="100vh" p={3} px={5}>
      <Flex h={"2.75rem"} w={"full"} alignItems={"center"}>
        <Image
          src={Back.src}
          w={"1.38rem"}
          h={"1.38rem"}
          onClick={() => {
            router.back()
          }}
        ></Image>
      </Flex>
      <Text fontSize="1.38rem" fontWeight="600" color="#171717" mt={"0.1rem"} pl={"0.25rem"}>
        Forgot your password？
      </Text>
      <Text fontSize="0.88rem" fontWeight="400" color="#737373" mt={"0.19rem"} pl={"0.25rem"}>
        Don't worry. Please enter the email address you used to sign up. We'll send a code to reset your password.
      </Text>

      <form>
        <VStack pb="4rem" w="100%" mt={"2.2rem"} pl={"0.25rem"}>
          <Fieldset.Root w="100%">
            <Fieldset.Content w="100%">
              {/* 邮箱输入框 */}
              <Field label="Email" fontSize="0.75rem" fontWeight="400" w="100%" invalid={!!errors.email}>
                <InputGroup w="100%" bg={!!errors.email ? "#ffe0e0" : ""}>
                  <Input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                        message: "Invalid email format"
                      }
                    })}
                    maxW="md"
                    name="email"
                    type="email"
                    placeholder="Type your email"
                    _focusVisible={{
                      borderColor: "#404040",
                      boxShadow: "none",
                      outlineStyle: "none"
                    }}
                    caretColor="black"
                  />
                </InputGroup>
                {errors.email && (
                  <Text color="red.500" fontSize="0.75rem">
                    {errors.email.message}
                  </Text>
                )}
              </Field>
              <VStack pb="4rem" w="100%" mt={"0.8rem"}>
                <Button
                  width="20.44rem"
                  height="2.75rem"
                  background={"#EE3939"}
                  borderRadius="1.38rem"
                  onClick={handleSubmit(handleSendCode)}
                >
                  <Text fontWeight="600" fontSize="1.06rem" color="#FFFFFF">
                    Send Code
                  </Text>
                </Button>
              </VStack>
            </Fieldset.Content>
          </Fieldset.Root>
        </VStack>
      </form>
    </VStack>
  )
}

export default Page
