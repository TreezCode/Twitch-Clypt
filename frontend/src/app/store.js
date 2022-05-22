import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import twitchReducer from '../features/twitches/twitchSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    twitches: twitchReducer,
  },
});
