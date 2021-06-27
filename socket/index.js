const io = require('./io');

const { addUser, sendMessage, disconnect } = require('./socket');

io.on('connection', (socket) => {
  // Take UserId and SocketId
  socket.on('addUser', (userId) => addUser(userId, socket));

  // Send and Get message
  socket.on('sendMessage', (message) => sendMessage(message));

  // Disconnection
  socket.on('disconnect', () => disconnect(socket));
});
