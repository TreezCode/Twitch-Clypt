import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import twitchService from './twitchService';

const initialState = {
  twitches: [],
  saved: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Get Twitch profiles
export const getTwitch = createAsyncThunk(
  'twitches/get',
  async (twitchData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await twitchService.getTwitch(twitchData, token);
    } catch (error) {
      console.log(error);
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// Save Twitch profile
export const saveTwitch = createAsyncThunk(
  'twitches/save',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await twitchService.saveTwitch(id, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// Save Twitch profile
export const unsaveTwitch = createAsyncThunk(
  'twitches/unsave',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await twitchService.unsaveTwitch(id, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const twitchSlice = createSlice({
  name: 'twitch',
  initialState,
  reducers: {
    twitchReset: (state) => initialState,
    favoriteReset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTwitch.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTwitch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.twitches = action.payload;
      })
      .addCase(getTwitch.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(saveTwitch.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(saveTwitch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.saved = action.payload;
      })
      .addCase(saveTwitch.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(unsaveTwitch.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(unsaveTwitch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.saved = action.payload;
        // filter to remove unsaved twitch from UI
        // state.saved = state.saved.filter(
          //   (twitch) => twitch._id !== action.payload.twitches._id,
          // );
      })
      .addCase(unsaveTwitch.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { twitchReset, favoriteReset } = twitchSlice.actions;
export default twitchSlice.reducer;
