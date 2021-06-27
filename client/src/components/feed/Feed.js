import './feed.css';
import Share from '../share/Share';
// import { Posts } from "../../dummyData";
import { useState, useEffect, useContext } from 'react';
import Post from '../post/Post';
import { AuthContext } from '../../contexts/AuthContext';
import { profilePosts, timelinePosts } from '../../servicesConfigure/post';

function Feed({ username }) {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const isProfile = Boolean(username);
    if (isProfile) {
      const fetchUserPosts = async () => {
        const { data } = await profilePosts(username);
        setPosts(data);
      };
      fetchUserPosts();
    } else {
      const fetchUserTimline = async () => {
        const response = await timelinePosts();
        if (response) {
          setPosts(response.data);
        }
      };
      fetchUserTimline();
    }
  }, [username]);

  return (
    <div className='feed'>
      {(!username || username === user?.username) && <Share />}
      {posts.map((post) => {
        // if no post found
        // if (!Boolean(post.userId)) return;
        return <Post key={post._id} post={post} />;
      })}
    </div>
  );
}

export default Feed;
