import http from './httpServer';
import config from './config.json';

export const userLogin = (data) => {
	return http.post(`${config.api}/auth/login`, data);
};

export const registerUser = (data) => {
  return http.post(`${config.api}/auth/register`, data);
};
