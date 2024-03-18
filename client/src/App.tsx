import React from 'react';
import Main from './components/Main';
//import { Socket } from 'socket.io-client'; // Assuming you're using socket.io-client
import { io, Socket } from 'socket.io-client';


interface AppProps {
  // Define props here if any, for example:
}

const App: React.FC<AppProps> = () => {
  // If you're passing the socket to Main, ensure you've established its connection correctly
 // const socket: Socket = /* your socket connection logic here, typed as Socket from socket.io-client */;
  const socket: Socket = io("http://localhost:4000");
  return (
    <div className="App">
      <Main socket={socket} />
    </div>
  );
}

export default App;
