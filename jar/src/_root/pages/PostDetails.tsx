import Loader from "@/components/shared/Loader";
import PostStats from "@/components/shared/PostStats";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useDeletePost, useGetPostId } from "@/lib/react-query/queriesAndMutations"
import { multiFormatDateString } from "@/lib/utils";
import { Card } from "@nextui-org/card";
import { Link, useNavigate, useParams } from "react-router-dom"

const PostDetails = () => {
  const { id } = useParams();
  const { data: post, isPending } = useGetPostId(id || '');
  const { user } = useUserContext();
  const { mutateAsync: deletion, isPending: isDeleted} = useDeletePost();
  const navigate = useNavigate();

  const handleDeletePost = () => {
    deletion(id)
    console.log(isDeleted)
    navigate('/')
  }

  return (
    <div className="post_details-container">
      {isPending ? <Loader /> : (
        <div className="post_details-card">
          <Card className="post_details-img">
          <Card isBlurred className="shad-button_dark_4_add rounded-lg mb-4" shadow="sm">
                <p className="m-3">{post?.Update}</p>
            </Card>
            <Card isBlurred className={post?.Good === "" ? "hidden" : "rounded-lg mb-4 bg-green-500"} shadow="sm">
                <p className="m-3">{post?.Good}</p>
            </Card>
            <Card isBlurred className={post?.Bad === "" ? "hidden" : "rounded-lg bg-pink-500 mb-4"} shadow="sm">
                <p className="m-3">{post?.Bad}</p>
            </Card>
          </Card>
            <div className="post_details-info">
              <div className="flex-between w-full">
              <Link to={'/profile/${post.creator.$id}'} className="flex items-center gap-3">
                    <img src={post?.creator?.imageUrl || '/assets/icons/profile-placeholder.svg'}
                        alt="creator" className="rounded-full w-8 h-8 lg:w-12 lg:h-12" />
                
                <div className="flex flex-col">
                    <p className="base-medium lg:body-bold text-light-1">
                        @{post?.creator.username}
                    </p>
                    <div className="flex-left gap-2 text-light-3">
                        <p className="subtle-semibold lg:small-regular">
                            {multiFormatDateString(post?.$createdAt)}
                        </p>
                    </div>
                </div>
                </Link>

                <div className="flex-center">
                  <Link to={`/update-post/${post?.$id}`} className={`${user.id !== post?.creator.$id && 'hidden'}`}>
                    <img src="/assets/icons/edit.svg" width={24} height={24} alt="edit"/>
                  </Link>
                  <Button onClick={handleDeletePost} variant="ghost" className={`ghost_details-delete_btn ${user.id !== post?.creator.$id && 'hidden'}`}>
                    <img src="/assets/icons/delete.svg" width={24} height={24} alt="delete"/>
                  </Button>
                </div>
              </div>
              <hr className="border w-full border-dark-4/80"/>
              <div className="flex flex-col flex-1 w-full small-medium
              lg:base-regular">
              <ul className="flex gap-1">
                {post?.tags == "" ? "" : (
                    post?.tags.map((tag:string) => (
                    <li key={tag} className="text-light-3">
                        #{tag}
                        </li>
                    ))
                )}
                </ul>
              </div>
              <div className="w-full"> 
                  <PostStats post={post} userId={user.id}/>
              </div>
            </div>
        </div>  
      )}
    </div>
  )
}

export default PostDetails