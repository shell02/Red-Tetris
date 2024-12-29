import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useSocket } from '../providers/SocketProvider';

function Socket() {
  const navigate = useNavigate();
  const socket = useSocket();
  const username = useSelector((state) => state.user.username);

  useEffect(() => {
    if (socket) {
      socket.emit('join', { username });

      socket.on('backHome', () => {
        navigate('/');
      });
    }
  }, [socket]);

  return (
    <div>
      <Outlet />
    </div>
  );
}

export default Socket;
