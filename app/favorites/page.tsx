'use client'
import { Container } from '@chakra-ui/react'
import Header from './components/Header'
import FavouritesList from './components/FavouritesList'

import { useRouter } from 'next/navigation'

function Page() {
  const router = useRouter()

  // 返回上级路由
  const handleBack = () => {
    router.back()
  }

  // 新增收藏夹点击事件
  const handleAddFavourites = () => {
    // setAddModalVisible(true)
  }

  return (
    <Container maxW="container.lg">
      <Header name="Like" addBtnvisible={true} handleBack={handleBack} handleAddFavourites={handleAddFavourites} />
      <FavouritesList />
    </Container>
  )
}

export default Page
