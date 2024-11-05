'use client'

import { Container, Image, Show, Flex, Heading, Button, Box } from '@chakra-ui/react'
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from '@components/ui/menu'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LeftOutlined, EllipsisOutlined } from '@ant-design/icons'

import FavouritesDialog from './AlbumDrawer'

import fullSelectionIcon from '@img/favourites/fullSelection.svg'
import addIcon from '@img/favourites/addIcon.svg'

import { FavouritesHeaderProps } from '@definitions/favourites'

const Header: React.FC<FavouritesHeaderProps> = ({ name, addBtnvisible, handleIconClick, favouriteId }) => {
  const pathname = usePathname()

  return (
    <Container className="favourites-header-contaienr" p={'11pt 16pt'}>
      <Flex gap="4" alignItems={'center'} justify="space-between" position={'relative'}>
        {/* 如果当前在收藏夹列表，返回主页，不然返回收藏夹页 */}
        {/* todo：这种情况只有在‘收藏夹的来源只有主页’的情况下使用 */}
        <Link href={pathname === '/favorites' ? '/' : '/favorites'}>
          {/* <Image w="24px" h="24px" src={closeIcon.src} alt="" /> */}
          <LeftOutlined style={{ width: '22pt', height: '22pt' }} />
        </Link>
        <Heading position={'absolute'} left={'50%'} transform={'translateX(-50%)'}>
          {name}
        </Heading>
        {/* 新增 icon 与编辑/删除的menu多选 icon */}
        <Show
          when={addBtnvisible}
          fallback={
            <Flex alignItems={'center'}>
              <Image w="22pt" h="22pt" mr={'4pt'} src={fullSelectionIcon.src} alt="" />
              <MenuRoot
                onSelect={({ value }) => {
                  handleIconClick(value)
                }}
              >
                <MenuTrigger asChild>
                  <Box width={'28pt'} h={'28pt'} display={'flex'} alignItems={'center'} justifyContent={'center'} fontSize={'1.5rem'} borderRadius={'50%'} border={'1px solid #BFBFBF'}>
                    <EllipsisOutlined />
                  </Box>
                </MenuTrigger>
                <MenuContent border={'1px solid #bfbfbf'} borderRadius={'16pt'} backdropFilter={'blur(5px)'} bgColor={'rgba(255,255,255,0.8)'}>
                  <FavouritesDialog type="edit" favouriteId={favouriteId}>
                    <MenuItem value="edit">Edit</MenuItem>
                  </FavouritesDialog>
                  <MenuItem value="delete">Delete</MenuItem>
                </MenuContent>
              </MenuRoot>
            </Flex>
          }
        >
          <FavouritesDialog type="add">
            <Button
              h={'28pt'}
              borderRadius={'32pt'}
              colorPalette={'gray'}
              variant="outline"
              onClick={() => {
                handleIconClick('add')
              }}
            >
              <Image src={addIcon.src} h={'14pt'} w={'14pt'} alt="add icon" /> New
            </Button>
          </FavouritesDialog>
        </Show>
      </Flex>
    </Container>
  )
}

export default Header
