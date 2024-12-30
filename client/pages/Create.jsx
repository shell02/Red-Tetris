import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../providers/SocketProvider';
import { createNewGameAsync } from '../reducers/GameState';

function Create() {
  const socket = useSocket();
  const username = useSelector((state) => state.user.username);
  const { gameId, gameJoined } = useSelector((state) => state.game);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(createNewGameAsync({ socket }));
    if (gameJoined) {
      navigate(`/${gameId}/${username}`);
    }
  }, [gameId, gameJoined]);

  return (
    <div>
      <h1>Creating Game...</h1>
    </div>
  );
}

export default Create;
