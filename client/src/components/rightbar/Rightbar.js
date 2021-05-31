import './rightbar.css';
import { useContext, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import {
	Add,
	BeachAccess,
	Home,
	Image,
	LocationOn,
	MoreVertRounded,
	Remove,
	ShareRounded,
	Wc,
	Work
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

export default function Rightbar({ user }) {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;
	const { user: currentUser } = useContext(AuthContext);

	const HomeRightbar = () => {
		const PF = process.env.REACT_APP_PUBLIC_FOLDER;
		const [followings, setFollowings] = useState([]);
		const { user } = useContext(AuthContext);
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
				await axios.put(`/users/${followingId}/unfollow`);

				// go login page and then redirect to home
				history.push('/login');

				handleCloseFollowingOptions();
			} catch (err) {
				console.log(err);
			}
		};
		const fetchFollowings = async () => {
			try {
				const response = await axios.get(
					`/users/followings/${user._id}`
				);
				setFollowings(response.data);
			} catch (err) {
				console.log(err);
			}
		};

		useEffect(() => {
			fetchFollowings();
		}, [user]);

		return (
			<Card className="righbar__card">
				<h4>Followings</h4>
				{followings.map((following) => (
					<>
						<Link>
							<CardHeader
								key={following._id}
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
								action={
									<IconButton
										aria-controls="following-menu"
										onClick={handleFollowingOptions}
									>
										<MoreVertRounded />
									</IconButton>
								}
								title={following.username}
								//  subheader="September 14, 2016"
							/>
						</Link>

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
					</>
				))}
			</Card>
		);
	};

	const ProfileRightbar = () => {
		// followings of user in his/her profile
		const [followings, setFollowings] = useState([]);
		const [followed, setFollowed] = useState(false);

		const fetchFollowings = async () => {
			if (!user?._id) return;
			const response = await axios.get(`/users/followings/${user._id}`);
			setFollowings(response.data);
		};

		useEffect(() => {
			fetchFollowings();
			const isFollowed = user?.followers?.includes(currentUser?._id);
			setFollowed(isFollowed);
		}, [user]);

		const handleFollowUser = async () => {
			try {
				if (followed) {
					const response = await axios.put(
						`/users/${user._id}/unfollow`,
						{
							userId: currentUser._id
						}
					);
					setFollowed(false);
				} else {
					const response = await axios.put(
						`/users/${user._id}/follow`,
						{
							userId: currentUser._id
						}
					);
					console.log(response.data);
					setFollowed(true);
				}
			} catch (err) {
				console.log(err);
			}
		};

		return (
			<>
				{user.username !== currentUser?.username && (
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
