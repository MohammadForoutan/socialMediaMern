import axios from 'axios';

axios.defaults.headers.common['Content-Type'] = 'application/json';
// token
const token = JSON.parse(localStorage.getItem('token'));
axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

axios.interceptors.response.use(null, (err) => {
	const expectedError =
		err.response && err.response.status >= 400 && err.response.status < 500;

	if (!expectedError) {
		alert('server error');
	}
});

const http = {
	get: axios.get,
	post: axios.post,
	put: axios.put,
	delete: axios.delete
};
export default http;
