import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useSocket } from '../src/SocketContext';

function Socket() {
  const socket = useSocket();
  const username = useSelector((state) => state.user.username);

  useEffect(() => {
    if (socket) {
      socket.emit('join', { username });
    }
  }, [socket]);

  return (
    <div>
      <Outlet />
    </div>
  );
}

export default Socket;
