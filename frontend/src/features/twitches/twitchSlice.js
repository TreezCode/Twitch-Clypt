import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import twitchService from './twitchService';

const initialState = {
  twitches: [],
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

export const twitchSlice = createSlice({
  name: 'twitch',
  initialState,
  reducers: {
    reset: (state) => initialState,
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
      })
      .addCase(saveTwitch.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
    //   .addCase(deleteTwitch.pending, (state) => {
    //     state.isLoading = true
    //   })
    //   .addCase(deleteTwitch.fulfilled, (state, action) => {
    //     state.isLoading = false
    //     state.isSuccess = true
    //     // filter to remove deleted twitch from UI
    //     state.twitches = state.twitches.filter(
    //       (twitch) => twitch._id !== action.payload.id
    //     )
    //   })
    //   .addCase(deleteTwitch.rejected, (state, action) => {
    //     state.isLoading = false
    //     state.isError = true
    //     state.message = action.payload
    //   })
  },
});

export const { reset } = twitchSlice.actions;
export default twitchSlice.reducer;
