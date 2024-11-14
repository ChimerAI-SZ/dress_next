"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import styled from "@emotion/styled"
import { useForm } from "react-hook-form"
import { Provider, useSelector } from "react-redux"

import { Container, VStack, Fieldset, Textarea, Box, Button, Input, Text } from "@chakra-ui/react"
import { InputGroup } from "@components/ui/input-group"
import { Field } from "@components/ui/field"

import { store } from "../store"
import { storage } from "@utils/index"

import { editProdile } from "@lib/request/profile"

import Header from "../components/Header"

interface FormValues {
  first_name: string
  last_name: string
  pronouns: string
  bio: string
  email: string
  phone: string
}

const EditProfile: React.FC = () => {
  const router = useRouter()
  const profileData = useSelector((state: any) => state.profileData.value)
  console.log(profileData)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch
  } = useForm<FormValues>({
    defaultValues: profileData
  })

  // 表单最终提交逻辑
  const onSubmit = async (formData: FormValues) => {
    const user_id = storage.get("user_id")

    if (user_id) {
      const { success, data, message } = await editProdile({ ...formData, user_id: +user_id as number })

      if (success) {
        router.back()
      }
    }
  }

  return (
    <Container className="homepage-edit-profile-contaienr" p={"0"} zIndex={1}>
      <Header title="Edit Profile" />

      <Box p={"16pt"}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack pb="4rem" w="100%">
            <Fieldset.Root w="100%">
              <Fieldset.Content w="100%">
                <SubTitle>Display Information</SubTitle>
                {/* first name */}
                <Field label="First Name" fontFamily="Arial" fontSize="0.75rem" fontWeight="400" invalid={!!errors.first_name}>
                  <InputGroup w="100%" bg={!!errors.first_name ? "#ffe0e0" : ""}>
                    <Input
                      {...register("first_name", {
                        required: "first name is required"
                      })}
                      flex="1"
                      name="first_name"
                      _focusVisible={{
                        borderColor: "#404040",
                        boxShadow: "none",
                        outlineStyle: "none"
                      }}
                    />
                  </InputGroup>
                  {errors.first_name && (
                    <Text color="red.500" fontSize="0.75rem">
                      {errors.first_name.message}
                    </Text>
                  )}
                </Field>
                {/* last name */}
                <Field label="Last Name" fontFamily="Arial" fontSize="0.75rem" fontWeight="400" invalid={!!errors.last_name}>
                  <InputGroup w="100%" bg={!!errors.last_name ? "#ffe0e0" : ""}>
                    <Input
                      {...register("last_name", {
                        required: "last name is required"
                      })}
                      flex="1"
                      name="last_name"
                      _focusVisible={{
                        borderColor: "#404040",
                        boxShadow: "none",
                        outlineStyle: "none"
                      }}
                    />
                  </InputGroup>
                  {errors.first_name && (
                    <Text color="red.500" fontSize="0.75rem">
                      {errors.first_name.message}
                    </Text>
                  )}
                </Field>
                {/* Pronouns */}
                <Field label="Pronouns" fontFamily="Arial" fontSize="0.75rem" fontWeight="400" invalid={!!errors.pronouns}>
                  <InputGroup w="100%" bg={!!errors.pronouns ? "#ffe0e0" : ""}>
                    <Input
                      {...register("pronouns", {})}
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
                      {...register("bio", {})}
                      flex="1"
                      name="bio"
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

                <SubTitle style={{ marginTop: "1rem" }}>Personal Information</SubTitle>

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
                <Field label="Phone Number" fontFamily="Arial" fontSize="0.75rem" fontWeight="400" invalid={!!errors.phone}>
                  <InputGroup w="100%" bg={!!errors.phone ? "#ffe0e0" : ""}>
                    <Input
                      {...register("phone", {})}
                      flex="1"
                      name="phone"
                      _focusVisible={{
                        borderColor: "#404040",
                        boxShadow: "none",
                        outlineStyle: "none"
                      }}
                    />
                  </InputGroup>
                  {errors.phone && (
                    <Text color="red.500" fontSize="0.75rem">
                      {errors.phone.message}
                    </Text>
                  )}
                </Field>
              </Fieldset.Content>
            </Fieldset.Root>
          </VStack>

          <VStack pb="4rem" w="100%">
            <Box p={"8pt 16pt 24pt"} position={"fixed"} bottom={0} bgColor={"#fff"} w="100vw" borderRadius={"12px 12px 0 0"} boxShadow={"0px -1px 5px 0px rgba(214, 214, 214, 0.5);"}>
              <Button borderRadius={"40px"} w={"100%"} bgColor={"#EE3939"} type="submit">
                Save
              </Button>
            </Box>
          </VStack>
        </form>
      </Box>
    </Container>
  )
}

const SubTitle = styled.div`
  font-weight: 400;
  font-size: 15px;
  color: #737373;
  line-height: 22px;
  text-align: left;
`

export default () => {
  return (
    <Provider store={store}>
      <EditProfile />
    </Provider>
  )
}
