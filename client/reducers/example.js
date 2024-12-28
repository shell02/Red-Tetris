import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchAsyncValue = createAsyncThunk(
  'example/fetchAsyncValue',
  async () => {
    const response = await fetch('https://catfact.ninja/fact');
    const data = await response.json();
    return data.fact; // Return the response value
  },
);

const exampleSlice = createSlice({
  name: 'example',
  initialState: {
    status: 'idle',
    data: [],
  },
  reducers: {
    deleteData: (state) => ({
      ...state,
      data: [],
    }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAsyncValue.pending, (state) => ({
        ...state,
        status: 'loading',
      }))
      .addCase(fetchAsyncValue.fulfilled, (state, action) => ({
        ...state,
        status: 'success',
        data: action.payload,
      }))
      .addCase(fetchAsyncValue.rejected, (state) => ({
        ...state,
        status: 'failed',
      }));
  },
});

export const { deleteData } = exampleSlice.actions;

export default exampleSlice.reducer;
