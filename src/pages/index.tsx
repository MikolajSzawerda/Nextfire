import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Loader from "../../components/Loader";
import toast from "react-hot-toast";
import {GetServerSideProps} from "next";
import {
    collectionGroup,
    getDocs,
    getFirestore,
    limit,
    orderBy,
    query,
    startAfter,
    Timestamp,
    where
} from "@firebase/firestore";
import {postToJSON} from "../../lib/firebase";
import {Post, PostFeed} from "../../components/PostFeed";
import {useState} from "react";


const LIMIT = 1

export const getServerSideProps: GetServerSideProps = async (contex) => {
    const ref = collectionGroup(getFirestore(), 'posts')
    const postsQuery = query(
        ref,
        where('published', '==', true),
        orderBy('createdAt', 'desc'),
        limit(LIMIT)
    )

    const posts = (await getDocs(postsQuery)).docs.map(postToJSON)

    return {
        props: {posts}
    }
}


// @ts-ignore
export default function Home(props) {
    const [posts, setPosts] = useState(props.posts)
    const [loading, setLoading] = useState(false)

    const [postEnd, setPostsEnd] = useState(false)

    const getMorePosts = async () => {
        setLoading(true)
        const last = posts[posts.length-1]

        const cursor = typeof last.createdAt === 'number' ? Timestamp.fromMillis(last.createdAt) : last.createdAt

        const ref = collectionGroup(getFirestore(), 'posts')
        const postsQuery = query(
            ref,
            where('published', '==', true),
            orderBy('createdAt', 'desc'),
            startAfter(cursor),
            limit(LIMIT)
        )

        const newPosts = (await getDocs(postsQuery)).docs.map((doc) => doc.data())

        setPosts(posts.concat(newPosts))
        setLoading(false)

        if (newPosts.length < LIMIT){
            setPostsEnd(true)
        }

    };
    return (
      <main>
        <PostFeed posts={posts}/>
          {!loading && !postEnd && <button onClick={getMorePosts}>Load more</button>}
          <Loader show={loading}/>

          {postEnd && 'You have reach the end!'}

      </main>
  )
}
