let users = require('./users');
const io = require('./io');

exports.addUser = (userId, socket) => {
  const isUserExist = users.some((user) => user.userId === userId);

  if (!isUserExist) {
    users.push({ userId, socketId: socket.id });
  }
  io.emit('getUsers', users);
};

exports.removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

exports.getUser = (userId) => {
  const user = users.find((user) => user.userId === userId);
  return user;
};
