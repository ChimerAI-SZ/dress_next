"use client"

import { useState } from "react"
import { Container, Grid, For, Image, Box, Button, Show } from "@chakra-ui/react"
import { useRouter } from "next/navigation"
import styled from "@emotion/styled"
import { storage } from "@utils/index"

import { editProdile } from "@lib/request/profile"

import { Alert } from "@components/Alert"
import Header from "../components/Header"

const avatarIndexList = new Array(20).fill(null).map((_, index) => {
  return "0" + (index + 1 < 10 ? "0" + (index + 1) : index + 1)
})

const EditAvatar: React.FC = () => {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null)

  const router = useRouter()

  const handleSelectAvatar = (item: string) => {
    setSelectedAvatar(item)
  }

  // done btn clicked
  const handleSaveAvatar = async () => {
    const user_id = storage.get("user_id")

    if (selectedAvatar && user_id) {
      const params = {
        user_id: +user_id as number,
        avatar_url: selectedAvatar
      }

      const { success, data, message } = await editProdile(params)

      if (success) {
        Alert.open({
          content: message,
          iconVisible: false
        })
        router.back()
      }
    } else {
      //TODO - 没有选择头像时的交互
    }
  }

  return (
    <Container className="homepage-edit-avatar-contaienr" p={"0"} zIndex={1}>
      <Header title="Avatar" />
      <Grid templateColumns="repeat(4, 1fr)" gap="6" p={"8pt"}>
        <For each={avatarIndexList}>
          {(item, index) => {
            return (
              <Box
                onClick={() => {
                  handleSelectAvatar(item)
                }}
                key={index}
                background={"linear-gradient( 219deg, #FFD2D3 0%, #FFBADA 100%);"}
                borderRadius={"50%"}
                overflow={"hidden"}
                position={"relative"}
              >
                <Show when={selectedAvatar === item}>
                  <SelectedMark />
                </Show>
                <Image src={`/assets/images/homepage/avatar/${item}.png`} alt={`avatar-${item}-img`} />
              </Box>
            )
          }}
        </For>
      </Grid>

      <Box p={"8pt 16pt"} position={"fixed"} bottom={0} bgColor={"#fff"} w="100vw" borderRadius={"12px 12px 0 0"} boxShadow={"0px -1px 5px 0px rgba(214, 214, 214, 0.5);"}>
        <Button borderRadius={"40px"} w={"100%"} bgColor={"#EE3939"} onClick={handleSaveAvatar}>
          Done
        </Button>
      </Box>
    </Container>
  )
}

const SelectedMark = styled.div`
  border: 2px solid #ee3939;
  width: 100%;
  height: 100%;
  z-index: 0;
  position: absolute;
  border-radius: 50%;
`

export default EditAvatar
