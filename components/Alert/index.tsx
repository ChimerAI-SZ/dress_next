import { useRef } from "react"
import styled from "@emotion/styled"
import { keyframes } from "@emotion/react"
import { createRoot } from "react-dom/client"
import { Show } from "@chakra-ui/react"
import { v4 as uuidv4 } from "uuid"
import { AlertProps } from "@definitions/index"
import warnIcon from "@img/AlterWarningIcon.svg"

import "./index.css"

export const Alert = ({
  content, // 文字内容
  iconVisible = true, // 是否展示图标
  customIcon, // 自定义图标地址
  type = "default", // 添加type属性
  containerStyle
}: AlertProps) => {
  const ref = useRef(null)

  return (
    <AlertContainer ref={ref} className="public-alert-container" $type={type} style={containerStyle}>
      <Show when={iconVisible}>
        <StyledIcon $type={type}>
          <img src={customIcon ?? warnIcon.src} alt="" />
        </StyledIcon>
      </Show>

      {content.split("\n").map(item => {
        const id = uuidv4()
        return (
          <StyledContent key={id} $type={type}>
            {item}
          </StyledContent>
        )
      })}
    </AlertContainer>
  )
}

Alert.open = (parameter: AlertProps) => {
  let container = document.querySelector(".custom_alter")

  if (container === null) {
    container = document.createElement("div")
    container.className = "custom_alter"
    document.body.appendChild(container)
  }

  const Mes = () => {
    return <Alert {...parameter} />
  }
  const modal = createRoot(container)

  modal.render(<Mes />)

  setTimeout(() => {
    container.remove()
  }, parameter.duration ?? 2000)
}

const fadeAnime = keyframes`
0%{
    transform: translate(0,0);
    opacity: 0;
}
25%{
    transform: translate(0,15px);
    opacity: 1;
}
75%{
    transform: translate(0,15px);
    opacity: 1;
}
100%{
    transform: translate(0,0);
    opacity: 0;
}
`
const AlertContainer = styled.div<{ $type: string }>`
  width: 75vw;
  padding: 0.84rem 0.75rem;
  line-height: 22px;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: 400;
  z-index: 8000;
  animation: ${fadeAnime} 2.8s;

  ${props =>
    props.$type === "success"
      ? `
        background: #fff;
        color: #333;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        justify-content: center;
      `
      : `
    background: rgba(23, 23, 23, 0.8);
    color: #fff;
  `}
`
const StyledIcon = styled.div<{ $type: string }>`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  ${props => props.$type === "default" && "margin-bottom: 0.38rem;"}

  & > img {
    width: ${props => (props.$type === "success" ? "1.38rem" : "1.75rem")};
    height: ${props => (props.$type === "success" ? "1.38rem" : "1.75rem")};
    ${props =>
      props.$type === "success"
        ? `
        margin-right: 0.56rem;
      `
        : ""}
  }
`
const StyledContent = styled.p<{ $type: string }>`
  text-align: center;

  color: ${props => (props.$type === "success" ? "#171717" : "#fff")};
  font-size: ${props => (props.$type === "success" ? "0.88rem" : "1rem")};
`
