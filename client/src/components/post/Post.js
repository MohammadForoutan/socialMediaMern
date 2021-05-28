import './post.css';
import { Delete, MoreVert, ShareRounded, ThumbUp, ThumbUpAltOutlined } from '@material-ui/icons';
import { format } from 'timeago.js';
import { useContext, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import Share from '../share/Share';

export default function Post({ post }) {
	const [like, setLike] = useState(post.likes.length);
	const [isLiked, setIsLiked] = useState(false);
	const [user] = useState(post.userId);
	const { user: currentUser } = useContext(AuthContext);
	const [anchorEl, setAnchorEl] = useState(null);

	const PF = process.env.REACT_APP_PUBLIC_FOLDER;

	useEffect(() => {
		const isLike = post.likes.some((like) => like === currentUser?._id);
		console.log(currentUser?._id, post.likes[0]);
		setIsLiked(isLike);
	}, [post, currentUser?._id]);

	const likeHandler = async () => {
		try {
			const response = await axios.put(`/posts/${post._id}/like`, {
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

	const handleDeletePost = async() => {
		try {
			const response = await axios.delete(`/posts/${post._id}`, {
				data: {
					userId: currentUser._id
				}
			})

			window.location.reload();
			

			handleClosePostOptions();
			// console.log(reponse.data)
		} catch (err) {
			console.log(err)
		}
	}

	return (
		<div className="post">
			<div className="post__top">
				<div className="post__top-left">
					<Link to={`/profile/${user.username}`}>
						<div className="post__user-info">
							<img
								className="post__profile-img"
								src={
									user.avatar
										? PF + user.avatar
										: `${PF}person/defaultAvatar.jpeg`
								}
								alt=""
							/>
							<span className="post__username">
								{user.username}
							</span>
						</div>
					</Link>
					<span className="post__date">{format(post.createdAt)}</span>
				</div>
				<div className="post__top-right">
					<IconButton
						aria-controls="simple-menu"
						aria-haspopup="true"
						onClick={handlePostOptions}
					>
						<MoreVert />
					</IconButton>
					<Menu
						id="simple-menu"
						anchorEl={anchorEl}
						keepMounted
						open={Boolean(anchorEl)}
						onClose={handleClosePostOptions}
					>
						{user._id === currentUser._id && (
							<MenuItem onClick={handleDeletePost}>
								delete <Delete color="secondary" />
							</MenuItem>
						)}
						<MenuItem onClick={handleClosePostOptions}>
							share  <ShareRounded />
						</MenuItem>
					</Menu>
				</div>
			</div>
			<div className="post__center">
				{post?.description && <p className="post__text">{post?.description}</p>}
				<img className="post__img" src={PF + post?.image} alt="" />
			</div>
			<div className="post__bottom">
				<div className="post__bottom-left">
					<span className="post__like-counter">
						{isLiked ? (
							<ThumbUp color="primary" onClick={likeHandler} />
						) : (
							<ThumbUpAltOutlined color="primary" onClick={likeHandler} />
						)}
						<span className="post__like-text">{like} people like it</span>
					</span>
				</div>
				<div className="post__bottom-right">
					<span className="post__comment-text">
						{post.comment || 0} comments
					</span>
				</div>
			</div>
		</div>
	);
}
