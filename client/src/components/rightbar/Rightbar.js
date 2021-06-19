import './rightbar.css';
import { useContext, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import {
	Add,
	Home,
	LocationOn,
	Message,
	MoreVertRounded,
	Remove,
	Wc
} from '@material-ui/icons';
import {
	Avatar,
	Button,
	Card,
	CardHeader,
	Divider,
	IconButton,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Menu,
	MenuItem
} from '@material-ui/core';
import {
	unfollowUser,
	followUser,
	getFollowings
} from '../../servicesConfigure/user';
import { findOrCreateConversation } from '../../servicesConfigure/conversation';

export default function Rightbar({ user }) {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;
	const { user: currentUser } = useContext(AuthContext);

	const HomeRightbar = () => {
		const PF = process.env.REACT_APP_PUBLIC_FOLDER;
		const [followings, setFollowings] = useState([]);
		const { user: currentUser } = useContext(AuthContext);
		const [anchorEl, setAnchorEl] = useState(null);
		const history = useHistory();

		const handleCloseFollowingOptions = () => {
			setAnchorEl(null);
		};

		const handleFollowingOptions = (e) => {
			setAnchorEl(e.currentTarget);
		};

		const handleUnfollowUser = async (e) => {
			try {
				const followingId = e.currentTarget.getAttribute('userId');
				await unfollowUser(followingId);
				// go login page and then redirect to home
				history.push('/login');
				handleCloseFollowingOptions();
			} catch (err) {
				console.log(err);
			}
		};

		useEffect(() => {
			const fetchFollowings = async () => {
				try {
					const {data} = await getFollowings(currentUser._id);
					setFollowings(data);
				} catch (err) {
					console.log(err);
				}
			};
			fetchFollowings();
		}, [currentUser]);

		return (
			<Card className="righbar__card">
				<h4>Followings</h4>
				{followings.map((following) => (
					<div key={following._id}>
						<CardHeader
							avatar={
								<Link to={`/profile/${following.username}`}>
									<Avatar
										src={
											following.avatar
												? PF + following.avatar
												: following.username
										}
										alt={following.username}
									/>
								</Link>
							}
							action={
								<IconButton
									aria-controls="following-menu"
									onClick={handleFollowingOptions}
								>
									<MoreVertRounded />
								</IconButton>
							}
							title={
								<Link to={`/profile/${following.username}`}>
									{following.username}
								</Link>
							}
							//  subheader="September 14, 2016"
						/>

						<Menu
							id="following-menu"
							anchorEl={anchorEl}
							keepMounted
							open={Boolean(anchorEl)}
							onClose={handleCloseFollowingOptions}
						>
							<MenuItem
								userId={following._id}
								onClick={handleUnfollowUser}
							>
								unfollow <Remove color="secondary" />
							</MenuItem>
						</Menu>
					</div>
				))}
			</Card>
		);
	};

	const ProfileRightbar = () => {
		const history = useHistory()
		// followings of user in his/her profile
		const [followings, setFollowings] = useState([]);
		const [followed, setFollowed] = useState(false);

		const handleStartConversation = async() => {
			await findOrCreateConversation(currentUser._id, user._id);
			history.push('/messenger')

		}
		useEffect(() => {
			const fetchFollowings = async () => {
				if (!user?._id) return;
				const {data} = await getFollowings(user._id);
				setFollowings(data);
			};

			fetchFollowings();
			const isFollowed = user?.followers?.includes(currentUser?._id);
			setFollowed(isFollowed);
		}, []);

		const handleFollowUser = async () => {
			try {
				console.log({
					followed,
					user,
					currentUser
				});
				if (followed) {
					await unfollowUser(user._id);
					setFollowed(false);
				} else {
					await followUser(user._id);
					setFollowed(true);
				}
			} catch (err) {
				console.log(err);
			}
		};

		return (
			<>
				{user.username !== currentUser?.username && currentUser && (
					<>
						<Button
							color={followed ? 'secondary' : 'primary'}
							variant="contained"
							className="righbar__follow-btn"
							onClick={handleFollowUser}
						>
							{followed ? 'unfollow' : 'follow'}
							{followed ? <Remove /> : <Add />}
						</Button>
						<br />
						<br />
					</>
				)}

				{followed && (
					<Button onClick={handleStartConversation} color="primary" variant="contained">
						Start conversation &nbsp;&nbsp;
						<Message />
					</Button>
				)}
				<Card>
					<List>
						<ListItem>
							<ListItemAvatar>
								<Avatar>
									<LocationOn />
								</Avatar>
							</ListItemAvatar>
							<ListItemText primary={user.city} />
						</ListItem>
						<ListItem>
							<ListItemAvatar>
								<Avatar>
									<Home />
								</Avatar>
							</ListItemAvatar>
							<ListItemText primary={user.from} />
						</ListItem>
						<ListItem>
							<ListItemAvatar>
								<Avatar>
									<Wc />
								</Avatar>
							</ListItemAvatar>
							<ListItemText primary={user.relationship} />
						</ListItem>
					</List>
				</Card>

				<br />
				<Divider />
				<br />

				<Card>
					<CardHeader title="Following Users" />
					{followings.map((following) => (
						<Link
							key={following._id}
							to={`/profile/${following.username}`}
						>
							<CardHeader
								avatar={
									<Avatar
										src={
											following.avatar
												? PF + following.avatar
												: following.username
										}
										alt={following.username}
									/>
								}
								title={following.username}
								//  subheader="September 14, 2016"
							/>
						</Link>
					))}
				</Card>
			</>
		);
	};

	return (
		<div className="rightbar">
			{user ? <ProfileRightbar /> : <HomeRightbar />}
		</div>
	);
}
