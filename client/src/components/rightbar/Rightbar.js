import './rightbar.css';
import { Users } from '../../dummyData';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Online from '../online/Online';
import { AuthContext } from '../../context/AuthContext';
import { Add, Remove, VerticalAlignBottom } from '@material-ui/icons';

export default function Rightbar({ user }) {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;
	const { user: currentUser } = useContext(AuthContext);

	const HomeRightbar = () => {
		const PF = process.env.REACT_APP_PUBLIC_FOLDER;
		const [conversations, setConverSations] = useState([]);

		const fetchConversations = async () => {
			try {
				const response = await axios.get(
					`/conversations/${currentUser._id}`
				);
				setConverSations(response.data);
				console.log(response.data);
			} catch (err) {
				console.log(err);
			}
		};
		useEffect(() => {
			fetchConversations();
		}, []);
		return (
			<>
				<h4 className="rightbar__title">Followings</h4>
				<ul className="rightbar__friends">
					{conversations.map((conversation) => (
						<Link to={`/profile/${conversation?.members.find(member => member._id !== currentUser._id).username}`} >
						<Online
							key={conversation._id}
							conversation={conversation}
							currentUser={currentUser}
							online={true}
							showOnline={false}
						/>
					</Link>
					))}
				</ul>
			</>
		);
	};

	const ProfileRightbar = () => {
		// followings of user in his/her profile
		const [followings, setFollowings] = useState([]);
		const [followed, setFollowed] = useState(false);

		const fetchFollowings = async () => {
			if (!user._id) return;
			const response = await axios.get(`/users/followings/${user._id}`);
			setFollowings(response.data);
		};

		useEffect(() => {
			fetchFollowings();
			const isFollowed = user?.followers?.includes(currentUser?._id);
			setFollowed(isFollowed);
		}, [user._id]);

		const handleFollowUser = async () => {
			try {
				if (followed) {
					const response = await axios.put(
						`/users/${user._id}/unfollow`,
						{
							userId: currentUser._id
						}
					);
					console.log(response.data);
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
					<button
						className="righbar__follow-btn"
						onClick={handleFollowUser}
					>
						{followed ? 'unfollow' : 'follow'}
						{followed ? <Remove /> : <Add />}
					</button>
				)}
				<h4 className="rightbar__title">User information</h4>
				<div className="rightbar__info">
					<div className="rightbar__info-item">
						<span className="rightbar__info-key">City:</span>
						<span className="rightbar__info-value">
							{user.city}
						</span>
					</div>
					<div className="rightbar__info-item">
						<span className="rightbar__info-key">From:</span>
						<span className="rightbar__info-value">
							{user.from}
						</span>
					</div>
					<div className="rightbar__info-item">
						<span className="rightbar__info-key">
							Relationship:
						</span>
						<span className="rightbar__info-value">
							{user.relationship}
						</span>
					</div>
				</div>
				<h4 className="rightbar__title">followings users</h4>
				<div className="rightbar__followings">
					{followings.map((following) => (
						<div key={following._id}>
							<Link
								to={`/profile/${following.username}`}
								className="rightbar__following"
							>
								<img
									src={
										following.avatar
											? PF + following.avatar
											: PF + 'person/defaultAvatar.jpeg'
									}
									alt=""
									className="rightbar__following-img"
								/>
								<span className="rightbar__following-name">
									{following.username}
								</span>
							</Link>
						</div>
					))}
				</div>
			</>
		);
	};

	return (
		<div className="rightbar">
			<div className="righbar__container">
				{user ? <ProfileRightbar /> : <HomeRightbar />}
			</div>
		</div>
	);
}
