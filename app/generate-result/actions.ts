'use client'

import { useState } from 'react'
import { 
  fetchShoppingAdd, 
  fetchAddImages, 
  fetchCollectionsList 
} from "@lib/request/generate-result"

// 收藏夹操作的状态管理
export const useCollections = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [collections, setCollections] = useState<
    Array<{
      id: number
      name: string
      image_count: number
    }>
  >([])

  // 获取收藏夹列表
  const getCollections = async (userId: number) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetchCollectionsList({ user_id: userId })
      setCollections(response.data.collections)
    } catch (err) {
      setError(err instanceof Error ? err.message : "获取收藏夹失败")
    } finally {
      setLoading(false)
    }
  }

  // 添加图片到收藏夹
  const addToCollection = async (imageUrls: string[], collectionId: number) => {
    try {
      setLoading(true)
      setError(null)
      await fetchAddImages({
        image_urls: imageUrls,
        collection_id: collectionId
      })
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "添加图片失败")
      return false
    } finally {
      setLoading(false)
    }
  }

  // 添加到购物车
  const addToShopping = async (userId: number, imageUrls: string[], phone: string) => {
    try {
      setLoading(true)
      setError(null)
      await fetchShoppingAdd({
        user_id: userId,
        img_urls: imageUrls,
        phone
      })
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "添加购物信息失败")
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    collections,
    loading,
    error,
    getCollections,
    addToCollection,
    addToShopping
  }
}
