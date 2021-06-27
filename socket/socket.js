const { addUser, removeUser, getUser, users } = require('./handleUsers');

exports.addUser = (userId) => {
  addUser(userId, socket.id);
  io.emit('getUsers', users);
};

exports.sendMessage = ({ senderId, receiverId, text }) => {
  const user = getUser(receiverId);
  if (user) {
    io.to(user.socketId).emit('getMessage', {
      senderId,
      text,
    });
  }
};

exports.disconnect = () => {
  removeUser(socket.id);
  io.emit('getUsers', users);
};
