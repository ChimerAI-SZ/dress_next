import { configureStore, combineReducers } from "@reduxjs/toolkit"
import work from "./features/workSlice"

const rootReducer = combineReducers({
  work: work
  //add all your reducers here
})

// 定义 Store 的类型
export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
