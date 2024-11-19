import Toast from "@components/Toast"
import styled from "@emotion/styled"

import { Image } from "@chakra-ui/react"

interface ImageViewerProps {
  close: () => void
  imgUrl: string
  footer: React.ReactNode
}

const ImageViewer: React.FC<ImageViewerProps> = ({ close, imgUrl, footer }) => {
  return (
    <Toast
      close={close}
      maskVisible={false}
      boxStyle={{
        width: "100vw",
        height: "100vh",

        bottom: "0",
        left: "0",
        right: "0",
        top: "0",
        transform: "unset",

        padding: "12pt",
        pt: "0",
        display: "flex",
        flexDirection: "column",
        background: "unset",
        position: "relative"
      }}
    >
      <Bg onClick={close} />
      <StyledImg src={imgUrl} />
      <Footer>{footer}</Footer>
    </Toast>
  )
}

const Bg = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(16px);
`
const StyledImg = styled(Image)`
  max-width: 90vw;
  z-index: 1;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0px 2px 17px 0px rgba(0, 0, 0, 0.07);
  border-radius: 12px;
  border: 1px solid rgba(182, 182, 182, 0.5);
`
const Footer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  padding: 8pt 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px -1px 5px 0px rgba(214, 214, 214, 0.5);
  border-radius: 12px 12px 0px 0px;
`

export default ImageViewer
