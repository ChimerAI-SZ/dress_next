"use client"
import React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import PhoneInputWithCountry from "react-phone-number-input/react-hook-form"

import { Container, VStack, Fieldset, Flex, Box, Button, Input, Text } from "@chakra-ui/react"
import { Checkbox } from "@components/ui/checkbox"
import { InputGroup } from "@components/ui/input-group"
import { Field } from "@components/ui/field"
import { addAddress } from "@lib/request/profile"
import { Alert } from "@components/Alert"
import { storage } from "@utils/index"

import Header from "../../components/Header"

import "react-phone-number-input/style.css"
import "./index.css"

interface FormValues {
  full_name: string
  country: string
  street_address_1: string
  street_address_2: string
  city: string
  phone: string
  state: string
  postal_code: string
  is_default: boolean
}
interface EditAddressProps {
  params: { addressId: string }
}

const EditAddress: React.FC<EditAddressProps> = ({ params }) => {
  const router = useRouter()
  const [isAddingAddress, setIsAddingAddress] = useState(params.addressId === "add")

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setError,
    watch
  } = useForm<FormValues>()

  // 表单最终提交逻辑
  const onSubmit = async (formData: FormValues) => {
    console.log("submit data:", formData)
    const user_id = storage.get("user_id")
    const params = {
      user_id: +(user_id ? user_id : "0"),
      ...formData
    }

    const { success, data, message } = await addAddress(params)

    if (success) {
      router.back()
    } else {
      Alert.open({
        content: message
      })
    }
    // addAddress
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
                <Field label="Full Name" fontFamily="Arial" fontSize="0.75rem" fontWeight="400" invalid={!!errors.full_name}>
                  <InputGroup w="100%" bg={!!errors.full_name ? "#ffe0e0" : ""}>
                    <Input
                      {...register("full_name", {
                        required: "Full Name is required"
                      })}
                      flex="1"
                      name="full_name"
                      _focusVisible={{
                        borderColor: "#404040",
                        boxShadow: "none",
                        outlineStyle: "none"
                      }}
                    />
                  </InputGroup>
                  {errors.full_name && (
                    <Text color="red.500" fontSize="0.75rem">
                      {errors.full_name.message}
                    </Text>
                  )}
                </Field>
                {/* country */}
                <Field label="Country" fontFamily="Arial" fontSize="0.75rem" fontWeight="400" invalid={!!errors.country}>
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
                      placeholder="Street Address"
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
                {/* address */}
                <Field label="Address Line 2" fontFamily="Arial" fontSize="0.75rem" fontWeight="400" invalid={!!errors.street_address_2}>
                  <InputGroup w="100%" bg={!!errors.street_address_2 ? "#ffe0e0" : ""}>
                    <Input
                      {...register("street_address_2", {})}
                      flex="1"
                      name="street_address_2"
                      placeholder="Address line 2 (optional)"
                      _focusVisible={{
                        borderColor: "#404040",
                        boxShadow: "none",
                        outlineStyle: "none"
                      }}
                    />
                  </InputGroup>
                  {errors.street_address_2 && (
                    <Text color="red.500" fontSize="0.75rem">
                      {errors.street_address_2.message}
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

                {/* city */}
                <Field label="State/Region" fontFamily="Arial" fontSize="0.75rem" fontWeight="400" invalid={!!errors.state}>
                  <Flex alignItems={"center"} justifyContent={"space-between"} gap={5}>
                    <InputGroup bg={!!errors.state ? "#ffe0e0" : ""}>
                      <Input
                        {...register("state", {
                          required: "State is required"
                        })}
                        flex="1"
                        name="state"
                        _focusVisible={{
                          borderColor: "#404040",
                          boxShadow: "none",
                          outlineStyle: "none"
                        }}
                      />
                    </InputGroup>
                    <InputGroup bg={!!errors.postal_code ? "#ffe0e0" : ""}>
                      <Input
                        {...register("postal_code", {
                          required: "Zip code is required"
                        })}
                        flex="1"
                        name="postal_code"
                        placeholder="Zip Code"
                        _focusVisible={{
                          borderColor: "#404040",
                          boxShadow: "none",
                          outlineStyle: "none"
                        }}
                      />
                    </InputGroup>
                  </Flex>

                  {errors.city && (
                    <Text color="red.500" fontSize="0.75rem">
                      {errors.city.message}
                    </Text>
                  )}
                  {errors.postal_code && (
                    <Text color="red.500" fontSize="0.75rem">
                      {errors.postal_code.message}
                    </Text>
                  )}
                </Field>

                <Field label="Phone Number" fontFamily="Arial" fontSize="0.75rem" fontWeight="400" invalid={!!errors.phone}>
                  <PhoneInputWithCountry className="shipping_address_phone_number" name="phone" control={control} rules={{ required: true }} />

                  {errors.phone && (
                    <Text color="red.500" fontSize="0.75rem">
                      {errors.phone.message}
                    </Text>
                  )}
                </Field>

                <Field label="" fontFamily="Arial" fontSize="0.75rem" fontWeight="400" invalid={!!errors.is_default}>
                  <Checkbox {...register("is_default", {})}>Set as default address</Checkbox>
                  {errors.is_default && (
                    <Text color="red.500" fontSize="0.75rem">
                      {errors.is_default.message}
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

export default EditAddress
