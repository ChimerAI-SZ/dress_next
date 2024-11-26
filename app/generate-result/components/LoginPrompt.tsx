import { Flex, Text, Image } from "@chakra-ui/react"
import { LoginPromptProps } from "@definitions/generate"
import ModalBack from "@img/generate-result/modal-back.svg"

const LoginPrompt: React.FC<LoginPromptProps> = ({ onLogin }) => {
  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Flex alignItems="center" gap="0.56rem">
        <Text fontWeight="400" fontSize="0.88rem" color="#171717">
          Login to have generation history
        </Text>
      </Flex>
      <Flex alignItems="center" gap="0.56rem" onClick={onLogin}>
        <Text fontWeight="400" fontSize="0.88rem" color="#EE3939">
          Log in
        </Text>
        <Image src={ModalBack.src} boxSize="1rem" />
      </Flex>
    </Flex>
  )
}

export default LoginPrompt
