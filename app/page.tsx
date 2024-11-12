'use client'

import { useRef, useEffect } from 'react'
import { Container, Box, Flex, Link, Image, Button, Text, useDisclosure } from '@chakra-ui/react'
import styled from '@emotion/styled'

import Waterfall from './components/Waterfall'
import { useRouter } from 'next/navigation'
// import ImageGuideModal from "../components/Common/ImageGuideModal";

function Dashboard() {
  // const { onOpen, onClose } = useDisclosure();
  const router = useRouter()

  const headerRef = useRef<HTMLDivElement>(null) // 容器ref

  // header 在页面滚动之后设置白色背景色
  useEffect(() => {
    if (headerRef.current) {
      const el = headerRef.current

      const handleScroll = () => {
        if (window.scrollY > 0) {
          el.style.backgroundColor = '#fff'
        } else if (window.scrollY === 0) {
          el.style.backgroundColor = 'transparent'
        }
      }
      window.addEventListener('scroll', handleScroll)

      return () => {
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [headerRef.current])

  return (
    <Container p={0} position={'relative'}>
      <BackgroundBox>
        <Image src="/assets/images/mainPage/bg.png" alt="bg-img" />
      </BackgroundBox>
      <Box>
        {/* Header Section */}
        <Flex
          ref={headerRef}
          as="header"
          justify="space-between"
          align="center"
          h={'8vh'}
          px={'1rem'}
          mb={'3rem'}
          position="sticky"
          top={0}
          bg="white"
          zIndex="100"
          mt="-0.2rem"
          background={'transparent'}
          transition={'background-color 0.3s'}
        >
          <Text fontSize="1.3rem" fontWeight="bold" letterSpacing="0.1rem" fontFamily="Arial" textAlign="center">
            CREAMODA
          </Text>

          <Flex gap="0.5rem">
            {/* 收藏 */}
            <Link href="/favorites">
              <Image src="/assets/images/mainPage/like.svg" alt="Favorites" boxSize="22pt" cursor="pointer" />
            </Link>
            {/* 生成历史 */}
            <Link href="/history">
              <Image src="/assets/images/mainPage/history.svg" alt="History" boxSize="22pt" cursor="pointer" />
            </Link>
            {/* 个人主页 */}
            <Link href="/profile">
              <Image src="/assets/images/mainPage/homepage.svg" alt="Profile" boxSize="22pt" cursor="pointer" />
            </Link>
          </Flex>
        </Flex>

        {/* Upload Button */}
        <StartBtnBox>
          <Button
            width={'90vw'}
            colorScheme="blackAlpha"
            border={'3px solid #f2d9da'}
            bgColor="#EE3939"
            color="white"
            py="1.75rem"
            fontSize="1.3rem"
            letterSpacing="0.02rem"
            onClick={() => {
              router.push('/upload')
            }}
            mt={1}
            mb={4}
            borderRadius="40px"
          >
            Start To Design
            <Image src="/assets/images/mainPage/star.svg" alt="Profile" boxSize="12pt" cursor="pointer" />
            <Blending>
              <Image src="/assets/images/mainPage/blending.png" alt="Profile" cursor="pointer" />
            </Blending>
          </Button>
        </StartBtnBox>

        {/* 图片区块 */}
        <MainSection>
          {/* Subtitle */}
          <Title>Fashion Trend</Title>
          <SubTitle>Quickly generate hot-selling products</SubTitle>

          {/* Waterfall Content */}
          <Box overflowY="auto">
            <Waterfall />
          </Box>

          {/* Image Guide Modal */}
          {/* <ImageGuideModal isOpen={isOpen} onClose={onClose} /> */}
        </MainSection>
      </Box>
    </Container>
  )
}

const BackgroundBox = styled.div`
  position: absolute;
  top: 0;
  z-index: -1;
`

const StartBtnBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  & > button {
    position: relative;
  }
`
const Blending = styled.div`
  position: absolute;
  bottom: 0;
  width: 75%;
  left: 50%;
  transform: translateX(-50%);
`

const MainSection = styled.section`
  padding: 1rem;
  background: linear-gradient(to bottom, #faf1f2, #fff 30vh, #fff);
  border: 2px solid #fff;
  border-radius: 16pt;
  margin-top: 24px;
  border-top-width: 1px;
`
const Title = styled.div`
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 600;
  font-size: 1.3rem;
  color: #171717;
  text-align: left;
  font-style: normal;
`
const SubTitle = styled.div`
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 400;
  font-size: 1rem;
  color: #666666;
  text-align: left;
  font-style: normal;
  margin-bottom: 12px;
`

export default Dashboard
