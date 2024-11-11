import { configureStore } from "@reduxjs/toolkit"
import counterReducer from "./collectionSlice"

export const store = configureStore({
  reducer: {
    collectionList: counterReducer
  }
})
