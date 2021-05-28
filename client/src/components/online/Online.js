import './online.css';

export default function Online({
	conversation,
	currentUser,
	onlineUsers,
	showOnline
}) {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;
	const user = conversation?.members.find(
		(member) => member._id !== currentUser._id
	);

	const isOnline = onlineUsers?.some((onlineUser) => {
		return onlineUser.userId === user._id;
	});
	return (
		<li className="rightbarFriend">
			<div className="rightbarProfileImgContainer">
				<img
					className="rightbarProfileImg"
					src={
						user.avatar
							? PF + user.avatar
							: PF + 'person/defaultAvatar.jpeg'
					}
					alt=""
				/>
				{showOnline ? (
					<span
						className={
							isOnline
								? 'rightbarStatus online'
								: 'rightbarStatus offline'
						}
					></span>
				) : (
					<></>
				)}
			</div>
			<span className="rightbarUsername">{user.username}</span>
		</li>
	);
}
