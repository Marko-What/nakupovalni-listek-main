import React from 'react';
import Main from './components/Main';
import { io, Socket } from 'socket.io-client';


interface AppProps {
  // 
}

const App: React.FC<AppProps> = () => {
  const socket: Socket = io("http://localhost:4000");
  return (
    <div className="App">
      <Main socket={socket} />
    </div>
  );
}

export default App;
