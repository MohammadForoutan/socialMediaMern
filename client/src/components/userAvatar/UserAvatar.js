import "./userAvatar.css";


export default function CloseFriend({user}) {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <li className="user-avatar">
      <img className="user-avatar__img" src={PF+user.avatar} alt="" />
      <span className="user-avatar__name">{user.username}</span>
    </li>
  );
}
