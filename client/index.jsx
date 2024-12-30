import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import { thunk } from 'redux-thunk';
import App from './App';
import rootReducer from './reducers';

const logger = createLogger({
  collapsed: true,
});

const initialState = JSON.parse(sessionStorage.getItem('state')) || undefined;

const store = configureStore({
  reducer: rootReducer,
  preloadedState: initialState,
  middleware: (getDefaultMiddleware) => (process.env.NODE_ENV !== 'production'
    ? getDefaultMiddleware().concat(logger, thunk) // Use logger and thunk in dev mode
    : getDefaultMiddleware().concat(thunk)), // Only thunk in production
  devTools: process.env.NODE_ENV !== 'production',
});

store.subscribe(() => {
  const state = store.getState();
  sessionStorage.setItem('state', JSON.stringify({ user: state.user }));
});

// Render the App component
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
