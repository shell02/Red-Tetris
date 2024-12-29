import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useSocket } from '../providers/SocketProvider';
import { getOpenGamesAsync, joinGameAsync } from '../reducers/GameState';

function Join() {
  const socket = useSocket();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const username = useSelector((state) => state.user.username);
  const dispatch = useDispatch();

  const handleJoinGame = (gameId) => {
    const result = dispatch(joinGameAsync({ gameId, socket }));
    result.then((data) => {
      navigate(`/${data.payload.gameId}/${username}`);
    });
  };

  useEffect(() => {
    const result = dispatch(getOpenGamesAsync({ socket }));
    result.then((data) => {
      setGames(data.payload.openGames);
    });
  }, []);

  return (
    <div>
      <h1>Join</h1>
      <ul>
        {games && games.map((game) => (
          <button type="button" key={game.gameId} onClick={() => handleJoinGame(game.gameId)}>
            {game.gameId}
          </button>
        ))}
      </ul>
    </div>
  );
}

export default Join;
