import Link from "next/link";

export default function Navbar() {
    const user = null;
    const username = null;

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
                        <button>Sign out</button>
                    </li>
                    <li>
                        <Link href="/admin">
                            <button>Write Posts</button>
                        </Link>
                    </li>
                    <li>
                        <Link href={`/${username}`}>
                            <img src={user?.photoURL || '/hacker.png'} alt=""/>
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