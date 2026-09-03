import { configureStore } from '@reduxjs/toolkit'
import timerSlice, { STORAGE_KEY } from './slices/timerSlice'

export const store = configureStore({
  reducer: {
    timer: timerSlice
  },
})

let lastSavedMinutes
store.subscribe(() => {
    const { selectedMinutes } = store.getState().timer
    if (selectedMinutes !== lastSavedMinutes) {
        lastSavedMinutes = selectedMinutes
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ selectedMinutes }))
        } catch { /* ignore storage errors */ }
    }
})