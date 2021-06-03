import './topbar.css';
import {
	Search,
	Notifications,
	Chat,
	Person,
	Menu as MenuIcon,
	Mail,
	AccountCircle,
	MoreVert
} from '@material-ui/icons';
import { Link, useHistory } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Logout } from '../../context/AuthActions';
import {
	AppBar,
	Badge,
	IconButton,
	InputBase,
	MenuItem,
	Menu,
	Toolbar,
	Typography,
	List,
	ListItem,
	ListItemAvatar,
	Avatar,
	ListItemText
} from '@material-ui/core';
import axios from 'axios';

function Topbar() {
	const { user, dispatch } = useContext(AuthContext);
	const history = useHistory();
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;
	const [search, setSearch] = useState('');
	const [searchResults, setSearchResults] = useState('');

	const searchItems = async (e) => {
		setSearch(e.target.value);
		if (search.length >= 3) {
			try {
				const response = await axios.get(
					`/users/search/?username=${search}`
				);
				setSearchResults(response.data);
			} catch (err) {
				console.log(err);
			}
		} else {
			setSearchResults([])
		}
	};

	const handleSearchResultClick = (e) => {
		console.log(e);
	};

	const handleLogout = () => {
		dispatch(Logout());
		history.push('/login');
	};

	const [menuAnchorEl, setMenuAnchorEl] = useState(null);
	const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

	const isMenuOpen = Boolean(menuAnchorEl);
	const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

	const handleProfileMenuOpen = (event) => {
		setMenuAnchorEl(event.currentTarget);
	};

	const handleMobileMenuClose = () => {
		setMobileMoreAnchorEl(null);
	};

	const handleMenuProfile = () => {
		setMenuAnchorEl(null);
		handleMobileMenuClose();
		history.push(`/profile/${user.username}`);
	};

	const handleMenuClose = () => {
		setMenuAnchorEl(null);
		handleMobileMenuClose();
	};

	const handleMobileMenuOpen = (event) => {
		setMobileMoreAnchorEl(event.currentTarget);
	};

	const menuId = 'primary-search-account-menu';
	const renderMenu = (
		<Menu
			anchorEl={menuAnchorEl}
			anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
			id={menuId}
			keepMounted
			transformOrigin={{ vertical: 'top', horizontal: 'right' }}
			open={isMenuOpen}
			onClose={handleMenuClose}
		>
			<MenuItem onClick={handleMenuProfile}>Profile</MenuItem>
			<MenuItem className="topbar__logout-btn" onClick={handleLogout}>
				Log out
			</MenuItem>
		</Menu>
	);

	const mobileMenuId = 'primary-search-account-menu-mobile';
	const renderMobileMenu = (
		<Menu
			anchorEl={mobileMoreAnchorEl}
			anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
			id={mobileMenuId}
			keepMounted
			transformOrigin={{ vertical: 'top', horizontal: 'right' }}
			open={isMobileMenuOpen}
			onClose={handleMobileMenuClose}
		>
			<Link to="/messenger" style={{ color: '#212121' }}>
				<MenuItem>
					<IconButton aria-label="show 4 new mails" color="inherit">
						<Badge badgeContent={4} color="secondary">
							<Mail />
						</Badge>
					</IconButton>
					<p>Messages</p>
				</MenuItem>
			</Link>
			<MenuItem>
				<IconButton
					aria-label="show 11 new notifications"
					color="inherit"
				>
					<Badge badgeContent={11} color="secondary">
						<Notifications />
					</Badge>
				</IconButton>
				<p>Notifications</p>
			</MenuItem>
			<MenuItem onClick={handleProfileMenuOpen}>
				<IconButton
					aria-label="account of current user"
					aria-controls="primary-search-account-menu"
					aria-haspopup="true"
					color="inherit"
					onClick={handleMenuProfile}
				>
					<AccountCircle />
				</IconButton>
				<p>Profile</p>
			</MenuItem>
		</Menu>
	);

	return (
		<div>
			<AppBar position="static">
				<Toolbar>
					<IconButton
						edge="start"
						color="inherit"
						aria-label="open drawer"
					>
						<MenuIcon />
					</IconButton>
					<Link to="/" className="primary-color ">
						<Typography variant="5" noWrap>
							LOGO
						</Typography>
					</Link>
					<div className="search__container">
						<div className="search__icon">
							<Search />
						</div>

						<InputBase
							className="search__input"
							placeholder="Search…"
							inputProps={{ 'aria-label': 'search' }}
							value={search}
							type="search"
							onChange={(e) => searchItems(e)}
						/>

						{searchResults?.length > 0 && (
							<List className="search__results">
								{searchResults?.map((searchResult) => (
									<Link key={searchResult._id} to={`/profile/${searchResult.username}`}>
										<ListItem>
											<ListItemAvatar>
												<Avatar
													src={
														searchResult.avatar
															? PF +
															  searchResult.avatar
															: PF +
															  'person/defaultAvatar.jpeg'
													}
												/>
											</ListItemAvatar>
											<ListItemText
												primary={searchResult.username}
											/>
										</ListItem>
									</Link>
								))}
							</List>
						)}
					</div>
					<div className="menu__divider" />
					{user && (
						<>
							<div className="menu__mobile">
								<Link
									to={`/messenger`}
									className="primary-color"
								>
									<IconButton
										aria-label="show 4 new mails"
										color="inherit"
									>
										<Badge
											badgeContent={4}
											color="secondary"
										>
											<Mail />
										</Badge>
									</IconButton>
								</Link>
								<IconButton
									aria-label="show 17 new notifications"
									color="inherit"
								>
									<Badge badgeContent={17} color="secondary">
										<Notifications />
									</Badge>
								</IconButton>
								<IconButton
									edge="end"
									aria-label="account of current user"
									aria-controls={menuId}
									aria-haspopup="true"
									onClick={handleProfileMenuOpen}
									color="inherit"
								>
									<AccountCircle />
								</IconButton>
							</div>
							<div className="menu__dot">
								<IconButton
									aria-label="show more"
									aria-controls={mobileMenuId}
									aria-haspopup="true"
									onClick={handleMobileMenuOpen}
									color="inherit"
								>
									<MoreVert />
								</IconButton>
							</div>
						</>
					)}
				</Toolbar>
			</AppBar>

			{user && renderMobileMenu}
			{user && renderMenu}
		</div>
	);
}

export default Topbar;
