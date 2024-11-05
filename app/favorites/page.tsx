'use client'
import { useState } from 'react'
import { Container } from '@chakra-ui/react'

// 引用组件
import Header from './components/Header'
import FavouritesList from './components/FavouritesList'

function Page() {
  const [addDrawerVisible, setAddDrawerVisiblen] = useState(false)
  // 新增收藏夹点击事件
  const handleIconClick = (type: string): void => {
    console.log(type, 'type')
    // setAddModalVisible(true)
  }

  return (
    <Container p={0}>
      <Header name="CREAMODA" addBtnvisible={true} handleIconClick={handleIconClick} />
      <FavouritesList />
    </Container>
  )
}

export default Page
