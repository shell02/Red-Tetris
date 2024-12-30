import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getGamePlayersAsync, setPlayers, leaveGameAsync } from '../reducers/GameState';
import { useSocket } from '../providers/SocketProvider';

function Game() {
  const socket = useSocket();
  const navigate = useNavigate();
  const { gameId, username } = useParams();
  const [opponents, setOpponents] = useState([]);
  const dispatch = useDispatch();

  const handleLeaveGame = () => {
    dispatch(leaveGameAsync({ gameId, socket }));
    navigate('/');
  };

  useEffect(() => {
    dispatch(getGamePlayersAsync({ gameId, socket }));

    socket.on('gamePlayers', (payload) => {
      dispatch(setPlayers(payload.players));
      setOpponents(payload.players.filter((player) => player.username !== username));
    });
  }, [socket]);

  return (
    <div>
      <h1>
        Game:
        {gameId}
      </h1>
      <h2>
        Username:
        {username}
      </h2>
      <ul>
        {opponents && opponents.map((player) => (
          <li key={player.username}>{player.username}</li>
        ))}
      </ul>
      <button type="button" onClick={handleLeaveGame}>Leave Game</button>
    </div>
  );
}

export default Game;
