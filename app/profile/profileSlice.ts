import { createSlice } from "@reduxjs/toolkit"

export const profileSlice = createSlice({
  name: "profileData",
  initialState: {
    value: {}
  },
  reducers: {
    setData: (state, action) => {
      state.value = action.payload
    }
  }
})

export const { setData } = profileSlice.actions

export default profileSlice.reducer
