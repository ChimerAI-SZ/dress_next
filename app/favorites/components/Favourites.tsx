'use client'
import { Container, Show, Flex, Image, For, Box } from '@chakra-ui/react'
import styled from '@emotion/styled'

import { FavouriteItem } from '@definitions/favourites'

export default function Favourites({ favouriteData }: { favouriteData: FavouriteItem }) {
  return (
    <Container w={'50%'} px={'0.5rem'}>
      <Flex direction={'column'} alignItems={'center'} mb={'24px'}>
        <Show
          when={favouriteData.isDefault}
          fallback={
            <Flex position={'relative'} w={'100%'} h={206}>
              <Box w={'50%'} flex={'none'}>
                <Image w={'100%'} h={'100%'} src={favouriteData.coverImg[0]} />
              </Box>
              <Box w={'50%'} flex={'none'} position={'relative'} overflow={'hidden'}>
                <Image w="100%" top="0" position={'absolute'} zIndex={1} src={favouriteData.coverImg[1]} />
                <Image w="100%" top={'50%'} position={'absolute'} zIndex={1} src={favouriteData.coverImg[2]} />
              </Box>
            </Flex>
          }
        >
          <Box position={'relative'} w={'100%'} h={206}>
            <For each={favouriteData.coverImg}>{(item: string) => <DefaultImg src={item} alt="History" />}</For>
          </Box>
        </Show>
        <Box my={'0.5rem'} w={'100%'} color="#000" fontSize={'1rem'} fontWeight={'400'} letterSpacing={'0.4px'} h={'1.5rem'} lineHeight={'1.5rem'}>
          {favouriteData.name}
        </Box>
        <Box h={'22px'} w={'100%'} color="#A2A2A2" fontSize={'0.8rem'} fontWeight={'400'}>
          {favouriteData.imgNumber} images
        </Box>
      </Flex>
    </Container>
  )
}

const DefaultImg = styled(Image)`
  width: 47%;
  height: 206px;
  position: absolute;

  &:nth-child(1) {
    left: 0;
    z-index: 3;
  }
  &:nth-child(2) {
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
  }
  &:nth-child(3) {
    right: 0;
    z-index: 1;
  }
`
