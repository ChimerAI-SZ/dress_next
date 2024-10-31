'use client'

import { Container, Image, Show, Flex, Heading } from '@chakra-ui/react'

import FavouritesDialog from './FavouritesDialog'

import closeIcon from '@img/favourites/closeIcon.svg'
import addIcon from '@img/favourites/addIcon.svg'

import { FavouritesHeaderProps } from '@definitions/favourites'

const Header: React.FC<FavouritesHeaderProps> = ({ name, addBtnvisible, handleBack, handleAddFavourites }) => {
  return (
    <Container className="favourites-header-contaienr" px={0}>
      <Flex gap="4" height={'88px'} alignItems={'center'} justify="space-between">
        <Image w="24px" h="24px" src={closeIcon.src} alt="" onClick={handleBack} />
        <Heading>{name}</Heading>
        {/* 为了布局添加一个占位符 */}
        <Show when={addBtnvisible} fallback={<div> </div>}>
          <FavouritesDialog type="add">
            <Image w="24px" h="24px" src={addIcon.src} alt="" onClick={handleAddFavourites} />
          </FavouritesDialog>
        </Show>
      </Flex>
    </Container>
  )
}

export default Header
