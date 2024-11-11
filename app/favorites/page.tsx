'use client'
import { useEffect, useState } from 'react'
import { Container } from '@chakra-ui/react'

// 引用组件
import Header from './components/Header'
import FavouritesList from './components/FavouritesList'

import { FavouriteItem } from '@definitions/favourites'
import { queryCollectionList } from '@lib/request/favourites'
import { storage } from '@utils/index'

function Page() {
  const [collectionList, setCollectionList] = useState<FavouriteItem[]>([])
  // 新增收藏夹点击事件
  const handleIconClick = (type: string): void => {}

  const queryCollectionData = async () => {
    const { message, data, success } = await queryCollectionList({ user_id: storage.get('user_id') ?? '' })

    if (success) {
      setCollectionList(data)
    } else {
      // todo erro hanlder
    }
    // setCollectionList(revenue){
    const res = {
      data: [
        {
          collection_id: 2,
          user_id: 3,
          title: 'Default Collection',
          description: '',
          is_deleted: false,
          is_default: true,
          created_at: '2024-11-11T15:30:51.732917011+08:00',
          images: [],
          total: 0
        }
      ],
      message: '',
      success: true
    }

    setCollectionList(res.data)
  }

  useEffect(() => {
    queryCollectionData()
  }, [])

  return (
    <Container p={0}>
      <Header name="Collections" handleIconClick={handleIconClick} />
      <FavouritesList collectionList={collectionList} />
    </Container>
  )
}

export default Page
