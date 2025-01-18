import { currentUser } from "@clerk/nextjs/server";
import CreatePost from "@/components/CreatePost";
import WhoToFollow from "@/components/WhoToFollow";
import { getPosts } from "@/actions/post.action";
import PostCard from "@/components/PostCard";
import { getDbUserId } from "@/actions/user.action";

export default async function Home() {
  const user = await currentUser();
  const posts = await getPosts();
  const dbUserId = await getDbUserId();

  return (
    <div className={"grid grid-cols-1 gap-6 lg:grid-cols-10"}>
      <div className={"lg:col-span-6"}>
        <CreatePost />

        <div className={"mt-6 space-y-6"}>
          {posts?.map((post) => (
            <PostCard key={post.id} post={post} dbUserId={dbUserId} />
          ))}
        </div>
      </div>
      <div className={"sticky top-20 hidden lg:col-span-4 lg:block"}>
        {user ? <WhoToFollow /> : null}
      </div>
    </div>
  );
}
