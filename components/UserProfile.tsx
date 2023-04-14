import {UserProp} from "../lib/context";

export default function UserProfile({user, username}: UserProp) {
    return <>
        <div className="box-center">
            <img src={user?.photoURL ?? ""} alt="" className="card-img-center"/>
            <p>
                <i>@{username}</i>
            </p>
            <h1>{user?.displayName}</h1>
        </div>
        </>
}