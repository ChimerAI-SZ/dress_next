"use client"
import React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import styled from "@emotion/styled"
import { useForm } from "react-hook-form"

import "react-phone-number-input/style.css"
import PhoneInputWithCountry from "react-phone-number-input/react-hook-form"

import { Container, VStack, Fieldset, Textarea, Box, Button, Input, Text } from "@chakra-ui/react"
import { InputGroup } from "@components/ui/input-group"
import { Field } from "@components/ui/field"

import Header from "../../components/Header"

interface FormValues {
  username: string
  pronouns: string
  bio: string
  email: string
  phone: string
}
interface EditAddressProps {
  params: { addressId: string }
}

const CustomInput = React.forwardRef<HTMLInputElement>((_, ref) => <Input ref={ref} />)

const EditAddress: React.FC<EditAddressProps> = ({ params }) => {
  const router = useRouter()
  const [isAddingAddress, setIsAddingAddress] = useState(params.addressId === "add")

  const [value, setValue] = useState()

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setError,
    watch
  } = useForm<FormValues>()

  // done btn clicked
  const handleSave = () => {
    router.back()
  }

  // 表单最终提交逻辑
  const onSubmit = (data: FormValues) => {
    console.log("Registration data:", data)
    // 执行最终注册逻辑
  }

  return (
    <Container className="homepage-edit-address-contaienr" p={"0"} zIndex={1}>
      <Header title={isAddingAddress ? "Add New Address" : "Edit Address"} />

      <Box p={"16pt"}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack pb="4rem" w="100%">
            <Fieldset.Root w="100%">
              <Fieldset.Content w="100%">
                {/* Username */}
                <Field label="Username" fontFamily="Arial" fontSize="0.75rem" fontWeight="400" invalid={!!errors.username}>
                  <InputGroup w="100%" bg={!!errors.username ? "#ffe0e0" : ""}>
                    <Input
                      {...register("username", {
                        required: "username is required"
                      })}
                      flex="1"
                      name="username"
                      // placeholder="Type your username"
                      _focusVisible={{
                        borderColor: "#404040",
                        boxShadow: "none",
                        outlineStyle: "none"
                      }}
                    />
                  </InputGroup>
                  {errors.username && (
                    <Text color="red.500" fontSize="0.75rem">
                      {errors.username.message}
                    </Text>
                  )}
                </Field>
                {/* Pronouns */}
                <Field label="Pronouns" fontFamily="Arial" fontSize="0.75rem" fontWeight="400" invalid={!!errors.pronouns}>
                  <InputGroup w="100%" bg={!!errors.pronouns ? "#ffe0e0" : ""}>
                    <Input
                      {...register("pronouns", {
                        required: "Pronouns is required"
                      })}
                      flex="1"
                      name="pronouns"
                      // placeholder="Type your pronouns"
                      _focusVisible={{
                        borderColor: "#404040",
                        boxShadow: "none",
                        outlineStyle: "none"
                      }}
                    />
                  </InputGroup>
                  {errors.pronouns && (
                    <Text color="red.500" fontSize="0.75rem">
                      {errors.pronouns.message}
                    </Text>
                  )}
                </Field>
                {/* bil */}
                <Field label="Bio" fontFamily="Arial" fontSize="0.75rem" fontWeight="400" invalid={!!errors.bio}>
                  <InputGroup w="100%" bg={!!errors.bio ? "#ffe0e0" : ""}>
                    <Textarea
                      {...register("bio", {
                        required: "Bio is required"
                      })}
                      flex="1"
                      name="bio"
                      // placeholder="Type your bio"
                      _focusVisible={{
                        borderColor: "#404040",
                        boxShadow: "none",
                        outlineStyle: "none"
                      }}
                    />
                  </InputGroup>
                  {errors.bio && (
                    <Text color="red.500" fontSize="0.75rem">
                      {errors.bio.message}
                    </Text>
                  )}
                </Field>

                <Field label="Email" fontFamily="Arial" fontSize="0.75rem" fontWeight="400" invalid={!!errors.email}>
                  <InputGroup w="100%" bg={!!errors.email ? "#ffe0e0" : ""}>
                    <Input
                      {...register("email", {
                        required: "Email is required"
                      })}
                      flex="1"
                      name="email"
                      // placeholder="Type your email"
                      _focusVisible={{
                        borderColor: "#404040",
                        boxShadow: "none",
                        outlineStyle: "none"
                      }}
                    />
                  </InputGroup>
                  {errors.email && (
                    <Text color="red.500" fontSize="0.75rem">
                      {errors.email.message}
                    </Text>
                  )}
                </Field>

                <PhoneInputWithCountry name="phoneInputWithCountrySelect" control={control} rules={{ required: true }} inputComponent={CustomInput} />
              </Fieldset.Content>
            </Fieldset.Root>
          </VStack>

          <VStack pb="4rem" w="100%">
            <Box p={"8pt 16pt 24pt"} position={"fixed"} bottom={0} bgColor={"#fff"} w="100vw" borderRadius={"12px 12px 0 0"} boxShadow={"0px -1px 5px 0px rgba(214, 214, 214, 0.5);"}>
              <Button borderRadius={"40px"} w={"100%"} bgColor={"#EE3939"} onClick={handleSave}>
                Save
              </Button>
            </Box>
          </VStack>
        </form>
      </Box>
    </Container>
  )
}

export default EditAddress