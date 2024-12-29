import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../src/SocketContext';
import { createNewGameAsync } from '../reducers/GameState';

function Create() {
  const socket = useSocket();
  const username = useSelector((state) => state.user.username);
  const gameId = useSelector((state) => state.game.gameId);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (gameId) return;
    const result = dispatch(createNewGameAsync({ socket }));
    result.then((data) => {
      navigate(`/${data.payload.gameId}/${username}`);
    });
  }, []);

  return (
    <div>
      <h1>Creating Game...</h1>
    </div>
  );
}

export default Create;
