import Link from "next/link";

export interface Post {
    title: string,
    slug: string,
    username: string,
    uid: string,
    published: boolean,
    content: string,
    createdAt: Date,
    updatedAt: Date,
    heartCount: number
}

export const PostFeed: Function = ({posts, admin}:{posts: Post[], admin:boolean}) => {
    return posts ? posts.map((post) => <PostItem post={post} key={post.slug} admin={admin}/>) : null
}

function PostItem({post, admin=false}:{post: Post, admin: boolean}){
    const wordCount = post?.content.trim().split(/\s+/g).length
    const minutesToRead = (wordCount / 100 + 1).toFixed(0)

    return (
        <div className="card">
                    <Link href={`/${post.username}`} legacyBehavior>
                        <strong>By @{post.username}</strong>
                    </Link>
                    <Link href={`/${post.username}/${post.slug}`} legacyBehavior>
                        <h2>
                            <a>{post.title}</a>
                        </h2>
                    </Link>
                    <footer>
                        <span>
                            {wordCount} word. {minutesToRead} min read
                        </span>
                        <span>
                            💗 {post.heartCount || 0} Hearts
                        </span>
                    </footer>
                </div>
    );
}
