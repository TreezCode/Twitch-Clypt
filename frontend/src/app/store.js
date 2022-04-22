import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import clipReducer from '../features/clips/clipSlice'
import gameReducer from '../features/games/gameSlice'
import twitchReducer from '../features/twitches/twitchSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    clips: clipReducer,
    games: gameReducer,
    twitches: twitchReducer,
  },
})