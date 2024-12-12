import styled from "@emotion/styled"
import { Button, Text, Image } from "@chakra-ui/react"
import { forwardRef } from "react"

interface FooterProps {
  footerBtnText: string
  onButtonClick?: () => void
}

const Footer = forwardRef<HTMLDivElement, FooterProps>(({ footerBtnText, onButtonClick }, ref) => {
  return (
    <FooterWrapper ref={ref}>
      <StartBtnBox>
        <Button width={"100%"} h={"2.5rem"} bgColor="#EE3939" borderRadius="1.25rem" onClick={onButtonClick}>
          <Text fontWeight={"700"} lineHeight={"1.44rem"} color="#fff" fontSize="1rem">
            {footerBtnText}
          </Text>
          <Image src="/assets/images/mainPage/star.svg" alt="Profile" boxSize="12pt" cursor="pointer" />
        </Button>
      </StartBtnBox>
    </FooterWrapper>
  )
})

const FooterWrapper = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  padding: 0.56rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0rem -0.06rem 0.28rem 0rem rgba(214, 214, 214, 0.5);
  border-radius: 0.75rem 0.75rem 0rem 0rem;
  z-index: 2;
`

const StartBtnBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1.53rem;
  width: 100%;

  & > button {
    position: relative;
  }
`

Footer.displayName = "Footer"

export default Footer
