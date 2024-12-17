"use client"
import { useEffect, useState } from "react"
import { Container } from "@chakra-ui/react"
import { useDispatch } from "react-redux"
import { Loading } from "@components/Loading"

// 引用组件
import Header from "./components/Header"
import AlbumList from "./components/AlbumList"
import { Alert } from "@components/Alert"

import { AlbumItem } from "@definitions/album"
import { setList } from "../../store/features/collectionSlice"
import { storage } from "@utils/index"
import { errorCaptureRes } from "@utils/index"

// 接口 - 收藏夹列表
import { queryAlbumList } from "@lib/request/album"

function Page() {
  const [loading, setLoading] = useState(true)
  const [albumList, setAlbumList] = useState<AlbumItem[]>([])
  const dispatch = useDispatch()

  const queryAlbumData = async () => {
    try {
      setLoading(true)
      const user_id = storage.get("user_id")

      if (user_id) {
        const [err, res] = await errorCaptureRes(queryAlbumList, { user_id: +user_id as number })

        if (err || (res && !res?.success)) {
          Alert.open({
            content: err.message ?? res.message
          })
        } else {
          setAlbumList(
            res?.data?.sort((a: AlbumItem, b: AlbumItem) => {
              if (a.is_default && !b.is_default) return -1
              if (!a.is_default && b.is_default) return 1
              if (a.title === "Likes" && b.title !== "Likes") return -1
              if (a.title !== "Likes" && b.title === "Likes") return 1
              return 0
            })
          )
          dispatch(setList(res?.data))
        }
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    queryAlbumData()
  }, [])

  return (
    <Container p={0}>
      {loading && <Loading />}
      <Header
        name="Albums"
        onSuccess={() => {
          queryAlbumData()
        }}
      />
      <AlbumList albumList={albumList} />
    </Container>
  )
}

export default () => {
  return <Page />
}
