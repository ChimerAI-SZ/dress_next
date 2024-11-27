"use client"
import dynamic from "next/dynamic"
import { Alert } from "@components/Alert"

// 动态导入非关键组件
const Toaster = dynamic(() => import("@components/Toaster").then(mod => mod.Toaster), { ssr: false })

import { Button, Input, VStack, Text, Flex, Box, ButtonProps, StackProps } from "@chakra-ui/react"
import { useState } from "react"
import { Field } from "@components/ui/field"
import { InputGroup } from "@components/ui/input-group"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { fetchLogin } from "@lib/request/login"
import { errorCaptureRes, storage } from "@utils/index"
import { PasswordInput } from "@components/ui/password-input"

interface FormValues {
  email: string
  password: string
}

export const LoginForm = () => {
  const router = useRouter()
  const [emailError, setEmailError] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<FormValues>()

  const email = watch("email")
  const password = watch("password")

  const validateEmail = (value: string) => {
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
    const invalidSymbolsRegex = /[^\x00-\x7F]/
    if (invalidSymbolsRegex.test(value)) {
      return "Invalid email format"
    }
    if (!emailRegex.test(value)) {
      return "Invalid email format"
    }
    return true
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
    setEmailError(!emailRegex.test(value) ? "Invalid email format" : "")
  }

  const handleLogin = async (data: FormValues) => {
    if (loading) return

    setLoading(true)
    try {
      const [err, res] = await errorCaptureRes(fetchLogin, data)

      if (err || !res?.success) {
        Alert.open({ content: err?.message ?? res?.message ?? "Login failed" })
        return
      }

      storage.set("user_id", res.data.user_id.toString())
      storage.set("token", `Bearer ${res.data.token}`)
      storage.set("need_guide", res.data?.need_guide ?? "false")
      router.push("/")
    } catch (error) {
      Alert.open({ content: "An error occurred during login" })
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = () => email && password?.length >= 6 && !emailError

  return (
    <form onSubmit={handleSubmit(handleLogin)}>
      <VStack gap={4} w="100%">
        <Field label="Email" fontSize="0.75rem" fontWeight="400" invalid={!!errors.email} w="100%">
          <InputGroup w="100%">
            <Input
              {...register("email", {
                required: "Email is required",
                validate: validateEmail,
                onChange: handleEmailChange
              })}
              name="email"
              type="email"
              placeholder="Type your email"
              autoComplete="email"
              w="100%"
            />
          </InputGroup>
          {emailError && (
            <Text color="red.500" fontSize="0.75rem">
              {emailError}
            </Text>
          )}
        </Field>

        <Field label="Password" fontSize="0.75rem" fontWeight="400" invalid={!!errors.password} w="100%">
          <InputGroup w="100%">
            <PasswordInput
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                }
              })}
              name="password"
              placeholder="Type your password"
              autoComplete="current-password"
              w="100%"
            />
          </InputGroup>
          {errors.password && (
            <Text color="red.500" fontSize="0.75rem">
              {errors.password.message}
            </Text>
          )}
        </Field>

        <Flex w="100%" justify="flex-end">
          <Text fontSize="0.88rem" color="gray.500" cursor="pointer" onClick={() => router.push("/retrieve-password")}>
            Forgot password?
          </Text>
        </Flex>

        <Button
          type="submit"
          w="20.44rem"
          h="2.75rem"
          bg="#EE3939"
          color="white"
          borderRadius="1.38rem"
          fontWeight="600"
          disabled={!isFormValid()}
          _hover={{ bg: "#FF2E2E" }}
          _active={{ bg: "#CC0000" }}
          _disabled={{ bg: "#EE3939", opacity: 0.6 }}
        >
          <Text fontSize="1.06rem">{loading ? "Logging in..." : "Log in"}</Text>
        </Button>
      </VStack>
    </form>
  )
}
