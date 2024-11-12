import { configureStore } from "@reduxjs/toolkit"
import counterReducer from "./profileSlice"

export const store = configureStore({
  reducer: {
    profileData: counterReducer
  }
})
