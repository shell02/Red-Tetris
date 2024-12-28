import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const userState = {
  username: '',
  isUsernameAvailable: false,
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
        newState.isUsernameAvailable = action.payload.available;
        return newState;
      })
      .addCase(createNewPlayerAsync.rejected, (state) => {
        const newState = state;
        newState.isUsernameAvailable = false;
        return newState;
      });
  },
});

export const { setUsername } = UserSlice.actions;

export default UserSlice.reducer;
