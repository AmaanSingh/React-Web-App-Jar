import PostStats from "@/components/shared/PostStats";
import { useUserContext } from "@/context/AuthContext"
import { Card } from "@nextui-org/card";
import { Link } from "react-router-dom";

type GridPostListProps = {
  posts: Models.Document[];
  showUser?: boolean;
  showStats?: boolean;
}

const GridPostList = ({posts, showUser = true, showStats = true }: GridPostListProps) => {
  const { user } = useUserContext();

  return (
    <ul className="grid-container2">
      {posts.map((post) => (
        <li key={post.$id} className="relative min-w-80 h-full">
        <Link to={`/posts/${post.$id}`} className="flex rounded-[24px] overflow-hidden cursor-pointer h-full">
        
          <Card className="h-full rounded-t-[30px] xl:rounded-l-[24px] xl:rounded-tr-none object-cover w-full p-5 bg-dark-1">
          <Card isBlurred className="shad-button_dark_4_add rounded-lg mb-4" shadow="sm">
                <p className="m-3">{post?.Update}</p>
                {showUser && (
              <div className="flex items-center justify-start gap-1 flex-1 pl-2.5">
                <img src={post.creator.imageUrl} alt="creator" className="h-8 w-8 rounded-full" /> 
                <p className="line-clamp-1">@{post?.creator.username}</p>
                {post.Good === "" ? <img src='/assets/icons/good.svg' width={20} height={20} alt='filter'/> : <img src='/assets/icons/good-filled.svg' width={20} height={20} alt='filter'/> }
                {post.Bad === "" ? <img src='/assets/icons/bad.svg' width={20} height={20} alt='filter'/> : <img src='/assets/icons/bad-filled.svg' width={20} height={20} alt='filter'/> }
              </div>
            )}
            <div className="p-3">
            {showStats && <PostStats post={post} userId={user.id} />}
            </div>
            
           </Card>
          </Card>

        </Link>
        
        </li>
      ))}
    </ul>
  )
}

export default GridPostList