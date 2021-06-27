const io = require('socket.io')(8900, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

const {
  addUserSocket,
  sendMessageSocket,
  disconnectSocket,
} = require('./socket');

io.on('connection', (socket) => {
  // Take UserId and SocketId
  socket.on('addUser', addUserSocket);

  // Send and Get message
  socket.on('sendMessage', sendMessageSocket);

  // Disconnection
  socket.on('disconnect', disconnectSocket);
});
