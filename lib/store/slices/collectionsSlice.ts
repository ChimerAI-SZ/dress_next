import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import {
  fetchShoppingAdd,
  fetchAddImages,
  fetchCollectionsList,
  ShoppingAdd,
  AddImages,
  CollectionsList
} from "../../request/generate-result"
import type { RootState, CollectionsState } from "../types"

const initialState: CollectionsState = {
  collections: [],
  loading: false,
  error: null
}

// 创建异步 action
export const addShopping = createAsyncThunk("collections/addShopping", async (params: ShoppingAdd) => {
  const response = await fetchShoppingAdd(params)
  return response.data
})

export const addImages = createAsyncThunk("collections/addImages", async (params: AddImages) => {
  const response = await fetchAddImages(params)
  return response.data
})

export const getCollectionsList = createAsyncThunk("collections/getList", async (params: CollectionsList) => {
  const response = await fetchCollectionsList(params)
  return response.data
})

// 创建 slice
const collectionsSlice = createSlice({
  name: "collections",
  initialState,
  reducers: {
    clearError: state => {
      state.error = null
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getCollectionsList.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(getCollectionsList.fulfilled, (state, action) => {
        state.loading = false
        state.collections = action.payload.collections
      })
      .addCase(getCollectionsList.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "获取收藏夹列表失败"
      })
  }
})

export const { clearError } = collectionsSlice.actions

// 导出 selectors
export const selectCollections = (state: RootState) => state.collections.collections
export const selectCollectionsLoading = (state: RootState) => state.collections.loading
export const selectCollectionsError = (state: RootState) => state.collections.error

export default collectionsSlice.reducer
