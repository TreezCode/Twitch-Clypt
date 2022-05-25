import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import clipService from './clipService';

const initialState = {
  clips: [],
  saved: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Get Twitch profiles
export const getClip = createAsyncThunk(
  'clips/get',
  async (clipData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await clipService.getClip(clipData, token);
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
export const saveClip = createAsyncThunk(
  'clips/save',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await clipService.saveClip(id, token);
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
export const unsaveClip = createAsyncThunk(
  'clips/unsave',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await clipService.unsaveClip(id, token);
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

// Get saved Twitch profiles
export const getSavedClips = createAsyncThunk(
  'clips/getSaved',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await clipService.getSavedClips(token);
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

export const clipSlice = createSlice({
  name: 'clip',
  initialState,
  reducers: {
    clipReset: (state) => initialState,
    favoriteReset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getClip.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getClip.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.clips = action.payload;
      })
      .addCase(getClip.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(saveClip.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(saveClip.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.saved = action.payload;
      })
      .addCase(saveClip.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(unsaveClip.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(unsaveClip.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.saved = action.payload;
      })
      .addCase(unsaveClip.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getSavedClips.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSavedClips.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.clips = action.payload;
      })
      .addCase(getSavedClips.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
  },
});

export const { clipReset, favoriteReset } = clipSlice.actions;
export default clipSlice.reducer;
