import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUsername, createNewPlayerAsync } from '../reducers/UserState';
import { useSocket } from '../src/SocketContext';

function Home() {
  const socket = useSocket();
  const navigate = useNavigate();
  const username = useSelector((state) => state.user.username);
  const isUsernameAvailable = useSelector((state) => state.user.isUsernameAvailable);
  const dispatch = useDispatch();

  const handleUsernameChange = (value) => {
    dispatch(setUsername(value));
  };

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    dispatch(createNewPlayerAsync({ username, socket }));
  };

  const handleNavigate = (path) => {
    if (!isUsernameAvailable) {
      return;
    }
    navigate(path);
  };

  return (
    <div>
      <h1>Welcome to Red Tetris</h1>
      <h2>Enter your Username</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => handleUsernameChange(e.target.value)}
      />
      <button type="button" onClick={(e) => handleUsernameSubmit(e)}>Submit</button>
      <p>
        Username:
        {username}
      </p>
      <p>
        {isUsernameAvailable ? 'Username is available' : 'Username is not available'}
      </p>
      <button type="button" onClick={() => handleNavigate('/create')}>Create a game</button>
      <button type="button" onClick={() => handleNavigate('/join')}>Join a game</button>

    </div>
  );
}

export default Home;
