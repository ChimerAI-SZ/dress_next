"use client"
import React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import PhoneInputWithCountry from "react-phone-number-input/react-hook-form"

import { Container, VStack, Fieldset, Flex, Box, Button, Input, Text } from "@chakra-ui/react"
import { Checkbox } from "@components/ui/checkbox"
import { InputGroup } from "@components/ui/input-group"
import { Field } from "@components/ui/field"
import { Alert } from "@components/Alert"

import { storage } from "@utils/index"
import { addAddress, editAddress } from "@lib/request/profile"
import { errorCaptureRes } from "@utils/index"
import { shippingAddressType } from "@definitions/profile"

import Header from "../../components/Header"

import "react-phone-number-input/style.css"
import "./index.css"

interface FormValues {
  full_name: string
  country: string
  street_address_1: string
  street_address_2: string
  city: string
  phone_number: string
  state: string
  postal_code: string
  is_default: boolean
}
interface EditAddressProps {
  params: { addressId: string }
}

const EditAddress: React.FC<EditAddressProps> = ({ params }) => {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    control
  } = useForm<FormValues>({
    defaultValues: JSON.parse(localStorage.getItem("addressList") ?? "[]").find(
      (item: shippingAddressType) => item.address_id + "" === params.addressId
    )
  })

  // 表单最终提交逻辑
  const onSubmit = async (formData: FormValues) => {
    console.log("submit data:", formData)

    // Checkbox组件被选中时会返回‘on'
    formData.is_default = !/false/.test(formData.is_default + "")

    const user_id = storage.get("user_id")
    if (user_id) {
      if (params.addressId === "add") {
        const [err, res] = await errorCaptureRes(addAddress, {
          user_id: +user_id as number,
          ...formData
        })

        if (err || (res && !res?.success)) {
          Alert.open({
            content: err.message ?? res.message
          })
        } else if (res.success) {
          router.back()
        }
      } else {
        const [err, res] = await errorCaptureRes(editAddress, {
          user_id: +user_id as number,
          address_id: +params.addressId as number,
          ...formData
        })

        if (err || (res && !res?.success)) {
          Alert.open({
            content: err.message ?? res.message
          })
        } else if (res.success) {
          router.back()
        }
      }
    }
  }

  return (
    <Container className="homepage-edit-address-contaienr" p={"0"} zIndex={1}>
      <Header title={params.addressId === "add" ? "Add New Address" : "Edit Address"} />

      <Box p={"16pt"}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack pb="4rem" w="100%">
            <Fieldset.Root w="100%">
              <Fieldset.Content w="100%">
                {/* full name */}
                <Field label="Full Name" fontSize="0.75rem" fontWeight="400" invalid={!!errors.full_name}>
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
                      caretColor="black"
                    />
                  </InputGroup>
                  {errors.full_name && (
                    <Text color="red.500" fontSize="0.75rem">
                      {errors.full_name.message}
                    </Text>
                  )}
                </Field>
                {/* country */}
                <Field label="Country" fontSize="0.75rem" fontWeight="400" invalid={!!errors.country}>
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
                      caretColor="black"
                    />
                  </InputGroup>
                  {errors.country && (
                    <Text color="red.500" fontSize="0.75rem">
                      {errors.country.message}
                    </Text>
                  )}
                </Field>
                {/* address */}
                <Field label="Address" fontSize="0.75rem" fontWeight="400" invalid={!!errors.street_address_1}>
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
                      caretColor="black"
                    />
                  </InputGroup>
                  {errors.street_address_1 && (
                    <Text color="red.500" fontSize="0.75rem">
                      {errors.street_address_1.message}
                    </Text>
                  )}
                </Field>
                {/* address */}
                <Field label="Address Line 2" fontSize="0.75rem" fontWeight="400" invalid={!!errors.street_address_2}>
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
                      caretColor="black"
                    />
                  </InputGroup>
                  {errors.street_address_2 && (
                    <Text color="red.500" fontSize="0.75rem">
                      {errors.street_address_2.message}
                    </Text>
                  )}
                </Field>
                {/* city */}
                <Field label="City" fontSize="0.75rem" fontWeight="400" invalid={!!errors.city}>
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
                      caretColor="black"
                    />
                  </InputGroup>
                  {errors.city && (
                    <Text color="red.500" fontSize="0.75rem">
                      {errors.city.message}
                    </Text>
                  )}
                </Field>

                {/* city */}
                <Field label="State/Region" fontSize="0.75rem" fontWeight="400" invalid={!!errors.state}>
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
                        caretColor="black"
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
                        caretColor="black"
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

                <Field label="Phone Number" fontSize="0.75rem" fontWeight="400" invalid={!!errors.phone_number}>
                  <PhoneInputWithCountry
                    className="shipping_address_phone_number"
                    name="phone_number"
                    control={control}
                    rules={{ required: true }}
                  />

                  {errors.phone_number && (
                    <Text color="red.500" fontSize="0.75rem">
                      {errors.phone_number.message}
                    </Text>
                  )}
                </Field>

                <Field label="" fontSize="0.75rem" fontWeight="400" invalid={!!errors.is_default}>
                  <Checkbox
                    {...register("is_default", {})}
                    onChange={e => {
                      console.log(e)
                    }}
                  >
                    Set as default address
                  </Checkbox>
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
            <Box
              p={"8pt 16pt 24pt"}
              position={"fixed"}
              bottom={0}
              bgColor={"#fff"}
              w="100vw"
              borderRadius={"12px 12px 0 0"}
              boxShadow={"0px -1px 5px 0px rgba(214, 214, 214, 0.5);"}
            >
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
