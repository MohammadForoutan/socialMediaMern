import './share.css';
import {
	PermMedia,
	Label,
	Room,
	EmojiEmotions,
	Cancel
} from '@material-ui/icons';
import { useContext, useRef, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { useHistory } from 'react-router';
import { IconButton } from '@material-ui/core';

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
			const fileName = Math.random() + '-' + Date.now() + '-' + file.name;
			data.append('name', fileName);
			data.append('file', file);
			newPost.image = fileName;
			try {
				const response = await axios.post('/upload', data);
			} catch (err) {
				console.log(err);
			}
		}

		try {
			const response = await axios.post('/posts', newPost);
			// push user to login and then redirected to homePage
			history.push('/login');
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className="share">
			<form className="share__container" onSubmit={handleSubmitShare}>
				<div className="share__left">
					<img
						className="share__img"
						src={
							user.avatar
								? PF + user.avatar
								: `${PF}person/defaultAvatar.jpeg`
						}
						alt=""
					/>
				</div>
				<div className="share__right">
					<textarea
						placeholder={`What's in your mind ${user.username}?`}
						className="share__input"
						ref={descriptionRef}
					/>
					{file && (
						<div className="share__image">
							<img src={URL.createObjectURL(file)} />
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
								<label htmlFor="file" className="share__option">
									<PermMedia
										htmlColor="tomato"
										className="share__icon"
									/>
									<span className="share__option-text">
										Photo or Video
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

							<div className="share__option">
								<Label
									htmlColor="blue"
									className="share__icon"
								/>
								<span className="share__option-text">Tag</span>
							</div>

							<div className="share__option">
								<Room
									htmlColor="green"
									className="share__icon"
								/>
								<span className="share__option-text">
									Location
								</span>
							</div>

							<div className="share__option">
								<EmojiEmotions
									htmlColor="goldenrod"
									className="share__icon"
								/>
								<span className="share__option-text">
									Feelings
								</span>
							</div>
						</div>
						<button
							className="share__btn share__option"
							type="submit"
						>
							Share
						</button>
					</div>
				</div>
			</form>
		</div>
	);
}
