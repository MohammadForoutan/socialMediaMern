import http from './httpServer';
import config from './config.json';

export const sendMessage = (message) => {
	return http.post(`${config.api}/messages/`, message);
};

export const getConversationMessages = (conversation) => {
	return http.get(`${config.api}/messages/${conversation._id}`);
};

