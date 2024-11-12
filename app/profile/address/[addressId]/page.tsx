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
  fullName: string
  country: string
  street_address_1: string
  city: string
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
                {/* full name */}
                <Field label="Full Name" fontFamily="Arial" fontSize="0.75rem" fontWeight="400" invalid={!!errors.fullName}>
                  <InputGroup w="100%" bg={!!errors.fullName ? "#ffe0e0" : ""}>
                    <Input
                      {...register("fullName", {
                        required: "Full Name is required"
                      })}
                      flex="1"
                      name="fullName"
                      _focusVisible={{
                        borderColor: "#404040",
                        boxShadow: "none",
                        outlineStyle: "none"
                      }}
                    />
                  </InputGroup>
                  {errors.fullName && (
                    <Text color="red.500" fontSize="0.75rem">
                      {errors.fullName.message}
                    </Text>
                  )}
                </Field>
                {/* country */}
                <Field label="Pronouns" fontFamily="Arial" fontSize="0.75rem" fontWeight="400" invalid={!!errors.country}>
                  <InputGroup w="100%" bg={!!errors.country ? "#ffe0e0" : ""}>
                    <Input
                      {...register("country", {
                        required: "Country is required"
                      })}
                      flex="1"
                      name="country"
                      _focusVisible={{
                        borderColor: "#404040",
                        boxShadow: "none",
                        outlineStyle: "none"
                      }}
                    />
                  </InputGroup>
                  {errors.country && (
                    <Text color="red.500" fontSize="0.75rem">
                      {errors.country.message}
                    </Text>
                  )}
                </Field>
                {/* address */}
                <Field label="Address" fontFamily="Arial" fontSize="0.75rem" fontWeight="400" invalid={!!errors.street_address_1}>
                  <InputGroup w="100%" bg={!!errors.street_address_1 ? "#ffe0e0" : ""}>
                    <Input
                      {...register("street_address_1", {
                        required: "Address is required"
                      })}
                      flex="1"
                      name="street_address_1"
                      _focusVisible={{
                        borderColor: "#404040",
                        boxShadow: "none",
                        outlineStyle: "none"
                      }}
                    />
                  </InputGroup>
                  {errors.street_address_1 && (
                    <Text color="red.500" fontSize="0.75rem">
                      {errors.street_address_1.message}
                    </Text>
                  )}
                </Field>
                {/* city */}
                <Field label="City" fontFamily="Arial" fontSize="0.75rem" fontWeight="400" invalid={!!errors.city}>
                  <InputGroup w="100%" bg={!!errors.city ? "#ffe0e0" : ""}>
                    <Input
                      {...register("city", {
                        required: "City is required"
                      })}
                      flex="1"
                      name="city"
                      _focusVisible={{
                        borderColor: "#404040",
                        boxShadow: "none",
                        outlineStyle: "none"
                      }}
                    />
                  </InputGroup>
                  {errors.city && (
                    <Text color="red.500" fontSize="0.75rem">
                      {errors.city.message}
                    </Text>
                  )}
                </Field>

                <Field label="Phone Number" fontFamily="Arial" fontSize="0.75rem" fontWeight="400" invalid={!!errors.phone}>
                  <PhoneInputWithCountry
                    {...register("phone", {
                      required: "Phone Number is required"
                    })}
                    control={control}
                    rules={{ required: true }}
                    inputComponent={CustomInput}
                  />
                  {/* <InputGroup w="100%" bg={!!errors.phone ? "#ffe0e0" : ""}>
                    <Input
                      {...register("phone", {
                        required: "Phone Number is required"
                      })}
                      flex="1"
                      name="phone"
                      // placeholder="Type your email"
                      _focusVisible={{
                        borderColor: "#404040",
                        boxShadow: "none",
                        outlineStyle: "none"
                      }}
                    />
                  </InputGroup> */}
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
