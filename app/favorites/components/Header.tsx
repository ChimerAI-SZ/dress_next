'use client'

import { Container, Image, Show, Flex, Heading } from '@chakra-ui/react'
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from '@components/ui/menu'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import FavouritesDialog from './FavouritesDialog'

import closeIcon from '@img/favourites/closeIcon.svg'
import addIcon from '@img/favourites/addIcon.svg'
import moreIcon from '@img/favourites/moreIcon.svg'

import { FavouritesHeaderProps } from '@definitions/favourites'

const Header: React.FC<FavouritesHeaderProps> = ({ name, addBtnvisible, handleIconClick }) => {
  const pathname = usePathname()

  return (
    <Container className="favourites-header-contaienr" px={'1rem'}>
      <Flex gap="4" height={'4rem'} alignItems={'center'} justify="space-between">
        {/* 如果当前在收藏夹列表，返回主页，不然返回收藏夹页 */}
        {/* todo：这种情况只有在‘收藏夹的来源只有主页’的情况下使用 */}
        <Link href={pathname === '/favorites' ? '/' : '/favorites'}>
          <Image w="24px" h="24px" src={closeIcon.src} alt="" />
        </Link>
        <Heading>{name}</Heading>
        {/* 新增 icon 与编辑/删除的menu多选 icon */}
        <Show
          when={addBtnvisible}
          fallback={
            <MenuRoot
              onSelect={({ value }) => {
                handleIconClick(value)
              }}
            >
              <MenuTrigger asChild>
                <Image w="24px" h="24px" src={moreIcon.src} alt="" />
              </MenuTrigger>
              <MenuContent>
                <MenuItem value="edit">Edit</MenuItem>
                <MenuItem value="delete">Delete</MenuItem>
              </MenuContent>
            </MenuRoot>
          }
        >
          <FavouritesDialog type="add">
            <Image
              w="24px"
              h="24px"
              src={addIcon.src}
              alt=""
              onClick={() => {
                handleIconClick('add')
              }}
            />
          </FavouritesDialog>
        </Show>
      </Flex>
    </Container>
  )
}

export default Header
