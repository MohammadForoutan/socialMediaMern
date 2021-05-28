import './register.css';
import { useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const history = useHistory();


	const usernameRef = useRef();
	const emailRef = useRef();
	const passwordRef = useRef();
	const confirmPasswordRef = useRef();

	const handleSubmitRegisterForm = async (e) => {
		const email = emailRef.current.value;
		const username = usernameRef.current.value;
		const password = passwordRef.current.value;
		const confirmPassword = confirmPasswordRef.current.value;
		e.preventDefault();
		if (password !== confirmPassword) {
			confirmPasswordRef.current.setCustomValidity(
				"passwords don't match"
			);
			return;
		}

		try {
			const response = await axios.post('auth/register', {
				username,
				email,
				password
			});

      history.push('/login')
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className="login">
			<div className="login__container">
				<div className="login__left">
					<h3 className="login__logo">LOGO </h3>
					<span className="login__desc">
						Connect with friends and the world around you on LOGO.
					</span>
				</div>

				<div className="login__right">
					<form
						onSubmit={handleSubmitRegisterForm}
						className="login__box"
					>
						<input
							placeholder="Username"
							className="login__input"
							ref={usernameRef}
							type="text"
							required={true}
						/>

						<input
							placeholder="Email"
							className="login__input"
							ref={emailRef}
							type="email"
							required={true}
						/>

						<input
							placeholder="Password"
							className="login__input"
							ref={passwordRef}
							type="password"
							required={true}
							minLength={6}
						/>

						<input
							placeholder="ConfirmPassword"
							className="login__input"
							ref={confirmPasswordRef}
							type="password"
							required={true}
							minLength={6}
						/>

						<button className="login__btn" type="submit">
							Sign Up
						</button>

						<Link to="/login" className="login__register-btn">
							Log into Account
						</Link>
					</form>
				</div>
			</div>
		</div>
	);
}
