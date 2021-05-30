import './post.css';
import {
	Delete,
	MoreVert,
	ShareRounded,
	ThumbUp,
	ThumbUpAltOutlined
} from '@material-ui/icons';
import { format } from 'timeago.js';
import { useContext, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import {
	Avatar,
	Card,
	CardHeader,
	IconButton,
	Menu,
	MenuItem
} from '@material-ui/core';

export default function Post({ post }) {
	const [like, setLike] = useState(post.likes.length);
	const [isLiked, setIsLiked] = useState(false);
	const [user] = useState(post.userId);
	const { user: currentUser } = useContext(AuthContext);
	const [anchorEl, setAnchorEl] = useState(null);
	const history = useHistory();

	const PF = process.env.REACT_APP_PUBLIC_FOLDER;

	useEffect(() => {
		const isLike = post.likes.some((like) => like === currentUser?._id);
		setIsLiked(isLike);
	}, [post, currentUser?._id]);

	const likeHandler = async () => {
		try {
			await axios.put(`/posts/${post._id}/like`, {
				userId: currentUser._id
			});

			setLike(isLiked ? like - 1 : like + 1);
			setIsLiked(!isLiked);
		} catch (err) {
			console.log(err);
		}
	};

	const handleClosePostOptions = () => {
		setAnchorEl(null);
	};

	const handlePostOptions = (e) => {
		setAnchorEl(e.currentTarget);
	};

	const handleDeletePost = async () => {
		try {
			await axios.delete(`/posts/${post._id}`, {
				data: {
					userId: currentUser._id
				}
			});

			// go login page and then redirect to home
			history.push('/login');

			handleClosePostOptions();
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<Card className="post">
			<CardHeader
				avatar={
					<Link to={`/profile/${user.username}`}>
						<Avatar src={PF + user.avatar} alt={user.username} />
					</Link>
				}
				action={
					<IconButton	onClick={handlePostOptions}>
						<MoreVert />
					</IconButton>
				}
				title={
					<Link to={`/profile/${user.username}`}>
						{user.username}
					</Link>
				}
				subheader={format(post.createdAt)}
			/>
			<Menu
						id="simple-menu"
						anchorEl={anchorEl}
						keepMounted
						open={Boolean(anchorEl)}
						onClose={handleClosePostOptions}
					>
						{user?._id === currentUser?._id && (
							<MenuItem onClick={handleDeletePost}>
								delete <Delete color="secondary" />
							</MenuItem>
						)}
						<MenuItem onClick={handleClosePostOptions}>
							share <ShareRounded />
						</MenuItem>
					</Menu>
			<div className="post__center">
				{post?.description && (
					<p className="post__text">{post?.description}</p>
				)}
				<img className="post__img" src={PF + post?.image} alt="" />
			</div>
			<div className="post__bottom">
				<div className="post__bottom-left">
					<span className="post__like-counter">
						{isLiked ? (
							<ThumbUp color="primary" onClick={likeHandler} />
						) : (
							<ThumbUpAltOutlined
								color="primary"
								onClick={likeHandler}
							/>
						)}
						<span className="post__like-text">
							{like} people like it
						</span>
					</span>
				</div>
				<div className="post__bottom-right">
					<span className="post__comment-text">
						{post.comment || 0} comments
					</span>
				</div>
			</div>
		</Card>
	);
}
