import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import twitchReducer from '../features/twitches/twitchSlice';
import clipReducer from '../features/clips/clipSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    twitches: twitchReducer,
    clips: clipReducer,
  },
});
