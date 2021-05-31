import './profile.css';
import Topbar from '../../components/topbar/Topbar';
import Feed from '../../components/feed/Feed';
import Rightbar from '../../components/rightbar/Rightbar';
import { useContext, useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import axios from 'axios';
import { Cancel, Edit, Image, Label } from '@material-ui/icons';
import {
	AppBar,
	Avatar,
	Button,
	Container,
	Dialog,
	Divider,
	FormControl,
	FormHelperText,
	IconButton,
	Input,
	InputLabel,
	Slide,
	TextField,
	Toolbar,
	Typography
} from '@material-ui/core';

import { Alert } from '@material-ui/lab';
import { AuthContext } from '../../context/AuthContext';
import { UpdateUser } from '../../context/AuthActions';

export default function Profile() {
	const { user: currentUser, dispatch } = useContext(AuthContext);

	const history = useHistory();
	const [user, setUser] = useState({});
	const [openEditProfile, setOpenEditProfile] = useState(false);

	// edit form data
	const [formUsername, setFormUsername] = useState(user.username);
	const [email, setEmail] = useState(user.email);
	const [password, setPassword] = useState('');
	const [city, setCity] = useState(user.city);
	const [from, setFrom] = useState(user.from);
	const [relationship, setRelationship] = useState(user.relationship);
	const [avatar, setAvatar] = useState(null);
	const [cover, setCover] = useState(null);

	const params = useParams();
	const username = params.username;
	// const [username, setUsername] = useState(params.username);

	const fetchUser = async () => {
		const response = await axios.get(`/users/?username=${username}`);
		setUser(response.data);

		const user = response.data;
		setFormUsername(user.username);
		setEmail(user.email);
		setCity(user.city);
		setFrom(user.from);
		setRelationship(user.relationship);
	};

	useEffect(() => {
		fetchUser();
	}, [username]);
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;

	const handleOpenEditProfile = () => {
		setOpenEditProfile(true);
	};

	const handleCloseEditProfile = () => {
		setOpenEditProfile(false);
	};

	const handleSubmitEditProfileForm = async (e) => {
		e.preventDefault();

		const updateProfile = {
			username: formUsername,
			email,
			city,
			from,
			relationship,
			userId: currentUser._id
		};

		if (password.length >= 6) {
			updateProfile.password = password;
		} else {
			updateProfile.password = false;
		}

		let coverName;
		if (cover) {
			const data = new FormData();
			coverName =
				'cover-' + Math.random() + '-' + Date.now() + '-' + cover.name;
			data.append('name', coverName);
			data.append('file', cover);
			updateProfile.cover = coverName;
			try {
				const response = await axios.post('/upload', data);
			} catch (err) {
				console.log(err);
			}
		}

		let avatarName;
		if (avatar) {
			const data = new FormData();
			avatarName =
				'avatar-' +
				Math.random() +
				'-' +
				Date.now() +
				'-' +
				avatar.name;
			data.append('name', avatarName);
			data.append('file', avatar);
			updateProfile.avatar = avatarName;
			try {
				const response = await axios.post('/upload', data);
			} catch (err) {
				console.log(err);
			}
		}

		const reponse = await axios.put(`/users/${user._id}`, updateProfile);
		dispatch({
			type: 'UPDATEUSER',
			payload: {
				_id: currentUser._id,
				username: formUsername,
				email,
				city,
				from,
				relationship,
				cover: coverName || currentUser.cover,
				avatar: avatarName || currentUser.avatar
			}
		});

		console.log(currentUser);
		handleCloseEditProfile();

		history.push('/');
	};

	return (
		<>
			<Topbar />
			<div className="profile">
				{/* <Sidebar /> */}
				<div className="profile__right">
					<div className="profile__right-top">
						<div className="profile__cover">
							{user?._id === currentUser?._id && (
								<Button
									className="profile__cover-change-btn"
									onClick={handleOpenEditProfile}
									color="primary"
									variant="contained"
								>
									<Edit /> &nbsp;&nbsp;
									<span>Edit profile</span>
								</Button>
							)}
							<img
								className="profile__cover-img"
								src={
									user.cover
										? PF + user.cover
										: `${PF}/defaultCover.jpg`
								}
								alt=""
							/>
							<img
								className="profile__user-avatar"
								src={
									user.avatar
										? PF + user.avatar
										: `${PF}/person/defaultAvatar.jpeg`
								}
								alt=""
							/>
						</div>
						<div className="profile__info">
							<h4 className="profile__info-name">
								{user.username}
							</h4>
							<span className="profile__info-about">
								{user.about}
							</span>
						</div>
					</div>

					<br />
					<br />
					<br />

					<div className="profile__right-bottom">
						<Feed username={username} />
						<Rightbar user={user} />
					</div>
				</div>
			</div>

			{/* FORM EDIT PROFILE */}
			<Dialog
				fullScreen
				className="profile__edit-form"
				open={openEditProfile}
				onClose={handleCloseEditProfile}
			>
				<AppBar>
					<Toolbar>
						<Button
							autoFocus
							color="inherit"
							variant="outlined"
							onClick={handleCloseEditProfile}
							edge="start"
						>
							Close
						</Button>
					</Toolbar>
				</AppBar>
				<Container className="profile__edit-form">
					<form onSubmit={handleSubmitEditProfileForm}>
						<div className="profile__input-container">
							<TextField
								label="Username"
								placeholder="Username"
								fullWidth
								InputLabelProps={{
									shrink: true
								}}
								variant="outlined"
								value={formUsername}
								onChange={(e) =>
									setFormUsername(e.target.value)
								}
							/>
						</div>

						<div className="profile__input-container">
							<TextField
								label="Email"
								placeholder="Email"
								fullWidth
								InputLabelProps={{
									shrink: true
								}}
								variant="outlined"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>

						<div className="profile__input-container">
							<TextField
								label="Password"
								placeholder="Password"
								fullWidth
								minLength={6}
								InputLabelProps={{
									shrink: true
								}}
								variant="outlined"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								helperText="If you wanna change your password fill this field"
							/>
						</div>

						<br />

						<Alert severity="info">
							Empty field mean don't show that field
						</Alert>

						<br />
						<div className="profile__input-container">
							<TextField
								label="City"
								placeholder="City"
								fullWidth
								InputLabelProps={{
									shrink: true
								}}
								variant="outlined"
								value={city}
								onChange={(e) => setCity(e.target.value)}
							/>
						</div>

						<div className="profile__input-container">
							<TextField
								label="From"
								placeholder="From"
								fullWidth
								InputLabelProps={{
									shrink: true
								}}
								variant="outlined"
								value={from}
								onChange={(e) => setFrom(e.target.value)}
							/>
						</div>

						<div className="profile__input-container">
							<TextField
								label="Relationship"
								placeholder="Relationship"
								fullWidth
								InputLabelProps={{
									shrink: true
								}}
								variant="outlined"
								value={relationship}
								onChange={(e) =>
									setRelationship(e.target.value)
								}
							/>
						</div>

						<div className="profile__input-container image">
							<label htmlFor="avatar">
								<Avatar color="primary" />
								<span>Avatar</span>
								<span className="edit-icon">
									<Edit />
								</span>
							</label>
							<input
								id="avatar"
								type="file"
								accept=".png,.jpeg,.jpg"
								onChange={(e) => setAvatar(e.target.files[0])}
							/>
							{avatar && (
								<div className="share__image ">
									<img
										src={URL.createObjectURL(avatar)}
										className="image-preview"
									/>
									<Cancel
										color="secondary"
										className="share__image-cancel"
										onClick={() => setAvatar(null)}
									/>
								</div>
							)}
							<br />
						</div>

						<div className="profile__input-container image">
							<label htmlFor="cover">
								<Image color="primary" />
								<span>Cover</span>
								<span className="edit-icon">
									<Edit />
								</span>
							</label>
							<input
								id="cover"
								type="file"
								accept=".png,.jpeg,.jpg"
								onChange={(e) => setCover(e.target.files[0])}
							/>
							{cover && (
								<div className="share__image ">
									<img
										src={URL.createObjectURL(cover)}
										className="image-preview"
									/>
									<Cancel
										color="secondary"
										className="share__image-cancel"
										onClick={() => setCover(null)}
									/>
								</div>
							)}
						</div>

						<Button
							variant="contained"
							color="primary"
							type="submit"
						>
							Save
						</Button>

						<br />
						<br />
					</form>
				</Container>
			</Dialog>
		</>
	);
}
