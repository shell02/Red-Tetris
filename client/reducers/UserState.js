import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const userState = {
  username: '',
  isUsernameAvailable: false,
};

export const checkUsernameAsync = createAsyncThunk(
  'user/checkUsername',
  async (username, socket) => {
    socket.emit('checkUsername', { username });
    return new Promise((resolve, reject) => {
      socket.on('usernameChecked', (isAvailable) => {
        if (isAvailable) {
          resolve({ available: true });
        } else {
          resolve({ available: false });
        }
      });

      socket.on('error', (err) => {
        reject(err);
      });
    });
  },
);

export const createNewPlayerAsync = createAsyncThunk(
  'user/createNewPlayer',
  async (username, socket) => {
    socket.emit('createNewPlayer', { username });
    return new Promise((resolve, reject) => {
      socket.on('playerCreated', (player) => {
        resolve(player);
      });

      socket.on('error', (err) => {
        reject(err);
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
      .addCase(checkUsernameAsync.fulfilled, (state, action) => {
        const newState = state;
        newState.isUsernameAvailable = action.payload.available;
        return newState;
      })
      .addCase(checkUsernameAsync.rejected, (state) => {
        const newState = state;
        newState.isUsernameAvailable = false;
        return newState;
      });
  },
});

export const { setUsername } = UserSlice.actions;

export default UserSlice.reducer;
