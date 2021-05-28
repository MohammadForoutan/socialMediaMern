const AuthReducer = (state, action) => {
	switch (action.type) {
		case 'LOGIN_START':
			return {
				user: null,
				isFetching: true,
				error: false
			};
		case 'LOGIN_SUCCESS':
			return {
				user: action.payload,
				isFetching: false,
				error: false
			};
		case 'LOGIN_FAILURE':
			return {
				user: null,
				isFetching: false,
				error: action.payload
			};
		case 'LOGOUT':
			return {
				...state,
				user: null
			};

		case 'UPDATEUSER':
			return {
				...state,
				user: {...state.user, ...action.payload}
			};
		case 'FOLLOW':
			return {
				...state,
				user: {
					...state.user,
					followings: [...state.user.followings, action.payload]
				}
			};
		case 'FOLLOW':
			return {
				...state,
				user: {
					...state.user,
					followings: state.user.followings.filter(
						(followingId) => followingId !== action.payload
					)
				}
			};

		default:
			return state;
	}
};

export { AuthReducer as default };
