import './login.css';
import { useContext, useRef } from 'react';
import { loginCall } from '../../apiCalls';
import { AuthContext } from '../../context/AuthContext';
import { CircularProgress } from '@material-ui/core';
import { Link } from 'react-router-dom';

export default function Login() {
	const emailRef = useRef();
	const passwordRef = useRef();

	const { user, isFetching, error, dispatch } = useContext(AuthContext);

	const handleSubmitLoginForm = (e) => {
		e.preventDefault();
		const email = emailRef.current.value;
		const password = passwordRef.current.value;
		loginCall({ email, password }, dispatch);
	};

	return (
		<div className="login">
			<div className="login__container">
				<div className="login__left">
					<h3 className="login__logo">LOGO</h3>
					<span className="login__desc">
						Connect with friends and the world around you on LOGO.
					</span>
				</div>
				<div className="login__right">
					<form
						className="login__box"
						onSubmit={handleSubmitLoginForm}
					>
						<input
							ref={emailRef}
							placeholder="Email"
							type="email"
							className="login__input"
							required={true}
						/>
						<input
							ref={passwordRef}
							placeholder="Password"
							type="password"
							className="login__input"
							required={true}
							minLength={6}
						/>
						<button className="login__btn">
							{isFetching ? (
								<CircularProgress
									size="30px"
									thickness={6}
									color="inherit"
								/>
							) : (
								'Log in'
							)}
						</button>
						<span className="login__forgot">Forgot Password?</span>
						<Link to="/register" className="login__register-btn">
							Create a New Account
						</Link>
					</form>
				</div>
			</div>
		</div>
	);
}
