import axios from 'axios';

export const loginCall = async (userData, dispatch) => {
	dispatch({ type: 'LOGIN_START' });
	try {
		const response = await axios.post('/auth/login', userData);
		dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
		localStorage.setItem('user', JSON.stringify(response.data))
	} catch (err) {
		dispatch({ type: 'LOGIN_FAILURE', payload: err });
		console.log(err)
	}
};
