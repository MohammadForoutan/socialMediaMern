import http from './httpServer';
import config from './config.json';

export const findOrCreateConversation = (senderId, receiverId) => {
	return http.post(`${config.api}/conversations/`, {
		senderId,
		receiverId
	});
};

export const getUserConversations = (user) => {
  return http.get(`${config.api}/conversations/${user._id}`)
}