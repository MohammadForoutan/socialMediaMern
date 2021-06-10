import { format } from 'timeago.js';
import React from 'react';

export default function Message({ conversation, message, currentUser }) {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;
	const isOwn = currentUser._id === message.sender;
	const contact = conversation.members.filter(
		(member) => member._id !== currentUser._id
	);

	// set avatar
	let avatar;
	if(isOwn) {avatar = currentUser.avatar}
	else {avatar = contact[0].avatar}

	return (
		<div className={isOwn ? 'message own' : 'message'}>
			<div className="message__header">
				<img
					src={
						avatar ? PF+avatar : PF+'person/defaultAvatar.jpeg'
					}
					alt={contact[0].username}
					className="message__avatar"
				/>
				<span className="message__username">
					{isOwn ? currentUser.username : contact[0].username}
				</span>
				<span className="message__date">
					{format(message.createdAt)}
				</span>
			</div>
			<div className="message__body">
				<p>{message.text}</p>
			</div>
		</div>
	);
}
