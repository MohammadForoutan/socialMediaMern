import Topbar from '../../components/topbar/Topbar';
import './messenger.css';
import Online from '../../components/online/Online';
import {
	Avatar,
	IconButton,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText
} from '@material-ui/core';
import {
	AlternateEmail,
	AttachFile,
	Home,
	LocationOn,
	Send,
	Wc
} from '@material-ui/icons';
import Message from '../../components/message/Message';
import { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { io } from 'socket.io-client';
import { getUserConversations } from '../../servicesConfigure/conversation';
import { sendMessage, getConversationMessages } from '../../servicesConfigure/message';

export default function Messenger() {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;
	const [currentConversation, setCurrentConversation] = useState(null);
	const [messages, setMessages] = useState([]);
	const [conversations, setConverSations] = useState([]);
	const [newMessage, setNewMessage] = useState('');
	const [arrivalMessage, setArrivalMessage] = useState(null);
	const [currentContact, setCurrentContact] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const { user: currentUser } = useContext(AuthContext);
	const scrollRef = useRef();
	const socket = useRef();

	const handleSendNewMessage = async (e) => {
		e.preventDefault();
		if (newMessage.trim().length < 1) return;
		const message = {
			sender: currentUser._id,
			text: newMessage,
			conversationId: currentConversation._id
		};

		// Send socket Server
		const receiver = currentConversation.members.find(
			(member) => member._id !== currentUser._id
		);

		socket.current.emit('sendMessage', {
			senderId: currentUser._id,
			receiverId: receiver._id,
			text: newMessage
		});

		try {
			// send to api - DB
			const {data} = await sendMessage(message)
			console.log(data);
			setMessages([...messages, message]);
			setNewMessage('');
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		socket.current = io('ws://localhost:8900');

		// socket.current.on('getMessage', (data) => {
		// 	setArrivalMessage({
		// 		sender: data.senderId,
		// 		text: data.text,
		// 		createdAt: Date.now()
		// 	});
		// });
	}, []);

	useEffect(() => {
		socket.current.emit('addUser', currentUser._id);
		socket.current.on('getUsers', (users) => {
			setOnlineUsers(users);
		});
	}, [currentUser]);

	useEffect(() => {
		arrivalMessage &&
			currentConversation?.members.some(
				(member) => member._id === arrivalMessage.sender
			) &&
			setMessages((prev) => [...prev, arrivalMessage]);
		// setMessages([...messages, arrivalMessage]);
	}, [arrivalMessage, currentConversation]);

	useEffect(() => {
		const fetchConversations = async () => {
			try {
				const {data} = await getUserConversations(currentUser)
				
				setConverSations(data);
			} catch (err) {
				console.log(err);
			}
		};
		fetchConversations();
		socket.current.on('getMessage', (data) => {
			setArrivalMessage({
				sender: data.senderId,
				text: data.text,
				createdAt: Date.now()
			});
		});
	}, [currentUser._id]);

	useEffect(() => {
		const fetchMessages = async () => {
			try {
				const {data} = await getConversationMessages(currentConversation);
				setMessages(data);
			} catch (err) {
				console.log(err);
			}
		};
		if (currentConversation) {
			fetchMessages();
			const contact = currentConversation?.members.find(
				(member) => member?._id !== currentUser._id
			);
			console.log(contact);
			setCurrentContact(contact);
		}
	}, [currentConversation, currentUser]);

	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	return (
		<>
			<Topbar />
			<div className="messenger">
				<div className="messenger__menu">
					<br />
					{conversations.map((conversation) => (
						<div
							onClick={() => setCurrentConversation(conversation)}
							key={conversation._id}
						>
							<Online
								key={conversation._id}
								conversation={conversation}
								currentUser={currentUser}
								onlineUsers={onlineUsers}
								showOnline={true}
							/>
						</div>
					))}
				</div>
				{currentConversation ? (
					<>
						<div className="messenger__box">
							<div className="messenger__box-messages">
								{messages.map((message) => (
									<div key={message._id} ref={scrollRef}>
										<Message
											message={message}
											conversation={currentConversation}
											currentUser={currentUser}
										/>
									</div>
								))}
							</div>
							<div className="messenger__box-input">
								<form onSubmit={handleSendNewMessage}>
									<input
										placeholder="Enter your message..."
										autoFocus={true}
										onChange={(e) =>
											setNewMessage(e.target.value)
										}
										value={newMessage}
									/>
									<label htmlFor="message-file">
										<IconButton>
											<AttachFile />
										</IconButton>
									</label>
									<input
										type="file"
										id="message-file"
										style={{ display: 'none' }}
									/>

									<IconButton type="submit">
										<Send />
									</IconButton>
								</form>
							</div>
						</div>
					</>
				) : (
					<p className="messenger__box messenger__box--default">
						Choose a Conversation
					</p>
				)}
				{currentContact ? (
					<div className="messenger__contact">
						<div className="messenger__contact-container">
							<img
								className="messenger__contact-img"
								src={
									currentContact?.avatar
										? PF + currentContact.avatar
										: PF + 'person/defaultAvatar.jpeg'
								}
								alt=""
							/>
							<List className="messenger__contact-info">
								<ListItem>
									<ListItemAvatar>
										<Avatar>
											<AlternateEmail />
										</Avatar>
									</ListItemAvatar>
									<ListItemText
										primary={currentContact.username}
									/>
								</ListItem>
								<ListItem>
									<ListItemAvatar>
										<Avatar>
											<LocationOn />
										</Avatar>
									</ListItemAvatar>
									<ListItemText
										primary={currentContact.city}
									/>
								</ListItem>
								<ListItem>
									<ListItemAvatar>
										<Avatar>
											<Home />
										</Avatar>
									</ListItemAvatar>
									<ListItemText
										primary={currentContact.from}
									/>
								</ListItem>
								<ListItem>
									<ListItemAvatar>
										<Avatar>
											<Wc />
										</Avatar>
									</ListItemAvatar>
									<ListItemText
										primary={currentContact.relationship}
									/>
								</ListItem>
							</List>
						</div>
					</div>
				) : null}
			</div>
		</>
	);
}
