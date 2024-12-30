import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useSocket } from '../providers/SocketProvider';
import { getOpenGamesAsync, joinGameAsync, setOpenGames } from '../reducers/GameState';

function Join() {
  const socket = useSocket();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const { gameId, gameJoined } = useSelector((state) => state.game);
  const username = useSelector((state) => state.user.username);
  const dispatch = useDispatch();

  const handleJoinGame = (selectedGameId) => {
    dispatch(joinGameAsync({ selectedGameId, socket }));
  };

  useEffect(() => {
    dispatch(getOpenGamesAsync({ socket }));

    if (gameJoined) {
      navigate(`/${gameId}/${username}`);
    }

    socket.on('openGames', (payload) => {
      dispatch(setOpenGames(payload.openGames));
      setGames(payload.openGames);
    });
  }, [socket, gameJoined]);

  return (
    <div>
      <h1>Join</h1>
      <ul>
        {games && games.map((game) => (
          <button type="button" key={game.gameId} onClick={() => handleJoinGame(game.gameId)}>
            {game.leader}
          </button>
        ))}
      </ul>
    </div>
  );
}

export default Join;
