"use client"
import { VStack, Text, Flex, Box } from "@chakra-ui/react"
import { useRouter } from "next/navigation"
import { Toaster } from "@components/Toaster"
import { LoginForm } from "./LoginForm"
import Bg from "@img/login/bg.png"
import Image from "next/image"

export const LoginPage = () => {
  const router = useRouter()

  return (
    <VStack align="stretch" minH="100vh">
      <Box height="16.15rem" position="relative" w="100%" p={5}>
        <Image src={Bg.src} alt="background" fill style={{ objectFit: "cover" }} priority={false} loading="lazy" />
        <Box position="relative" zIndex={1}>
          <Text fontSize="2.75rem" fontWeight="600" color="brand.primary" mt="3.25rem">
            Welcome
          </Text>
          <Text fontSize="2.75rem" fontWeight="600" color="text.primary" mt="-0.9rem">
            back!
          </Text>
          <Text fontSize="0.81rem" color="text.secondary" mt="0.64rem">
            Please login before you like a design!
          </Text>
        </Box>
      </Box>

      <Box px={5} mt="-1rem" w="100%">
        <LoginForm />
      </Box>

      <Flex align="center" justify="center" mt="auto" mb="1.5rem" w="100%">
        <Text fontSize="0.88rem" color="text.primary">
          Don't have an account?
        </Text>
        <Text fontSize="0.88rem" color="#EE3939" cursor="pointer" ml={2} onClick={() => router.push("/register")}>
          Sign Up
        </Text>
      </Flex>

      <Toaster />
    </VStack>
  )
}
