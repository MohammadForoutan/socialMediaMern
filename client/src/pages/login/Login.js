import './login.css';
import { useContext, useRef, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import {userLogin as login} from '../../servicesConfigure/auth'
import {
	Button,
	CircularProgress,
	Container,
	Divider,
	Grid,
	Snackbar,
	TextField
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Link, useHistory } from 'react-router-dom';

export default function Login() {
	const { isFetching, dispatch, error } = useContext(AuthContext);
	const emailRef = useRef();
	const passwordRef = useRef();
	const history = useHistory();
	const [loginError, setLoginError] = useState(error);

	const loginUser = async (userData, dispatch) => {
		dispatch({ type: 'LOGIN_START' });
		try {
			const {data} =  await login(userData)
			console.log(data)
			dispatch({ type: 'LOGIN_SUCCESS', payload: data.user });
			localStorage.setItem('user', JSON.stringify(data.user));
			localStorage.setItem('token', JSON.stringify(data.token));
			history.push('/');
		} catch (err) {
			// setLoginError(err.response.data);
			console.log(err)
			dispatch({ type: 'LOGIN_FAILURE', payload: err });
		}
	};

	const handleSubmitLoginForm = (e) => {
		e.preventDefault();
		const email = emailRef.current.value;
		const password = passwordRef.current.value;
		// validate
		const isUserDataValid = password.length >= 6;
		if (isUserDataValid) {
			loginUser({ email, password }, dispatch);
		}
	};

	const handleCloseLoginSnackbar = () => {
		setLoginError(null);
	};

	return (
		<div className="login">
			<Container>
				<Grid
					className="login__container"
					justify="center"
					spacing={3}
					container
				>
					<Grid item xs={12} sm={6}>
						<h3 className="login__logo">LOGO</h3>
						<span className="login__desc">
							Connect with friends and the world around you on
							LOGO.
						</span>
					</Grid>
					<Grid item xs={12} sm={6}>
						<form onSubmit={handleSubmitLoginForm}>
							<div className="login__input">
								<TextField
									label="Email"
									type="email"
									placeholder="Enter your email"
									InputLabelProps={{
										shrink: true
									}}
									variant="outlined"
									inputRef={emailRef}
									required={true}
								/>
							</div>
							<div className="login__input">
								<TextField
									label="Password"
									type="password"
									placeholder="Enter your password"
									InputLabelProps={{
										shrink: true
									}}
									variant="outlined"
									inputRef={passwordRef}
									required={true}
								/>
							</div>
							<Button
								type="submit"
								variant="contained"
								color="primary"
							>
								{isFetching ? (
									<CircularProgress
										size="30px"
										thickness={6}
										color="inherit"
									/>
								) : (
									'Log in'
								)}
							</Button>
							<br />
							<br />
							<Divider />
							<br />
							<Link to="/register">
								<Button variant="outlined" color="secondary">
									Register
								</Button>
							</Link>
							&nbsp;&nbsp;&nbsp;&nbsp;
							<span className="login__forgot">
								Forgot Password?
							</span>
						</form>
					</Grid>
				</Grid>

				<Snackbar
					autoHideDuration={4000}
					open={loginError}
					onClose={handleCloseLoginSnackbar}
					anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				>
					<Alert severity="error" variant="filled">
						{loginError}
					</Alert>
				</Snackbar>
			</Container>
		</div>
	);
}
