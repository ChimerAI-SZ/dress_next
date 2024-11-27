import { Button } from "@components/ui/button"
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger
} from "@components/ui/dialog"
import { Box, Flex, Text, Image } from "@chakra-ui/react"
import Warning from "@img/warning.png"
import { useState } from "react"
const Demo = ({ open, setOpen }: { open: boolean; setOpen: (value: boolean) => void }) => {
  return (
    <DialogRoot open={open} key="center" placement="center" motionPreset="slide-in-bottom">
      <DialogContent
        width="18.44rem"
        height="13rem"
        background="inear-gradient( 180deg, #FFF4E7 0%, #FFFFFF 100%)"
        border-radius="0.75rem"
      >
        <Flex mt={"1.06rem"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"}>
          <Image w={"2.53rem"} h={"2.59rem"} src={Warning.src}></Image>
          <Text fontWeight="500" fontSize="1.06rem" color="171717">
            Ooops!
          </Text>
          <Text mx={"0.38rem"} mt={"0.5rem"} fontWeight="400" fontSize=" 0.88rem" color="#171717" textAlign={"center"}>
            A generation task is already in progress. Please try again later.
          </Text>
          <Button
            w={"13.44rem"}
            bgColor={"#ee3939"}
            borderRadius={"1.25rem"}
            type="submit"
            mt={"1rem"}
            onClick={() => {
              setOpen(false)
            }}
          >
            Got It
          </Button>
        </Flex>
      </DialogContent>
    </DialogRoot>
  )
}

export default Demo
