const { createServer } = require('http');
const { Server } = require('socket.io');
const Client = require('socket.io-client');
const app = require('app'); // Adjust the path to your express app
const server = createServer(app);
const io = new Server(server);

describe('Socket.IO Events', () => {
  let clientSocket;

  beforeAll((done) => {
    server.listen(() => {
      const port = server.address().port;
      clientSocket = new Client(`http://localhost:${port}`);
      io.on('connection', (socket) => {
        // Initialize your event listeners here
      });
      clientSocket.on('connect', done);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
    server.close();
  });

  it('should add a todo', (done) => {
    const testTodo = { id: 2, text: 'Another Test Todo', isChecked: false };
    clientSocket.emit('addTodo', testTodo);
    clientSocket.on('addTodo', (todo) => {
      expect(todo).toEqual(testTodo);
      done();
    });
  });

  // Add more tests for each event you want to test
});
