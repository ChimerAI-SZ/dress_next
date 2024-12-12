import { Flex, Text, Image } from "@chakra-ui/react"
import { CollectionSuccessToastProps } from "@definitions/generate"
import ModalRight from "@img/generate-result/modal-right.svg"
import ModalBack from "@img/generate-result/modal-back.svg"

const CollectionSuccessToast: React.FC<CollectionSuccessToastProps> = ({ onMoveTo }) => {
  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Flex alignItems="center" gap="0.56rem">
        <Image src={ModalRight.src} boxSize="1.38rem" />
        <Text fontWeight="400" fontSize="0.88rem" color="#171717">
          Collect in Default
        </Text>
      </Flex>
      <Flex alignItems="center" gap="0.56rem" onClick={onMoveTo}>
        <Text fontWeight="400" fontSize="0.88rem" color="#EE3939">
          Move to
        </Text>
        <Image src={ModalBack.src} boxSize="1rem" />
      </Flex>
    </Flex>
  )
}

export default CollectionSuccessToast
