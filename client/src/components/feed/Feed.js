import './feed.css';
import Share from '../share/Share';
// import { Posts } from "../../dummyData";
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Post from '../post/Post';
import { AuthContext } from '../../context/AuthContext';

function Feed({ username }) {
	const [posts, setPosts] = useState([]);
	const {user} = useContext(AuthContext);
	
	useEffect(() => {
    const isProfile = Boolean(username)
    if(isProfile) {		
      fetchUserPosts()
    } else {
      fetchUserTimline()
    }
	}, [username]);

  
	const fetchUserPosts = async() => {
		const response = await axios.get(`/posts/profile/${username}`);
		setPosts(response.data);
	}

	const fetchUserTimline = async () => {
		const response = await axios.get(
			`/posts/timeline`
		);
		setPosts(response.data);
	};

	return (
		<div className="feed">
			{(!username || username === user?.username) && <Share />}
			{posts.map((post) => {
				// if no post found
				// if (!Boolean(post.userId)) return;
				return (<Post key={post._id} post={post} />);
			})}
		</div>
	);
}

export default Feed;
