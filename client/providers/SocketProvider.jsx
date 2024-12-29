import React, {
  createContext, useEffect, useState, useContext,
} from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import io from 'socket.io-client';

const socket = io.connect('http://localhost:3031');

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

function SocketProvider({ children }) {
  const [socketInstance, setSocketInstance] = useState(null);

  useEffect(() => {
    setSocketInstance(socket);
  }, []);

  return (
    <SocketContext.Provider value={socketInstance}>
      {children}
    </SocketContext.Provider>
  );
}

export { SocketProvider };
