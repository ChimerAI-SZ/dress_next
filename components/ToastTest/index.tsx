import { Group, Flex, Image, Text, Input } from "@chakra-ui/react";
import { Button } from "@components/ui/button";
import {
  DialogContent,
  DialogRoot,
  DialogTrigger,
} from "@components/ui/dialog";

import { useState } from "react";
import {
  NativeSelectField,
  NativeSelectRoot,
} from "@components/ui/native-select";
import Phone from "@img/phone.svg";

interface DialogComponentProps {
  isOpen: boolean;
  phoneNumber: string;
  onOpen: () => void;
  onClose: () => void;
  setPhoneNumber: (value: string) => void;
  affirmDialog: () => void;
}
const Component: React.FC<DialogComponentProps> = ({
  isOpen,
  phoneNumber,
  onOpen,
  onClose,
  setPhoneNumber,
  affirmDialog,
}) => {
  return (
    <DialogRoot open={isOpen} placement="center" motionPreset="slide-in-bottom">
      <DialogContent width="18.44rem">
        <Flex
          background="linear-gradient( 180deg, #E7F0FF 0%, rgba(255,255,255,0) 100%)"
          alignItems={"center"}
          justifyContent={"center"}
          borderRadius="0.75rem"
          flexDirection={"column"}
        >
          <Image src={Phone.src} boxSize={"2.53rem"} mt={"1.06rem"}></Image>
          <Text
            fontFamily="PingFangSC, PingFang SC"
            fontWeight="500"
            fontSize="1.06rem"
            color="#171717"
            mt={"0.09rem"}
          >
            Get in Touch
          </Text>
          <Text
            font-family="PingFangSC, PingFang SC"
            font-weight="400"
            font-size="0.88rem"
            color="171717"
            mt={"0.38rem"}
            textAlign={"center"}
            px={"1.5rem"}
          >
            Would you like us to contact you later by phone or email?
          </Text>
          <Group
            mt={"0.75rem"}
            width="16.44rem"
            height="2.75rem"
            background=" #F5F5F5"
            borderRadius="0.5rem"
          >
            <NativeSelectRoot
              w={"6.8rem"}
              fontFamily="PingFangSC, PingFang SC"
              fontWeight="400"
              fontSize="0.88rem"
              color="#171717"
            >
              <NativeSelectField border={"none"}>
                <option value="1">+86</option>
              </NativeSelectField>
            </NativeSelectRoot>
            <Input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              bg="#f5f5f5"
              fontSize="1rem"
              fontWeight="normal"
              border={"none"}
            />
          </Group>
        </Flex>
        <Flex
          my={"1rem"}
          alignItems={"center"}
          justifyContent={"space-between"}
          mx={"1.5rem"}
        >
          <Button
            width="6.88rem"
            height="2.44rem"
            background="rgba(255,255,255,0.5)"
            borderRadius="1.25rem"
            border="0.03rem solid #BFBFBF"
            onClick={onClose}
          >
            <Text
              font-family="PingFangSC, PingFang SC"
              font-weight="500"
              font-size="0.88rem"
              color="#404040"
            >
              Cancel
            </Text>
          </Button>
          <Button
            width="6.88rem"
            height="2.44rem"
            background="#EE3939"
            borderRadius="1.25rem"
            onClick={affirmDialog}
          >
            <Text
              font-family="PingFangSC, PingFang SC"
              font-weight="500"
              font-size="0.88rem"
              color="#fff"
            >
              Confirm
            </Text>
          </Button>
        </Flex>
      </DialogContent>
    </DialogRoot>
  );
};

export default Component;