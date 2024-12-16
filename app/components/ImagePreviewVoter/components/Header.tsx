import styled from "@emotion/styled"

import { Image } from "@chakra-ui/react"
import { LeftOutlined } from "@ant-design/icons"

const Header = ({ close }: { close: () => void }) => {
  return (
    <HeaderWrapper>
      <BackIcon
        onClick={e => {
          e.stopPropagation()
          close && close()
        }}
      >
        <LeftOutlined />
      </BackIcon>
      <Image h={"1rem"} src="/assets/images/logo-CREAMODA.png" />
    </HeaderWrapper>
  )
}

Header.displayName = "Header"

export default Header

const HeaderWrapper = styled.header`
  padding: 1rem;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  flex-shrink: 0;

  height: 2.75rem;
  width: 100%;
`
const BackIcon = styled.div`
  z-index: 1;
  position: absolute;
  width: 1.38rem;
  left: 1rem;
`
