import { combineReducers } from 'redux';
import userReducer from './UserState';

const rootReducer = combineReducers({
  user: userReducer,
});

export default rootReducer;
