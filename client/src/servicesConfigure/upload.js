import http from './httpServer';
import config from './config.json';

export const uploadImage = (data) => {
	return http.post(`${config.api}/upload`, data);
};
