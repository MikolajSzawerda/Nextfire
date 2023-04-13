import Link from "next/link";
import {useContext} from "react";
import {UserContext} from "../lib/context";
import {signOut} from "@firebase/auth";
import {auth} from "../lib/firebase";
import {useRouter} from "next/router";

export default function Navbar() {
    const { user, username } = useContext(UserContext);

    const router = useRouter();

    const signOutNow = () => {
        signOut(auth);
        router.reload();
    }

    return <nav className="navbar">
        <ul>
            <li>
                <Link href="/">
                    <button className="btn-logo">NXT</button>
                </Link>
            </li>
            {username && (
                <>
                    <li className="push-left">
                        <button onClick={signOutNow}>Sign out</button>
                    </li>
                    <li>
                        <Link href="/admin">
                            <button>Write Posts</button>
                        </Link>
                    </li>
                    <li>
                        <Link href={`/${username}`}>
                            <img src={user?.photoURL || '/hacker.png'} alt="" referrerPolicy="no-referrer"/>
                        </Link>
                    </li>
                </>

            )}

            {!username && (
                <li>
                    <Link href="/enter">
                        <button className="btn-blue">Log in</button>
                    </Link>
                </li>
            )}
        </ul>

    </nav>
}