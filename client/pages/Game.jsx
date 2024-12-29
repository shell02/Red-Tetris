import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getGamePlayersAsync } from '../reducers/GameState';
import { useSocket } from '../providers/SocketProvider';

function Game() {
  const socket = useSocket();
  const { gameId, username } = useParams();
  const [players, setPlayers] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const result = dispatch(getGamePlayersAsync({ gameId, socket }));
    result.then((data) => {
      setPlayers(data.payload.players);
    });
  }, []);

  return (
    <div>
      <h1>
        Game
        {gameId}
      </h1>
      <h2>
        Username:
        {username}
      </h2>
      <ul>
        {players && players.map((player) => (
          <li key={player.id}>{player.username}</li>
        ))}
      </ul>
    </div>
  );
}

export default Game;
