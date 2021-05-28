import './topbar.css';
import { Search, Notifications, Chat, Person } from '@material-ui/icons';
import { Link, useHistory } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Logout } from '../../context/AuthActions';

function Topbar() {
	const { user, dispatch } = useContext(AuthContext);
	const history = useHistory();
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;

	const handleLogout = () => {
		dispatch(Logout());
		history.push('/login');
	};
	return (
		<div className="topbar">
			{/* logo */}
			{user && (
				<button className="topbar__logout-btn" onClick={handleLogout}>
					Log out
				</button>
			)}
			<div className="topbar__logo">
				<Link to="/">LOGO</Link>
			</div>
			{/* searchbar */}
			<div className="topbar__searchbar">
				<div className="topbar__searchbar-icon">
					<Search />
				</div>
				<input
					className="topbar__searchbar-input"
					type="text"
					placeholder="search for user, music, video"
				/>
			</div>

			{user && (
				<div className="topbar__statusbar">
					{/* <ul className="topbar__links">
						<li>timeline</li>
						<li>homepage</li>
					</ul> */}
					<div className="topbar__icons">
						<div className="topbar__icon">
							<Notifications />
							<span className="topbar__icon-badge">1</span>
						</div>
						<div className="topbar__icon">
							<Link to="/messenger">
								<Chat />
							</Link>
							<span className="topbar__icon-badge">1</span>
						</div>
						<div className="topbar__icon">
							<Person />
							<span className="topbar__icon-badge">1</span>
						</div>
					</div>
					<div className="topbar__avatar">
						<Link to={`/profile/${user?.username}`}>
							<img
								src={
									user?.avatar
										? PF + user.avatar
										: `${PF}person/defaultAvatar.jpeg`
								}
								alt="#"
							/>
						</Link>
					</div>
				</div>
			)}
		</div>
	);
}

export default Topbar;
