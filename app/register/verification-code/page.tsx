"use client"
import { Button, Input, Container, VStack, Text, Image, Flex, Box } from "@chakra-ui/react"
import { PinInput } from "@components/ui/pin-input"
import { useSearchParams, useRouter } from "next/navigation"
import Back from "@img/login/back.svg"
import { useState, useEffect, useRef } from "react"
import { fetchVerification, fetchRegister, fetchReset } from "@lib/request/login"
import { errorCaptureRes } from "@utils/index"
import { loadPublicKey, importPublicKey, encryptData, arrayBufferToBase64 } from "../utils"
import { Alert } from "@components/Alert"
import { storage } from "@utils/index"
const Page = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const storedPassword = sessionStorage.getItem("user-password")
  const params = JSON.parse(storedPassword ?? "")
  const [seconds, setSeconds] = useState(60) // 初始倒计时秒数
  const [canResend, setCanResend] = useState(false) // 控制是否可以重新发送验证码
  const [code, setCode] = useState("")
  const hasRunRef = useRef(false)

  useEffect(() => {
    if (!hasRunRef.current) {
      Alert.open({
        content: "Sent Successfully!"
      })
      hasRunRef.current = true
    }
  }, [])

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

  const getEncryption = async () => {
    try {
      const pem = `-----BEGIN PUBLIC KEY-----
      MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxnZYq2A7a+eNoK4l5djq
      vqK6dIdLcDyyK/ukIl+nVSWFLTiyEBTEzqAbyI/Q53QvDjKMakVt60yFVQ5KssG0
      fLi5vu+mt5VJ4Mb7JwhuJ/Zqi0/Jn1XHJ0xGX/OKyrM44+4tHlOPfHcG4Pz6rQRK
      u+4ysjDi3nkYdqE09Bgr7nqgQPYVYXxCx9K8xNziASKyg/3/Dh6TPzVAlS8zaez1
      aP/67O39fXlNffyzjZoQxmRPwHtBO9RD26f/H0MGMbiZiv1p/hoZnRs+4KyJaDgV
      metDJSPbpepQz+Z58DUxd5jFoWT5U4SPhoY7QWgqANghcWmXSVEGZS8u4ME/sdJv
      SQIDAQAB
      -----END PUBLIC KEY-----`
      const publicKey = await importPublicKey(pem)

      const data = {
        email: params.email,
        timestamp: Math.floor(Date.now() / 1000)
      }

      const encryptedData = await encryptData(publicKey, data)

      return arrayBufferToBase64(encryptedData)
    } catch (error) {
      console.error("Error:", error)
    }
  }
  // 处理发送验证码逻辑
  const handleSendCode = async () => {
    const encryptedBase64 = await getEncryption()
    // const emailRegistered = await checkEmailRegistered(data.email);
    const [err, res] = await errorCaptureRes(fetchVerification, {
      signature: encryptedBase64
    })

    if (err || (res && !res?.success)) {
      Alert.open({
        content: err.message ?? res.message
      })
    } else if (res.success) {
      setSeconds(60)
      setCanResend(false)
      Alert.open({
        content: "Sent Successfully!"
      })
    }
  }

  const vertify = async () => {
    if (code.length === 4 && !params.retrievePassword) {
      const [err, res] = await errorCaptureRes(fetchRegister, {
        ...params,
        verification_code: code
      })

      if (err || (res && !res?.success)) {
        Alert.open({
          content: err.message ?? res.message
        })
      } else if (res.success) {
        Alert.open({
          content: `registered successfully`
        })
        router.push(`/login`)
      }
    } else if (code.length === 4 && params.retrievePassword) {
      const [err, res] = await errorCaptureRes(fetchReset, {
        ...params,
        verification_code: code
      })

      if (err || (res && !res?.success)) {
        Alert.open({
          content: err.message ?? res.message
        })
      } else if (res.success) {
        router.push(`/retrieve-password/new-password?email=${params.email}`)
      }
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
        Verify Email
      </Text>
      <Text fontSize="0.88rem" fontWeight="400" color="#737373" mt={"0.19rem"} pl={"0.25rem"}>
        Please check your mail. We've sent a code to:
      </Text>
      <Text fontSize="0.88rem" fontWeight="700" color="#000" mt={"-0.2rem"} pl={"0.25rem"}>
        {params.email}
      </Text>
      <Text fontSize="0.81rem" fontWeight="400" color="#737373" mt={"2.1rem"} pl={"0.25rem"}>
        Please enter verification code below:
      </Text>
      <PinInput
        placeholder=""
        mt={"0.5rem"}
        onValueComplete={e => {
          setCode(e.valueAsString)
        }}
        css={{
          _focusVisible: {
            borderColor: "#ef4444",
            boxShadow: "none",
            outlineStyle: "none"
          }
        }}
      ></PinInput>
      <Text fontSize="0.81rem" fontWeight="400" color="#737373" mt={"0rem"} pl={"0.25rem"}>
        {canResend ? (
          <Text color="#EE3939" onClick={handleSendCode}>
            Resend code
          </Text>
        ) : (
          `Resend code in ${seconds}s`
        )}
      </Text>
      <VStack pb="4rem" w="100%" mt={"1.2rem"}>
        <Button width="20.44rem" height="2.75rem" background={"#EE3939"} borderRadius="1.38rem" onClick={vertify}>
          <Text fontWeight="600" fontSize="1.06rem" color="#FFFFFF">
            Verify
          </Text>
        </Button>
      </VStack>
    </VStack>
  )
}

export default Page
