"use client"

import { useState, useEffect } from "react"
import { Container, Grid, For, Image, Box, Button, Show, Flex } from "@chakra-ui/react"
import { useRouter } from "next/navigation"
import styled from "@emotion/styled"
import { RightOutlined } from "@ant-design/icons"

import logoutIcon from "@img/homepage/logoutIcon.svg"
import resetPwdIcon from "@img/homepage/resetPwdIcon.svg"
import LinkIcon from "@img/homepage/linkIcon.svg"

import Header from "../components/Header"

const operatorList = [
  {
    key: "resetPwd",
    label: "Reset Password",
    icon: resetPwdIcon,
    isDanger: false,
    redirectable: true
  },
  {
    key: "logout",
    label: "Logout",
    icon: logoutIcon,
    isDanger: true,
    redirectable: false
  }
]

const EditAvatar: React.FC = () => {
  const router = useRouter()

  // done btn clicked
  const handleSave = () => {
    router.back()
  }

  useEffect(() => {
    // query address list
  }, [])

  return (
    <Container className="homepage-edit-avatar-contaienr" p={"0"} zIndex={1}>
      <Header title="Settings" />

      {/* operators */}
      <OperatorWrapper className="homepage-operator-wrapper">
        <For each={operatorList}>
          {(item, index): React.ReactNode => {
            return (
              <OperatorBox key={item.key} onClick={() => {}}>
                <div>
                  <Image src={item.icon.src} alt={`${item.key}-icon`} />
                  <OperatorLabel isDanger={item.isDanger}>{item.label}</OperatorLabel>
                </div>
                <Show when={item.redirectable}>
                  <Image src={LinkIcon.src} alt="link-icon" />
                </Show>
              </OperatorBox>
            )
          }}
        </For>
      </OperatorWrapper>
    </Container>
  )
}

interface OperatorLabelProps {
  isDanger?: boolean
}

const OperatorWrapper = styled.div`
  margin-top: 16pt;
`
const OperatorBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 24pt;
  height: 50px;
  border-bottom: 1px solid #f0f0f0;

  & > div:first-child {
    display: flex;
    align-items: center;
    justify-content: flex-start;

    font-weight: 400;
    font-size: 1rem;
    color: #171717;

    & > img {
      margin-right: 4pt;
    }
  }

  & img {
    width: 18pt;
    height: 18pt;
  }
`
const OperatorLabel = styled.div<OperatorLabelProps>`
  color: ${props => (props.isDanger ? "#F50C00" : "#171717")};
`

export default EditAvatar
