import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const userState = {
  username: '',
  available: false,
  status: 'idle',
};

export const createNewPlayerAsync = createAsyncThunk(
  'user/createNewPlayer',
  async ({ username, socket }) => {
    socket.emit('createNewPlayer', { username });
    return new Promise((resolve, reject) => {
      socket.on('playerCreation', (payload) => {
        if (payload.available) {
          resolve({ available: true });
        } else {
          reject();
        }
      });
    });
  },
);

const UserSlice = createSlice({
  name: 'user',
  initialState: userState,
  reducers: {
    setUsername: (state, action) => {
      const newState = state;
      newState.username = action.payload;
      return newState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewPlayerAsync.fulfilled, (state, action) => {
        const newState = state;
        newState.available = action.payload.available;
        newState.status = 'fulfilled';
        return newState;
      })
      .addCase(createNewPlayerAsync.pending, (state) => {
        const newState = state;
        newState.status = 'pending';
        return newState;
      })
      .addCase(createNewPlayerAsync.rejected, (state) => {
        const newState = state;
        newState.available = false;
        newState.status = 'rejected';
        return newState;
      });
  },
});

export const { setUsername } = UserSlice.actions;

export default UserSlice.reducer;
