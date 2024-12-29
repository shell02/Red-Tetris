import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSocket } from '../src/SocketContext';
import { getOpenGamesAsync } from '../reducers/GameState';

function Join() {
  const socket = useSocket();
  const [games, setGames] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const result = dispatch(getOpenGamesAsync({ socket }));
    result.then((data) => {
      console.log('Open games:', data.payload);
      setGames(data.payload.openGames);
    });
  }, []);

  return (
    <div>
      <h1>Join</h1>
      <ul>
        {games.map((game) => (
          <li key={game.gameId}>
            {game.gameId}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Join;
