'use client'

import { Container, Image, Show, Flex, Heading } from '@chakra-ui/react'

import { useRouter } from 'next/navigation'

import closeIcon from '@img/favourites/closeIcon.svg'
import addIcon from '@img/favourites/addIcon.svg'

export default function CustomersTable({ name, addBtnvisible }: { name: string; addBtnvisible: Boolean }) {
  const router = useRouter()

  // 返回上级页面
  const handleBack = () => {
    router.back()
  }

  return (
    <Container className="favourites-header-contaienr" px={0}>
      <Flex gap="4" height={'88px'} alignItems={'center'} justify="space-between">
        <Image w="24px" h="24px" src={closeIcon.src} alt="" onClick={handleBack} />
        <Heading>{name}</Heading>
        {/* 为了布局添加一个占位符 */}
        <Show when={addBtnvisible} fallback={<div> </div>}>
          <Image w="24px" h="24px" src={addIcon.src} alt="" />
        </Show>
      </Flex>
    </Container>
  )
}
