import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const gameState = {
  gameId: 0,
  gameCreated: false,
};

export const createNewGameAsync = createAsyncThunk(
  'user/createNewGame',
  async ({ socket }) => {
    socket.emit('newGame');
    return new Promise((resolve) => {
      socket.on('gameCreated', (payload) => {
        resolve(payload);
      });
    });
  },
);

export const getOpenGamesAsync = createAsyncThunk(
  'user/getOpenGames',
  async ({ socket }) => {
    socket.emit('getOpenGames');
    return new Promise((resolve) => {
      socket.on('openGames', (payload) => {
        resolve(payload.openGames);
      });
    });
  },
);

export const joinGameAsync = createAsyncThunk(
  'user/joinGame',
  async ({ gameId, socket }) => {
    socket.emit('joinGame', { gameId });
    return new Promise((resolve) => {
      socket.on('gameJoined', (payload) => {
        resolve(payload);
      });
    });
  },
);

const GameSlice = createSlice({
  name: 'game',
  initialState: gameState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createNewGameAsync.fulfilled, (state, action) => {
        const newState = state;
        newState.gameId = action.payload.gameId;
        newState.gameCreated = true;
        return newState;
      });
  },
});

export default GameSlice.reducer;
