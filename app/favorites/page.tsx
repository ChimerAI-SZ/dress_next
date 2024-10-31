'use client'

import { Container } from '@chakra-ui/react'

// 引用组件
import Header from './components/Header'
import FavouritesList from './components/FavouritesList'

function Page() {
  // 新增收藏夹点击事件
  const handleAddFavourites = () => {
    // setAddModalVisible(true)
  }

  return (
    <Container>
      <Header name="Like" addBtnvisible={true} handleAddFavourites={handleAddFavourites} />
      <FavouritesList />
    </Container>
  )
}

export default Page
