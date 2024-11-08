'use client'

import { Container, Image, Flex, Heading, Box } from '@chakra-ui/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LeftOutlined } from '@ant-design/icons'

import FavouritesDialog from './AlbumDrawer'

import addIcon from '@img/favourites/addIcon.svg'

import { FavouritesHeaderProps } from '@definitions/favourites'

const Header: React.FC<FavouritesHeaderProps> = ({ name, handleIconClick }) => {
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
        <FavouritesDialog type="add">
          <Box
            onClick={() => {
              handleIconClick('add')
            }}
            width={'22pt'}
            h={'22pt'}
            display={'flex'}
            alignItems={'center'}
            justifyContent={'center'}
            fontSize={'1.5rem'}
            borderRadius={'50%'}
            border={'1px solid #BFBFBF'}
          >
            <Image src={addIcon.src} h={'14pt'} w={'14pt'} alt="add icon" />
          </Box>
        </FavouritesDialog>
      </Flex>
    </Container>
  )
}

export default Header
