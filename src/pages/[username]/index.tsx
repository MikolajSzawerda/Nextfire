import {getUserWithUsername, postToJSON} from "../../../lib/firebase";
import {collection, getDocs, getFirestore, limit, orderBy, where, query as q} from "@firebase/firestore";
import UserProfile from "../../../components/UserProfile";
import {Post, PostFeed} from "../../../components/PostFeed";
import {User} from "@firebase/auth";
import {GetServerSideProps} from "next";

export const getServerSideProps: GetServerSideProps = async ({query}) => {
    const {username} = query

    const userDoc = await getUserWithUsername(username as string)
    let user = null;
    let posts = null

    if(userDoc) {
        user = userDoc.data()

        const postsQuery = q(
            collection(getFirestore(), userDoc.ref.path, 'posts'),
            where('published', '==', true),
            orderBy('createdAt', 'desc'),
            limit(5)
        )
        posts = (await getDocs(postsQuery)).docs.map(postToJSON)
    }

    return {
        props: {user, username, posts}
    }
}

export default function UserProfilePage({user, username, posts}: {user: User, username: string, posts: Post[]}) {
    return <>
        <main>
            <UserProfile user={user} username={username}/>
            <PostFeed posts={posts} admin={false}/>
        </main>
    </>
}