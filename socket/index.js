const io = require('socket.io')(8900, {
	cors: {
		origin: 'http://localhost:3000'
	}
});

let users = [];

const addUser = (userId, socketId) => {
  console.log('enter add user')
	const isUserExist = users.some((user) => user.userId === userId);
  
	if (!isUserExist) {
    users.push({ userId, socketId });
    console.log({ userId, socketId } + " added")
	}

};

const removeUser = (socketId) => {
	users = users.filter((user) => user.socketId !== socketId);
  console.log(users)
};

const getUser = (userId) => {
	const user = users.find((user) => user.userId === userId);;
  return user
};

io.on('connection', (socket) => {
	// Connection

	// Take UserId and SocketId
	socket.on('addUser', (userId) => {
		addUser(userId, socket.id);
		io.emit('getUsers', users);
    console.log(users)
	});

	// Send and Get message
	socket.on('sendMessage', ({ senderId, receiverId, text }) => {
		const user = getUser(receiverId);
    if(user) {
			console.log({ senderId, receiverId, text, user })
      io.to(user.socketId).emit('getMessage', {
        senderId,
        text
      });
    }
	});

	// Disconnection
	socket.on('disconnect', () => {
		console.log('a user disconnected');
		removeUser(socket.id);
		io.emit('getUsers', users);
	});
});
