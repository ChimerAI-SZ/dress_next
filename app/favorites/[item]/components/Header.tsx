'use client'

import { Container, Image, Flex, Heading, Box } from '@chakra-ui/react'
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from '@components/ui/menu'
import Link from 'next/link'
import { LeftOutlined, EllipsisOutlined } from '@ant-design/icons'
// import { usePathname } from 'next/navigation'

import FavouritesDialog from '../../components/AlbumDrawer'

import fullSelectionIcon from '@img/favourites/fullSelection.svg'
import fullSelectionActiveIcon from '@img/favourites/fullSelectionActive.svg'
import deleteIcon from '@img/favourites/deleteIcon.svg'
import editIcon from '@img/favourites/editIcon.svg'

import { CollectionDetailHeaderProps } from '@definitions/favourites'

const Header: React.FC<CollectionDetailHeaderProps> = ({ handleIconClick, favouriteId, selectMode, handleSetSelectMode }) => {
  //   const pathname = usePathname()

  return (
    <Container className="favourites-header-contaienr" p={'11pt 16pt'}>
      <Flex gap="4" alignItems={'center'} justify="space-between" position={'relative'}>
        {/* 如果当前在收藏夹列表，返回主页，不然返回收藏夹页 */}
        {/* todo：这种情况只有在‘收藏夹的来源只有主页’的情况下使用 */}
        <Link href={'/favorites'}>
          {/* <Image w="24px" h="24px" src={closeIcon.src} alt="" /> */}
          <LeftOutlined style={{ width: '22pt', height: '22pt' }} />
        </Link>
        <Heading position={'absolute'} left={'50%'} transform={'translateX(-50%)'}>
          Collection Details
        </Heading>
        {/* 新增 icon 与编辑/删除的menu多选 icon */}
        <Flex alignItems={'center'}>
          <Image
            onClick={() => {
              handleSetSelectMode(!selectMode)
            }}
            w="22pt"
            h="22pt"
            mr={'4pt'}
            src={selectMode ? fullSelectionActiveIcon.src : fullSelectionIcon.src}
            alt=""
          />
          <MenuRoot
            onSelect={({ value }) => {
              handleIconClick(value)
            }}
          >
            <MenuTrigger asChild>
              <Box width={'22pt'} h={'22pt'} display={'flex'} alignItems={'center'} justifyContent={'center'} fontSize={'1.5rem'} borderRadius={'50%'} border={'1px solid #BFBFBF'}>
                <EllipsisOutlined />
              </Box>
            </MenuTrigger>
            <MenuContent border={'1px solid #bfbfbf'} borderRadius={'8pt'} backdropFilter={'blur(3px)'} bgColor={'rgba(255,255,255,0.8)'}>
              <FavouritesDialog type="edit" favouriteId={favouriteId}>
                <MenuItem borderBottom={'1px solid #c5c5c5'} value="edit">
                  <Image src={editIcon.src} h={'12pt'} w="12pt" alt="edit-icon" />
                  <Box>Edit Album</Box>
                </MenuItem>
              </FavouritesDialog>
              {/* todo 默认收藏夹是不能删除的 */}
              <MenuItem value="delete" color={'#E02020'}>
                <Image src={deleteIcon.src} h={'12pt'} w="12pt" alt="edit-icon" /> Delete Album
              </MenuItem>
            </MenuContent>
          </MenuRoot>
        </Flex>
      </Flex>
    </Container>
  )
}

export default Header
