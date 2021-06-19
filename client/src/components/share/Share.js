import './share.css';
import {
	PermMedia,
	Cancel
} from '@material-ui/icons';
import { useContext, useRef, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useHistory } from 'react-router';
import { Avatar, Button, Card, Divider, Grid } from '@material-ui/core';
import {sharePost} from '../../servicesConfigure/post'
import { uploadImage } from '../../servicesConfigure/upload';

export default function Share() {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;
	const { user } = useContext(AuthContext);
	const history = useHistory();

	const [file, setFile] = useState(null);
	const descriptionRef = useRef();

	const handleSubmitShare = async (e) => {
		e.preventDefault();

		const description = descriptionRef.current.value;

		const newPost = {
			userId: user._id,
			description
		};

		if (file) {
			const data = new FormData();
			const fileName = 'file-' + Math.random() + '-' + Date.now() + '-' + file.name;
			data.append('name', fileName);
			data.append('file', file);
			newPost.image = fileName;
			try {
				await uploadImage(data);
			} catch (err) {
				console.log(err);
			}
		}

		try {
			await sharePost(newPost)
			// push user to login and then redirected to homePage
			history.push('/login');
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<>
		<Card className="share">
			<Grid container>
				<Grid item xs={1}>
					<Avatar
						className="share__img"
						src={
							user.avatar
								? PF + user.avatar
								: `${PF}person/defaultAvatar.jpeg`
						}
						alt={user?.username || 'avatar'}
					/>
				</Grid>
				<Grid item xs={11}>
					<form
						className="share__container"
						onSubmit={handleSubmitShare}
					>
						<div className="share__right">
							<textarea
								placeholder={`What's in your mind ${user.username}?`}
								className="share__input"
								ref={descriptionRef}
							/>
							{file && (
								<div className="share__image">
									<img src={URL.createObjectURL(file)} alt={file?.name || "preview image"} />
									<Cancel
										color="secondary"
										className="share__image-cancel"
										onClick={() => setFile(null)}
									/>
								</div>
							)}
							<div className="share__bottom">
								<div className="share__options">
									<div className="share__option">
										<label
											htmlFor="file"
											className="share__file-btn"
										>
											
												<PermMedia
													htmlColor="tomato"
													className="share__icon"
												/>
												<span className="share__option-text">
													photo
												</span>
											
											<input
												type="file"
												id="file"
												accept=".png,.jpeg,.jpg"
												onChange={(e) =>
													setFile(e.target.files[0])
												}
												className="share__input-file"
											/>
										</label>
									</div>
								</div>
								<Button color="primary" variant="contained"
									type="submit"
								>
									Share
								</Button>
							</div>
						</div>
					</form>
				</Grid>
			</Grid>
		</Card>
		<br />
		<Divider />
		<br />
		</>
	);
}
