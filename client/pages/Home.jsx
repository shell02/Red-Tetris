import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUsername, checkUsernameAsync, createNewPlayerAsync } from '../reducers/UserState';
import { useSocket } from '../src/SocketContext';

function Home() {
  const socket = useSocket();
  const navigate = useNavigate();
  const username = useSelector((state) => state.user.username);
  const isUsernameAvailable = useSelector((state) => state.user.isUsernameAvailable);
  const dispatch = useDispatch();

  const handleUsernameChange = (e) => {
    dispatch(setUsername(e.target.value));
    dispatch(checkUsernameAsync(e.target.value, socket));
  };

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (!isUsernameAvailable) {
      return;
    }
    dispatch(createNewPlayerAsync(username, socket));
  };

  const handleCreateGame = () => {
    if (!isUsernameAvailable) {
      return;
    }
    navigate('/create');
  };

  const handleJoinGame = () => {
    if (!isUsernameAvailable) {
      return;
    }
    navigate('/join');
  };

  return (
    <div>
      <h1>Welcome to Red Tetris</h1>
      <h2>Enter your Username</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => dispatch(handleUsernameChange(e.target.value))}
      />
      <button type="button" onClick={handleUsernameSubmit}>Submit</button>
      <p>
        Username:
        {username}
      </p>
      <p>
        {isUsernameAvailable ? 'Username is available' : 'Username is not available'}
      </p>
      <button type="button" onClick={handleCreateGame}>Create a game</button>
      <button type="button" onClick={handleJoinGame}>Join a game</button>

    </div>
  );
}

export default Home;
