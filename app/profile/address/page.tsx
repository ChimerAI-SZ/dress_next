"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import styled from "@emotion/styled"
import { storage } from "@utils/index"

import { Container, Grid, For, Image, Box, Button, Show, Flex } from "@chakra-ui/react"
import { RightOutlined } from "@ant-design/icons"

import Link from "next/link"

import { queryAllAddress } from "@lib/request/profile"

import addressIcon from "@img/homepage/address.svg"

import Header from "../components/Header"

const addressList = [
  {
    id: "1",
    isDefault: true,
    name: "Agnes Vaughn",
    phone: "+86 16298289",
    address: "3411 Chestnut St",
    city: "Philadelphia",
    state: "PA19104",
    country: "United States"
  },
  {
    id: "2",
    isDefault: false,
    name: "Agnes Vaughn",
    phone: "+86 16298289",
    address: "3411 Chestnut St",
    city: "Philadelphia",
    state: "PA19104",
    country: "United States"
  },
  {
    id: "3",
    isDefault: false,
    name: "Agnes Vaughn",
    phone: "+86 16298289",
    address: "3411 Chestnut St",
    city: "Philadelphia",
    state: "PA19104",
    country: "United States"
  }
]

const EditAvatar: React.FC = () => {
  const [addressList, setAddressList] = useState([])
  const router = useRouter()

  // 新增地址或修改地址事件
  const jump = (type: string) => {
    router.push(`address/${type}`)
  }

  const queryData = async () => {
    const user_id = storage.get("user_id")
    const params = {
      user_id: +(user_id ? user_id : "0")
    }
    const { success, data, message } = await queryAllAddress(params)
    if (success) {
      setAddressList(data)
    } else {
      //todo error hanlder
    }
  }

  useEffect(() => {
    // query address list
    queryData()
  }, [])

  return (
    <Container className="homepage-edit-avatar-contaienr" p={"0"} zIndex={1}>
      <Header title="Avatar" />
      <For each={addressList}>
        {(item, index) => {
          return (
            // <AddressWrapper key={item.id} isDefault={item.isDefault}>
            //   <Flex alignItems={"center"} justifyContent={"space-between"} mb={"6pt"}>
            //     <Show when={item.isDefault} fallback={<Image w="20px" h="20px" src={addressIcon.src} alt="address-icon" />}>
            //       <DefaultMark>Default</DefaultMark>
            //     </Show>
            //     <RightOutlined
            //       onClick={() => {
            //         jump(item.id)
            //       }}
            //     />
            //   </Flex>
            //   <Flex flexFlow={"row wrap"} alignItems={"center"} justifyContent={"flex-start"} color={"#171717"} fontWeight={500} fontSize={"1rem"} mb={"6pt"}>
            //     <span>{item.address},</span>
            //     <span>{item.city},</span>
            //     <span>{item.state},</span>
            //     <span>{item.country}</span>
            //   </Flex>
            //   <Box color={"#737373"} fontWeight={"400"} fontSize={"0.9rem"}>
            //     {item.name} | {item.phone}
            //   </Box>
            // </AddressWrapper>
            <div></div>
          )
        }}
      </For>

      <Box p={"8pt 16pt 24pt"} position={"fixed"} bottom={0} bgColor={"#fff"} w="100vw" borderRadius={"12px 12px 0 0"} boxShadow={"0px -1px 5px 0px rgba(214, 214, 214, 0.5);"}>
        {/* <Link
          href={{
            pathname: `homepage/address/${"add"}`
          }}
        > */}
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
        {/* </Link> */}
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
