import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const gameState = {
  gameId: '',
  gameJoined: false,
  players: [],
  openGames: [],
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
        resolve(payload);
      });
    });
  },
);

export const joinGameAsync = createAsyncThunk(
  'user/joinGame',
  async ({ selectedGameId, socket }) => {
    socket.emit('joinGame', { selectedGameId });
    return new Promise((resolve) => {
      socket.on('gameJoined', (payload) => {
        resolve(payload);
      });
    });
  },
);

export const getGamePlayersAsync = createAsyncThunk(
  'user/getGamePlayers',
  async ({ gameId, socket }) => {
    socket.emit('getGamePlayers', { gameId });
    return new Promise((resolve) => {
      socket.on('gamePlayers', (payload) => {
        resolve(payload);
      });
    });
  },
);

export const leaveGameAsync = createAsyncThunk(
  'user/leaveGame',
  async ({ gameId, socket }) => {
    socket.emit('leaveGame', { gameId });
    return new Promise((resolve) => {
      socket.on('gameLeft', (payload) => {
        resolve(payload);
      });
    });
  },
);

const GameSlice = createSlice({
  name: 'game',
  initialState: gameState,
  reducers: {
    setOpenGames: (state, action) => {
      const newState = state;
      newState.openGames = action.payload.openGames;
      return newState;
    },
    setPlayers: (state, action) => {
      const newState = state;
      newState.players = action.payload.players;
      return newState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewGameAsync.fulfilled, (state, action) => {
        const newState = state;
        newState.gameId = action.payload.gameId;
        newState.gameJoined = true;
        return newState;
      })
      .addCase(getGamePlayersAsync.fulfilled, (state, action) => {
        const newState = state;
        newState.players = action.payload.players;
        return newState;
      })
      .addCase(joinGameAsync.fulfilled, (state, action) => {
        const newState = state;
        newState.gameId = action.payload.gameId;
        newState.gameJoined = true;
        return newState;
      })
      .addCase(getOpenGamesAsync.fulfilled, (state, action) => {
        const newState = state;
        newState.openGames = action.payload.openGames;
        return newState;
      });
  },
});

export const { setOpenGames, setPlayers } = GameSlice.actions;

export default GameSlice.reducer;
