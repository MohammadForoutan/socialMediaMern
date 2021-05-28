import './sidebar.css'
import UserAvatar from "../userAvatar/UserAvatar";
import {Users} from "../../dummyData";


function Sidebar() {
    return (
        <div className="sidebar">
        	<div className="sidebar__container">
	           {Users.map((u) => (
		            <UserAvatar key={u.id} user={u} />
		        ))}
        	</div>
        </div>
    )
}

export default Sidebar
