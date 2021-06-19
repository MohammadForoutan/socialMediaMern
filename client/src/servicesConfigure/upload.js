import http from './httpServer';
import config from './config.json';

export const uploadImage = (data) => {
	return http.post(`${config.api}/upload`, data);
};

export const uploadAvatar = (data) => {
	return http.post(`${config.api}/upload/avatar`, data);
};

export const uploadCover = (data) => {
	return http.post(`${config.api}/upload/cover`, data);
};