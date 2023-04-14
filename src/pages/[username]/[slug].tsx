import {GetStaticPaths, GetStaticProps} from "next";
import {getUserWithUsername, postToJSON} from "../../../lib/firebase";
import {collectionGroup, doc, getDoc, getDocs, getFirestore, limit, query} from "@firebase/firestore";
import {ParsedUrlQuery} from "querystring";
import {useDocumentData} from "react-firebase-hooks/firestore";
import {useContext} from "react";
import {UserContext} from "../../../lib/context";
import PostContent from "../../../components/PostContent";
import Link from "next/link";
import {Post} from "../../../components/PostFeed"

export const getStaticProps: GetStaticProps = async ({params}) => {
    const {username, slug} = params as ParsedUrlQuery
    const userDoc = await getUserWithUsername(username as string)
    let post
    let path

    if(userDoc){
        const postRef = doc(getFirestore(), userDoc.ref.path, 'posts', slug as string)

        post = postToJSON(await getDoc(postRef))
        console.log(post)
        path = postRef.path
    }

    return {
        props: {post, path},
        revalidate: 5000
    }
}

export const getStaticPaths: GetStaticPaths = async () => {
    const q = query(
        collectionGroup(getFirestore(), 'posts'),
        limit(20)
    )

    const snapshot = await getDocs(q)

    const paths = snapshot.docs.map((doc)=> {
        const {slug, username} = doc.data()
        return {
            params: {username, slug}
        }
    })

    return {
        paths,
        fallback: 'blocking'
    }
}

export default function Post({post, path}:{post:Post, path: string}) {
    const postRef = doc(getFirestore(), path)
    const [realtimePost] = useDocumentData(postRef)

    const postFeed = realtimePost as Post || post

    const {user: currentUser} = useContext(UserContext)

    return <>
        <main>

            <section>
                <PostContent post={postFeed} />
            </section>

            <aside className="card">
                <p>
                    <strong>{postFeed.heartCount || 0} 🤍</strong>
                </p>
            </aside>
        </main>
    </>
}