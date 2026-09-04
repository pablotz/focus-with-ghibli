import { createSlice } from "@reduxjs/toolkit";

export const STORAGE_KEY = 'focus-with-ghibli'

const loadSettings = () => {
    const fallback = {
        isActive: false,
        paused: false,
        minutes: 0,
        seconds: 0,
        selectedMinutes: 10,
        musicOn: true,
        volume: 0.3
    }
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
        if (saved && typeof saved === 'object') {
            return {
                ...fallback,
                selectedMinutes: typeof saved.selectedMinutes === 'number' && saved.selectedMinutes >= 10 && saved.selectedMinutes <= 60 && saved.selectedMinutes % 5 === 0 ? saved.selectedMinutes : fallback.selectedMinutes,
                musicOn: typeof saved.musicOn === 'boolean' ? saved.musicOn : fallback.musicOn,
                volume: typeof saved.volume === 'number' && saved.volume >= 0 && saved.volume <= 1 ? saved.volume : fallback.volume,
            }
        }
    } catch { /* ignore parse/storage errors */ }
    return fallback
}

const initialState = loadSettings()

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
    },
    setMusicOn: (state, action) => {
      state.musicOn = action.payload
    },
    setVolume: (state, action) => {
      state.volume = action.payload
    }
  }
})

export const { toggleActive, setPaused, setMinutes, setSeconds, setSelectedMinutes, setMusicOn, setVolume } = timerSlice.actions;
export default timerSlice.reducer;