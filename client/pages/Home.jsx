import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUsername, createNewPlayerAsync } from '../reducers/UserState';
import { useSocket } from '../providers/SocketProvider';

function Home() {
  const socket = useSocket();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { username, available, status } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleUsernameChange = (value) => {
    const regex = /^[a-zA-Z0-9_-]+$/;

    if (regex.test(value)) {
      setError('');
    } else {
      setError('Username can only contain letters, numbers, hyphens (-), and underscores (_)');
    }

    dispatch(setUsername(value));
  };

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    dispatch(createNewPlayerAsync({ username, socket }));
  };

  const handleNavigate = (path) => {
    if (!available) {
      setError('Please enter a valid username');
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
        { error && <span>{error}</span> }
      </p>
      <p>
        { status === 'fulfilled' && <span>Username available</span> }
        { status === 'pending' && <span>Checking...</span> }
        { status === 'rejected' && <span>Username already taken</span> }
      </p>
      <button type="button" onClick={() => handleNavigate('/create')}>Create a game</button>
      <button type="button" onClick={() => handleNavigate('/join')}>Join a game</button>

    </div>
  );
}

export default Home;
