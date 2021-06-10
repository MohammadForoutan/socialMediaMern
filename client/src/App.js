import React, { useContext } from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect
} from 'react-router-dom';
import Profile from './pages/profile/Profile';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Home from './pages/home/Home';
import { AuthContext } from './contexts/AuthContext';
import Messenger from './pages/messenger/Messenger';

function App() {
	const { user } = useContext(AuthContext);

	console.log(user)
	return (
		<Router>
			<Switch>
				<Route path="/" exact>
					{user ? <Home /> : <Register />}
				</Route>

				<Route path="/login">
					{user ? <Redirect to="/" /> : <Login />}
				</Route>

				<Route path="/register">
					{user ? <Redirect to="/" /> : <Register />}
				</Route>

				<Route path="/messenger">
					{!user ? <Redirect to="/" />  : <Messenger />}
				</Route>

				<Route path="/profile/:username">
					<Profile />
					{/* {user ? <Redirect to="/" /> : <Profile />} */}
				</Route>
			</Switch>
		</Router>
	);
}

export default App;
