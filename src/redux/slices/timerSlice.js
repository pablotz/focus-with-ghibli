import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isActive: false,
  minutes: 0,
  seconds: 0,
  selectedMinutes: 25
}

export const timerSlice = createSlice ({
  name: 'timer',
  initialState,
  reducers: {
    toggleActive: (state) => {
      state.isActive = !state.isActive
    },
    setSelectedMinutes: (state, action) => {
      state.minutes = action.payload
    },
    setMinutes: (state, action) => {
      state.minutes = action.payload
    },
    setSeconds: (state, action) => {
      state.seconds = action.payload
    }
  }
})

export const { toggleActive, setMinutes, setSeconds, setSelectedMinutes } = timerSlice.actions;
export default timerSlice.reducer;