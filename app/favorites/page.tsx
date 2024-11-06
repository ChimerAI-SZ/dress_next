'use client'
import { Container } from '@chakra-ui/react'

// 引用组件
import Header from './components/Header'
import FavouritesList from './components/FavouritesList'

function Page() {
  // 新增收藏夹点击事件
  const handleIconClick = (type: string): void => {
    console.log(type, 'type')
    // setAddModalVisible(true)
  }

  return (
    <Container p={0}>
      <Header name="Collections" addBtnvisible={true} handleIconClick={handleIconClick} />
      <FavouritesList />
    </Container>
  )
}

export default Page
