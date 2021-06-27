export const users = [];
exports.addUser = (userId, socketId) => {
  const isUserExist = users.some((user) => user.userId === userId);

  if (!isUserExist) {
    users.push({ userId, socketId });
  }
};

exports.removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
  console.log(users);
};

exports.getUser = (userId) => {
  const user = users.find((user) => user.userId === userId);
  return user;
};
