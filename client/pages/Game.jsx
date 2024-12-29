import React from 'react';
import { useParams } from 'react-router-dom';
// import { useSocket } from '../src/SocketContext';

function Game() {
  const { gameId, username } = useParams();
  // const socket = useSocket();

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
    </div>
  );
}

export default Game;
