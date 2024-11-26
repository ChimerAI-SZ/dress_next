import { configureStore } from "@reduxjs/toolkit"
import collectionsReducer from "./slices/collectionsSlice"
import type { RootState } from "./types"

export const store = configureStore({
  reducer: {
    collections: collectionsReducer
  }
})

export type AppDispatch = typeof store.dispatch
