import { createSlice } from "@reduxjs/toolkit";

export const STORAGE_KEY = 'focus-with-ghibli'

const loadSelectedMinutes = () => {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
        if (saved && typeof saved.selectedMinutes === 'number' && saved.selectedMinutes >= 10 && saved.selectedMinutes <= 60 && saved.selectedMinutes % 5 === 0) {
            return saved.selectedMinutes
        }
    } catch { /* ignore parse/storage errors */ }
    return 10
}

const initialState = {
  isActive: false,
  paused: false,
  minutes: 0,
  seconds: 0,
  selectedMinutes: loadSelectedMinutes()
}

export const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    toggleActive: (state) => {
      state.isActive = !state.isActive
    },
    setPaused: (state, action) => {
      state.paused = action.payload
    },
    setSelectedMinutes: (state, action) => {
      state.selectedMinutes = action.payload
    },
    setMinutes: (state, action) => {
      state.minutes = action.payload
    },
    setSeconds: (state, action) => {
      state.seconds = action.payload
    }
  }
})

export const { toggleActive, setPaused, setMinutes, setSeconds, setSelectedMinutes } = timerSlice.actions;
export default timerSlice.reducer;