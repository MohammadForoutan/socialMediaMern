import http from './httpServer';
import config from './config.json';

export const sharePost = (data) => {
	return http.post(`${config.api}/posts`, data);
};

export const timelinePosts = () => {
	return http.get(`${config.api}/posts/timeline`);
};

export const profilePosts = (username) => {
	return http.get(`${config.api}/posts/profile/${username}`);
};

export const toggleLike = (post) => {
	return http.put(`${config.api}/posts/${post._id}/like`);
}

export const deletePost = (post) => {
	return http.delete(`${config.api}/posts/${post._id}`);
}