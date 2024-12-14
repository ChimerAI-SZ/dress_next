"use client"

import { memo } from "react"
import { Button, Flex, Text, Image, VStack, Box, Grid, useDisclosure } from "@chakra-ui/react"
import { DrawerActionTrigger, DrawerBackdrop, DrawerContent, DrawerRoot, DrawerTrigger } from "@components/ui/drawer"

// 导入图片资源
import ImageGuideIcon from "@img/upload/tips.png"
import CloseIcon from "@img/upload/close.svg"
import Index1 from "@img/upload/index-1.png"
import Index2 from "@img/upload/index-2.png"
import Index3 from "@img/upload/index-3.png"
import Index4 from "@img/upload/index-4.png"
import Index5 from "@img/upload/index-5.png"
import Index6 from "@img/upload/index-6.png"

// 定义类型
interface GuideSection {
  title: string
  images: string[]
}

const GUIDE_SECTIONS: GuideSection[] = [
  {
    title: "Outfit",
    images: [Index1.src, Index2.src]
  },
  {
    title: "Print",
    images: [Index3.src, Index4.src]
  }
]

const GuideButton = memo(({ onClick }: { onClick?: () => void }) => (
  <Image src={ImageGuideIcon.src} w="1.13rem" h="1.13rem" alt="guide icon" onClick={onClick} />
))

const GuideSection = memo(({ title, images }: GuideSection) => (
  <Box mb="0.5rem">
    <Text mb={2} fontSize="1rem" fontWeight="600">
      {title}
    </Text>
    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
      {images.map((src, index) => (
        <Image key={`${title}-${index}`} src={src} alt={`${title} example ${index + 1}`} borderRadius="0px" />
      ))}
    </Grid>
  </Box>
))

interface ImageGuideProps {
  open?: boolean
  onClose?: () => void
  onOpen?: () => void
}

const ImageGuide = ({
  open: controlledOpen,
  onClose: onControlledClose,
  onOpen: onControlledOpen
}: ImageGuideProps) => {
  return (
    <DrawerRoot placement="bottom" open={controlledOpen}>
      <DrawerActionTrigger asChild>
        <DrawerBackdrop style={{ cursor: "pointer" }} onClick={onControlledClose} />
      </DrawerActionTrigger>
      <GuideButton onClick={onControlledOpen} />

      <DrawerContent roundedTop="13" maxH="65vh">
        <Flex
          position="sticky"
          top={0}
          zIndex={1}
          alignItems="center"
          justifyContent="center"
          width="full"
          py="0.7rem"
          borderBottom="1px solid"
          borderColor="gray.100"
          bg="white"
        >
          <DrawerActionTrigger asChild>
            <Image
              src={CloseIcon.src}
              boxSize="1.3rem"
              position="absolute"
              left="1rem"
              top="50%"
              transform="translateY(-50%)"
              cursor="pointer"
              onClick={onControlledClose}
              _hover={{ opacity: 0.7 }}
              alt="close"
            />
          </DrawerActionTrigger>

          <Text fontSize="1.06rem" fontWeight="500" letterSpacing="0.1rem" color="#171717">
            Image guide
          </Text>
        </Flex>

        <Box overflowY="auto" maxH="calc(63vh - 3rem)">
          <VStack align="stretch" gap={4} p="0.75rem">
            <Text color="#404040" fontSize="0.8rem">
              In order to have a better generative result, please upload a full display of the dress's, as shown below:
            </Text>

            {GUIDE_SECTIONS.map(section => (
              <GuideSection key={section.title} title={section.title} images={section.images} />
            ))}
          </VStack>
        </Box>
      </DrawerContent>
    </DrawerRoot>
  )
}

export default memo(ImageGuide)
