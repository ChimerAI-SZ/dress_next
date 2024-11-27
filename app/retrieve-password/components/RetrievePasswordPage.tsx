"use client"
import { Button, Input, Text, Image, VStack, Flex, Fieldset } from "@chakra-ui/react"
import { Field } from "@components/ui/field"
import { useRouter } from "next/navigation"
import Back from "@img/login/back.svg"
import { useState } from "react"
import { fetchResetPassword } from "@lib/request/login"
import { errorCaptureRes } from "@utils/index"
import { useForm } from "react-hook-form"
import { InputGroup } from "@components/ui/input-group"
import { Alert } from "@components/Alert"
import { Loading } from "@components/Loading"

interface FormValues {
  email: string
}

export const RetrievePasswordPage = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<FormValues>()

  const email = watch("email")

  const handleSendCode = async (data: FormValues) => {
    try {
      setLoading(true)
      const [err, res] = await errorCaptureRes(fetchResetPassword, data)

      if (err || !res?.success) {
        Alert.open({
          content: err?.message ?? res?.message ?? "Failed to send code"
        })
        return
      }

      router.push(`/retrieve-password/verification-code?email=${data.email}`)
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = () => {
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
    return email && emailRegex.test(email)
  }

  return (
    <VStack align="stretch" minH="100vh" p={3} px={5}>
      {loading && <Loading />}
      <Flex h="2.75rem" w="full" alignItems="center">
        <Image src={Back.src} w="1.38rem" h="1.38rem" cursor="pointer" onClick={() => router.back()} />
      </Flex>

      <Text fontSize="1.38rem" fontWeight="600" color="#171717" mt="0.1rem" pl="0.25rem">
        Forgot your password?
      </Text>
      <Text fontSize="0.88rem" fontWeight="400" color="#737373" mt="0.19rem" pl="0.25rem">
        Don't worry. Please enter the email address you used to sign up. We'll send a code to reset your password.
      </Text>

      <form onSubmit={handleSubmit(handleSendCode)}>
        <VStack pb="4rem" w="100%" mt="2.2rem" pl="0.25rem">
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
                  boxShadow: "none"
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

          <Button
            width="20.44rem"
            height="2.75rem"
            bg="#EE3939"
            color="white"
            borderRadius="1.38rem"
            type="submit"
            disabled={!isFormValid()}
            _hover={{ opacity: 0.9 }}
            _active={{ bg: "#CC0000" }}
            _disabled={{ bg: "#EE3939", opacity: 0.6 }}
            mt="0.8rem"
          >
            <Text fontWeight="600" fontSize="1.06rem">
              {loading ? "Sending..." : "Send Code"}
            </Text>
          </Button>
        </VStack>
      </form>
    </VStack>
  )
}
