"use client"
import { useEffect, useState } from "react"
import { Container } from "@chakra-ui/react"
import { useDispatch } from "react-redux"
import { Provider } from "react-redux"

// 引用组件
import Header from "./components/Header"
import FavouritesList from "./components/FavouritesList"

import { FavouriteItem } from "@definitions/favourites"
import { setList } from "./collectionSlice"
import { store } from "./store"
import { storage } from "@utils/index"

// 接口 - 收藏夹列表
import { queryCollectionList } from "@lib/request/favourites"

function Page() {
  const [collectionList, setCollectionList] = useState<FavouriteItem[]>([])
  const dispatch = useDispatch()

  const queryCollectionData = async () => {
    const user_id = storage.get("user_id")

    if (user_id) {
      const { message, data, success } = await queryCollectionList({ user_id: +user_id as number })

      if (success) {
        setCollectionList(data)
        dispatch(setList(data))
      } else {
        // todo erro hanlder
      }
    }
  }

  useEffect(() => {
    queryCollectionData()
  }, [])

  return (
    <Container p={0}>
      <Header
        name="Collections"
        onSuccess={() => {
          queryCollectionData()
        }}
      />
      <FavouritesList collectionList={collectionList} />
    </Container>
  )
}

export default () => {
  return (
    <Provider store={store}>
      <Page />
    </Provider>
  )
}
