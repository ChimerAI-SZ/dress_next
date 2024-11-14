"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import styled from "@emotion/styled"
import { storage } from "@utils/index"

import { Container, For, Image, Box, Button, Show, Flex } from "@chakra-ui/react"
import { RightOutlined } from "@ant-design/icons"

import { shippingAddressType } from "@definitions/profile"
import { queryAllAddress } from "@lib/request/profile"

import addressIcon from "@img/homepage/address.svg"

import Header from "../components/Header"

const EditAvatar: React.FC = () => {
  const [addressList, setAddressList] = useState<shippingAddressType[]>([])
  const router = useRouter()

  // 新增地址或修改地址事件
  const jump = (type: string) => {
    router.push(`address/${type}`)
  }

  const queryData = async () => {
    const user_id = storage.get("user_id")
    if (user_id) {
      const params = {
        user_id: +user_id as number
      }
      const { success, data, message } = await queryAllAddress(params)
      if (success) {
        // 把默认数据放在最前面
        data.sort((a: shippingAddressType, b: shippingAddressType) => {
          if (a.is_default && !b.is_default) {
            return -1
          }
          if (!a.is_default && b.is_default) {
            return 1
          }
          return 0
        })

        setAddressList(data)

        localStorage.setItem("addressList", JSON.stringify(data))
      } else {
        //todo error hanlder
      }
    }
  }

  useEffect(() => {
    // query address list
    queryData()
  }, [])

  return (
    <Container className="homepage-address-contaienr" p={"0"} zIndex={1}>
      <Header title="Shipping Address" />
      <For each={addressList}>
        {(item: shippingAddressType, index) => {
          return (
            <AddressWrapper
              key={item.address_id}
              isDefault={item.is_default}
              onClick={() => {
                jump(item.address_id + "")
              }}
            >
              <Flex alignItems={"center"} justifyContent={"space-between"} mb={"6pt"}>
                <Show when={item.is_default} fallback={<Image w="20px" h="20px" src={addressIcon.src} alt="address-icon" />}>
                  <DefaultMark>Default</DefaultMark>
                </Show>
                <RightOutlined />
              </Flex>
              <Flex flexFlow={"row wrap"} alignItems={"center"} justifyContent={"flex-start"} color={"#171717"} fontWeight={500} fontSize={"1rem"} mb={"6pt"}>
                <span>{item.street_address_1},</span>
                <Show when={item.street_address_2}>
                  <span>{item.street_address_2},</span>
                </Show>
                <span>{item.city},</span>
                <span>{item.state} </span>
                <span>{item.postal_code} </span>
                <span>{item.country}</span>
              </Flex>
              <Box color={"#737373"} fontWeight={"400"} fontSize={"0.9rem"}>
                {item.full_name} | {item.phone_number}
              </Box>
            </AddressWrapper>
          )
        }}
      </For>

      <Box p={"8pt 16pt 24pt"} position={"fixed"} bottom={0} bgColor={"#fff"} w="100vw" borderRadius={"12px 12px 0 0"} boxShadow={"0px -1px 5px 0px rgba(214, 214, 214, 0.5);"}>
        <Button
          borderRadius={"40px"}
          w={"100%"}
          bgColor={"#EE3939"}
          onClick={() => {
            jump("add")
          }}
        >
          Add New Address
        </Button>
      </Box>
    </Container>
  )
}

interface AddressWrapperProps {
  isDefault?: boolean
}
const AddressWrapper = styled.div<AddressWrapperProps>`
  margin: 12pt;
  padding: 12pt;
  border-radius: 10px;
  border: 1px solid ${props => (props.isDefault ? "#EE3939" : "#ddd")};
`
const DefaultMark = styled.div`
  background: #ee3939;
  border-radius: 40px;
  font-weight: 400;
  font-size: 12px;
  color: #ffffff;
  text-align: left;
  font-style: normal;
  padding: 1pt 4pt;
`

export default EditAvatar
