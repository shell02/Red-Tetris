import { combineReducers } from 'redux';
import userReducer from './UserState';
import gameReducer from './GameState';

const rootReducer = combineReducers({
  user: userReducer,
  game: gameReducer,
});

export default rootReducer;
