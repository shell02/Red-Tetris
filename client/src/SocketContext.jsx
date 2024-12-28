import {
  createContext, useEffect, useState, useContext,
} from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import io from 'socket.io-client';

const socket = io.connect('http://localhost:3001');

const SocketContext = createContext();

const useSocket = () => useContext(SocketContext);

function SocketProvider({ children }) {
  const [socketInstance, setSocketInstance] = useState(null);

  useEffect(() => {
    setSocketInstance(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socketInstance}>
      {children}
    </SocketContext.Provider>
  );
}

export { SocketProvider, useSocket };
