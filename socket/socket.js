const { addUser, removeUser, getUser } = require('./handleUsers');
const io = require('./io');
let users = require('./users');

exports.addUser = (userId, socket) => {
  addUser(userId, socket);
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

exports.disconnect = (socket) => {
  removeUser(socket.id);
  io.emit('getUsers', users);
};
