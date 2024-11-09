'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styled from '@emotion/styled'

import { Container, Box, Flex, Heading, Image } from '@chakra-ui/react'
import { LeftOutlined } from '@ant-design/icons'

import homepageBg from '@img/homepage/homepageBg.png'

function Homepage() {
  const router = useRouter()

  useEffect(() => {
    // query home page data
  }, [])

  return (
    <Container p={0} position={'relative'}>
      <Container className="homepate-header-contaienr" p={'11pt 16pt'} zIndex={1}>
        <Flex gap="4" alignItems={'center'} justify="space-between" position={'relative'}>
          <LeftOutlined
            style={{ width: '22pt', height: '22pt' }}
            onClick={() => {
              router.back()
            }}
          />
          <Heading position={'absolute'} left={'50%'} transform={'translateX(-50%)'}>
            Avatar
          </Heading>
          {/* 布局占位容器 */}
          <Box />
        </Flex>
      </Container>
      <AvatarWrapper className="homepage-avatar-container">
        <Image src={homepageBg.src} alt="" w={'100%'} h={'100%'} />
        <AvatarContainer>
          <AvatarBg></AvatarBg>
        </AvatarContainer>
      </AvatarWrapper>
    </Container>
  )
}
const AvatarWrapper = styled.div`
  position: absolute;
  height: 25vh;
  width: 100vw;
  top: 0;
  z-index: 0;
  &::after {
    content: '';
    padding: 20px;
    height: 20px;
    display: inline-block;
    width: 100%;
    bottom: -5px;
    position: absolute;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
    backdrop-filter: blur(10px);
  }
`

const AvatarContainer = styled.div`
  z-index: 1;
  width: 25vw;
  height: 25vw;
  position: absolute;
  background: #fff;
  border-radius: 50%;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 50%);

  display: flex;
  align-items: center;
  justify-content: center;
`
const AvatarBg = styled.div`
  background: linear-gradient(219deg, rgba(255, 144, 144, 1), rgba(254, 75, 163, 1));
  width: calc(100% - 8pt);
  height: calc(100% - 8pt);
  border-radius: 50%;
`

export default Homepage
