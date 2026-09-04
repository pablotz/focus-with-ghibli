import { configureStore } from '@reduxjs/toolkit'
import timerSlice, { STORAGE_KEY } from './slices/timerSlice'

export const store = configureStore({
  reducer: {
    timer: timerSlice
  },
})

let lastSaved
store.subscribe(() => {
    const { selectedMinutes, musicOn, volume } = store.getState().timer
    const current = JSON.stringify({ selectedMinutes, musicOn, volume })
    if (current !== lastSaved) {
        lastSaved = current
        try {
            localStorage.setItem(STORAGE_KEY, current)
        } catch { /* ignore storage errors */ }
    }
})